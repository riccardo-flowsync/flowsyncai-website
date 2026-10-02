import { useEffect, useRef } from 'react';

// The environment is enhancement only. All work, text and controls live in HTML.
export default function WorkspaceEnvironment() {
  const host = useRef(null);
  useEffect(() => {
    const element = host.current;
    const world = element.closest('.workspace-world');
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let live = true, dispose = () => {}, idle;
    if (media.matches) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const load = () => import('../lib/workspaceScene').then(({ createWorkspace }) => {
        if (live && !media.matches) dispose = createWorkspace(element, world);
      }).catch(() => { element.dataset.render = 'fallback'; });
      idle = window.requestIdleCallback ? requestIdleCallback(load, { timeout: 1600 }) : setTimeout(load, 100);
    }, { rootMargin: '200px' });
    observer.observe(world);
    const stop = () => { if (media.matches) dispose(); };
    media.addEventListener('change', stop);
    return () => {
      live = false;
      observer.disconnect();
      media.removeEventListener('change', stop);
      if (window.cancelIdleCallback) cancelIdleCallback(idle); else clearTimeout(idle);
      dispose();
    };
  }, []);
  return <div ref={host} className="workspace-environment" aria-hidden="true" />;
}
