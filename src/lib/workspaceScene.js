// Keep WebGL preparation and drawing off the main thread used by navigation and scrolling.
export function createWorkspace(host, world) {
  const canvas = document.createElement('canvas');
  if (!canvas.transferControlToOffscreen) { host.dataset.render = 'fallback'; return () => {}; }
  let worker;
  try { worker = new Worker(new URL('./workspaceRenderer.js', import.meta.url), { type: 'module' }); }
  catch { host.dataset.render = 'fallback'; return () => {}; }
  host.appendChild(canvas);
  let frame = 0, visible = true, stopped = false;
  const send = (data) => { if (!stopped) worker.postMessage(data); };
  worker.onmessage = ({ data }) => {
    if (stopped) return;
    host.dataset.render = data.type === 'rendered' ? 'webgl' : 'fallback';
    if (data.type === 'fallback') canvas.style.display = 'none';
  };
  worker.onerror = () => { host.dataset.render = 'fallback'; canvas.style.display = 'none'; };
  const offscreen = canvas.transferControlToOffscreen();
  worker.postMessage({ type: 'init', canvas: offscreen, width: host.clientWidth, height: host.clientHeight, ratio: Math.min(devicePixelRatio, innerWidth < 700 ? 1 : 1.5) }, [offscreen]);
  const draw = () => {
    frame = 0;
    if (!visible || document.hidden || stopped) return;
    const rect = world.getBoundingClientRect();
    send({ type: 'scroll', progress: Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight))) });
  };
  const request = () => { if (!stopped && !frame) frame = requestAnimationFrame(draw); };
  const resize = new ResizeObserver(() => send({ type: 'resize', width: host.clientWidth, height: host.clientHeight }));
  resize.observe(host);
  const visibility = () => { send({ type: 'visible', visible: visible && !document.hidden }); request(); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); });
  observer.observe(world);
  window.addEventListener('scroll', request, { passive: true });
  document.addEventListener('visibilitychange', visibility);
  request();
  return () => {
    stopped = true;
    cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
    window.removeEventListener('scroll', request);
    document.removeEventListener('visibilitychange', visibility);
    worker.terminate(); canvas.remove(); host.dataset.render = 'fallback';
  };
}
