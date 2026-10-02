import { ScrollTrigger } from './motion';

// The one WebGL moment (Booking, desktop only, loaded on demand by Booking.jsx): rows of small dots, each slid off its
// column, that line up into a grid on the booking calendar's own rhythm while the calendar's days land (same scroll
// range as the calendar build, so the two read as one moment). Scrubbed, so it rewinds on the way back. It draws only when the scroll progress changes: no loop, nothing runs while idle.
// Dots never sit behind text: the two content columns are cut out of the field, so every text keeps its contrast.

const VERT = `#version 300 es
uniform vec2 uSize, uOrigin, uPitch;
uniform float uCols, uP, uDot;
uniform vec4 uAvoid[2];
uniform vec2 uPage; // left and right edge of the page column: the field fades out past it
out float vT;
out float vA;
float hash(float n) { return fract(sin(n) * 43758.5453); }
void main() {
  float id = float(gl_VertexID);
  vec2 home = uOrigin + vec2(mod(id, uCols), floor(id / uCols)) * uPitch;
  float t = clamp((uP - hash(id * 5.3 + 0.1) * 0.45) / 0.55, 0.0, 1.0); // each dot starts at its own moment
  t = 1.0 - pow(1.0 - t, 3.0);
  // Misaligned entries, not scattered stars: a dot stays on its row and slides sideways (up to 1.5 steps) into its column
  vec2 pos = home + vec2((hash(id * 1.7 + 0.3) - 0.5) * uPitch.x * 3.0 * (1.0 - t), 0.0);
  float a = 1.0 - smoothstep(0.0, uPitch.x * 2.0, max(uPage.x - pos.x, pos.x - uPage.y));
  for (int i = 0; i < 2; i++) { // fade out inside the content columns, over a 24px margin
    vec2 q = max(uAvoid[i].xy - pos, pos - uAvoid[i].zw);
    a *= smoothstep(0.0, 24.0, max(q.x, q.y));
  }
  vT = t;
  vA = a;
  gl_Position = vec4(pos / uSize * vec2(2, -2) + vec2(-1, 1), 0, 1);
  gl_PointSize = uDot;
}`;

// One quiet grey (between the rule colour #232227 and faint #82817c); a dot starts dimmer and reaches it as it settles
const FRAG = `#version 300 es
precision mediump float;
in float vT;
in float vA;
out vec4 color;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  if (dot(q, q) > 0.25 || vA < 0.01) discard;
  float a = vA * (0.35 + 0.65 * vT);
  color = vec4(vec3(0.255, 0.251, 0.263) * a, a);
}`;

