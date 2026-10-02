import { useId, useRef } from 'react';
import { gsap, useGSAP, MOTION_OK, later } from '../lib/motion';

// Rounded turns are the flow; precise routes are the sync. Four traces frame the content.
const PATHS = [
  [
    'M0 100H36Q52 100 52 116V360Q52 376 68 376H98Q114 376 114 392V710L62 762V1080Q62 1096 46 1096H22Q6 1096 6 1112V1440',
    'M0 138H12Q28 138 28 154V414L76 462V730L28 778V1190Q28 1206 44 1206H114Q130 1206 130 1222V1440',
  ],
  [
    'M1440 72H1388Q1372 72 1372 88V288L1324 336V610Q1324 626 1340 626H1372Q1388 626 1388 642V1000L1336 1052V1440',
    'M1440 112H1420Q1404 112 1404 128V320L1360 364V576Q1360 592 1376 592H1404Q1420 592 1420 608V1028L1372 1076V1440',
  ],
];

export default function CircuitBackdrop() {
  const root = useRef(null);
  const id = useId();
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      // Reveal by page height, so the light reaches the same visible point on every path.
      gsap.fromTo('.circuit-reveal', { attr: { height: 0 } }, {
        attr: { height: 1440 },
        ease: 'none',
        scrollTrigger: { trigger: root.current.parentElement, start: 'top 65%', end: 'bottom 65%', scrub: 0.2 },
      });
    });
    return () => mm.revert();
  }), { scope: root });

  return (
    <div ref={root} className="circuit-backdrop" aria-hidden="true">
      {PATHS.map((paths, side) => {
        const x = side === 0 ? 0 : 1280;
        const clip = `${id}-circuit-${side}`;
        return (
          <svg key={side} viewBox={`${x} 0 160 1440`} preserveAspectRatio="none" fill="none" strokeWidth="1" className={`circuit-rail ${side === 0 ? 'left-0' : 'right-0'}`}>
            <defs>
              <clipPath id={clip}><rect className="circuit-reveal" x={x} width="160" height="1440" /></clipPath>
            </defs>
            {paths.map((d) => <path key={d} d={d} stroke="#232227" vectorEffect="non-scaling-stroke" />)}
            <g clipPath={`url(#${clip})`}>
              {paths.map((d) => <path key={d} d={d} className="circuit-active" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />)}
            </g>
          </svg>
        );
      })}
    </div>
  );
}
