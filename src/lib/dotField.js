import { ScrollTrigger } from './motion';

// The one WebGL moment (Booking, desktop only, loaded on demand by Booking.jsx): a sparse field of small dots that
// settles from scattered into a grid on the booking calendar's own 7-column rhythm as the section scrolls in. Scrubbed,
// so it rewinds on the way back. It draws only when the scroll progress changes: no loop, nothing runs while idle.
// Dots never sit behind text: the two content columns are cut out of the field, so every text keeps its contrast.

const VERT = `#version 300 es
uniform vec2 uSize, uOrigin, uPitch;
uniform float uCols, uP, uDot;
uniform vec4 uAvoid[2];
out float vT;
out float vA;
float hash(float n) { return fract(sin(n) * 43758.5453); }
void main() {
  float id = float(gl_VertexID);
  vec2 home = uOrigin + vec2(mod(id, uCols), floor(id / uCols)) * uPitch;
  float t = clamp((uP - hash(id * 5.3 + 0.1) * 0.45) / 0.55, 0.0, 1.0); // each dot starts at its own moment
  t = 1.0 - pow(1.0 - t, 3.0);
  vec2 pos = home + (vec2(hash(id * 1.7 + 0.3), hash(id * 3.1 + 0.7)) - 0.5) * uPitch * 5.0 * (1.0 - t);
  float a = 1.0;
  for (int i = 0; i < 2; i++) { // fade out inside the content columns, over a 24px margin
    vec2 q = max(uAvoid[i].xy - pos, pos - uAvoid[i].zw);
    a *= smoothstep(0.0, 24.0, max(q.x, q.y));
  }
  vT = t;
  vA = a;
  gl_Position = vec4(pos / uSize * vec2(2, -2) + vec2(-1, 1), 0, 1);
  gl_PointSize = uDot;
}`;

// Moving dots in faint, settled dots in the colour of the site's rules
const FRAG = `#version 300 es
precision mediump float;
in float vT;
in float vA;
out vec4 color;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  if (dot(q, q) > 0.25 || vA < 0.01) discard;
  vec3 c = mix(vec3(0.510, 0.506, 0.486), vec3(0.137, 0.133, 0.153), vT * 0.7);
  color = vec4(c * vA, vA);
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
  const grid = { ox: 0, oy: 0, px: 40, py: 36, cols: 1, w: 1, h: 1, avoid: new Float32Array(8) };

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
    u = Object.fromEntries(['uSize', 'uOrigin', 'uPitch', 'uCols', 'uP', 'uDot', 'uAvoid'].map((k) => [k, gl.getUniformLocation(prog, k)]));
  };

  // Layout reads happen here only (resize, refresh), never while scrolling
  const measure = () => {
    const box = section.getBoundingClientRect();
    grid.w = Math.max(1, box.width);
    grid.h = Math.max(1, box.height);
    // The calendar's day grid gives the rhythm; once the real calendar has replaced it, the last rhythm stays
    const cal = section.querySelector('.grid-cols-7');
    if (cal) {
      const r = cal.getBoundingClientRect();
      const s = getComputedStyle(cal);
      const gapX = parseFloat(s.columnGap) || 0;
      const cellW = (r.width - gapX * 6) / 7;
      grid.px = cellW + gapX;
      grid.py = (cal.querySelector('.cal-day')?.offsetHeight || 32) + (parseFloat(s.rowGap) || 0);
      const x0 = r.left - box.left + cellW / 2;
      const y0 = r.top - box.top + grid.py / 2;
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(8e6 / (grid.w * grid.h))); // at most 2, and about 8 MP in all
    canvas.width = Math.round(grid.w * dpr);
    canvas.height = Math.round(grid.h * dpr);
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
    gl.drawArrays(gl.POINTS, 0, n);
  };

  const relayout = () => { measure(); draw(); };
  const ro = new ResizeObserver(relayout);
  [section, ...cols.flatMap((c) => [...c.children])].forEach((el) => ro.observe(el));
  ScrollTrigger.addEventListener('refresh', relayout);

  const onLost = (e) => { e.preventDefault(); lost = true; };
  const onRestored = () => { lost = false; init(); draw(); };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  init();
  measure();
  // From the section entering to its top reaching the navbar area: landing on #book shows the finished grid
  st = ScrollTrigger.create({ trigger: section, start: 'top bottom', end: 'top 15%', onUpdate: draw });
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