export default function mountDotField(section) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none';
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return () => {};
  section.prepend(canvas);

  const cols = [...section.querySelectorAll('.page > div')]; // the text column and the calendar column
  let prog, u, st, n = 0, lost = false;
  const grid = { ox: 0, oy: 0, px: 40, py: 36, cols: 1, w: 1, h: 1, page: [0, 1], avoid: new Float32Array(8) };

  const init = () => {
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindVertexArray(gl.createVertexArray()); // no buffers: every dot comes from gl_VertexID
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    u = Object.fromEntries(['uSize', 'uOrigin', 'uPitch', 'uCols', 'uP', 'uDot', 'uAvoid', 'uPage'].map((k) => [k, gl.getUniformLocation(prog, k)]));
  };

  // Layout reads happen here only (resize, refresh), never while scrolling
  const measure = () => {
    const box = section.getBoundingClientRect();
    grid.w = Math.max(1, box.width);
    grid.h = Math.max(1, box.height);
    // Keep the last spacing when the calendar is hidden by the message form or replaced by the real calendar.
    const cal = section.querySelector('.grid-cols-7');
    if (cal && cal.getBoundingClientRect().width > 0) {
      const r = cal.getBoundingClientRect();
      const s = getComputedStyle(cal);
      const gapX = parseFloat(s.columnGap) || 0;
      const cellW = (r.width - gapX * 6) / 7;
      grid.px = cellW + gapX;
      const day = cal.querySelector('.cal-day')?.getBoundingClientRect(); // rows from a real day cell, not the weekday row (its centre holds while it scales)
      grid.py = (cal.querySelector('.cal-day')?.offsetHeight || 32) + (parseFloat(s.rowGap) || 0); // offsetHeight: the days scale in
      const x0 = r.left - box.left + cellW / 2;
      const y0 = day ? day.top - box.top + day.height / 2 : r.top - box.top + grid.py / 2;
      grid.ox = x0 - Math.ceil(x0 / grid.px) * grid.px;
      grid.oy = y0 - Math.ceil(y0 / grid.py) * grid.py;
    }
    grid.cols = Math.ceil((grid.w - grid.ox) / grid.px) + 1;
    n = grid.cols * (Math.ceil((grid.h - grid.oy) / grid.py) + 1);
    // Each column's content, from its first child to its last (the text column is stretched to the row, its content is not)
    cols.forEach((col, i) => {
      const kids = [...col.children].map((k) => k.getBoundingClientRect()).filter((k) => k.height);
      const a = kids.length ? [
        Math.min(...kids.map((k) => k.left)), Math.min(...kids.map((k) => k.top)),
        Math.max(...kids.map((k) => k.right)), Math.max(...kids.map((k) => k.bottom)),
      ] : [0, 0, 0, 0];
      grid.avoid.set([a[0] - box.left, a[1] - box.top, a[2] - box.left, a[3] - box.top], i * 4);
    });
    const pg = section.querySelector('.page').getBoundingClientRect();
    grid.page = [pg.left - box.left, pg.right - box.left];
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(8e6 / (grid.w * grid.h))); // at most 2, and about 8 MP in all
    const W = Math.round(grid.w * dpr), H = Math.round(grid.h * dpr);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; } // a resize clears the buffer
    grid.dpr = dpr;
  };

  const draw = () => {
    if (lost) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.uSize, grid.w, grid.h);
    gl.uniform2f(u.uOrigin, grid.ox, grid.oy);
    gl.uniform2f(u.uPitch, grid.px, grid.py);
    gl.uniform1f(u.uCols, grid.cols);
    gl.uniform1f(u.uP, st ? st.progress : 0);
    gl.uniform1f(u.uDot, 2 * grid.dpr);
    gl.uniform4fv(u.uAvoid, grid.avoid);
    gl.uniform2f(u.uPage, grid.page[0], grid.page[1]);
    gl.drawArrays(gl.POINTS, 0, n);
  };

  // Driven by the calendar preview's own range (its build runs 'top 88%' to 'bottom 80%' of the same box), so the
  // grid settles as the days land. Once the real calendar replaces the preview, the section's arrival drives it instead.
  // clamp(): the end is always reachable, also where the page runs out before it.
  const track = () => {
    st?.kill();
    const cal = section.querySelector('.grid-cols-7')?.parentElement;
    st = ScrollTrigger.create(cal
      ? { trigger: cal, start: 'top 88%', end: 'clamp(bottom 80%)', onUpdate: draw }
      : { trigger: section, start: 'top 80%', end: 'clamp(top 15%)', onUpdate: draw });
  };

  const relayout = () => {
    if (st && !st.trigger.isConnected) track(); // the preview was swapped (calendar opened, language switch)
    measure();
    draw();
  };
  const ro = new ResizeObserver(relayout);
  [section, ...cols.flatMap((c) => [...c.children])].forEach((el) => ro.observe(el));
  ScrollTrigger.addEventListener('refresh', relayout);

  const onLost = (e) => { e.preventDefault(); lost = true; };
  const onRestored = () => { lost = false; init(); draw(); };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  init();
  measure();
  track();
  draw();

  return () => {
    st.kill();
    ro.disconnect();
    ScrollTrigger.removeEventListener('refresh', relayout);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    canvas.remove();
  };
}
