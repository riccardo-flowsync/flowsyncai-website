import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK, later } from '../lib/motion';

// Rounded turns are the flow; precise routes are the sync. Four traces frame the content.
const PATHS = [
  'M0 100H36Q52 100 52 116V360Q52 376 68 376H98Q114 376 114 392V710L62 762V1080Q62 1096 46 1096H0',
  'M0 138H12Q28 138 28 154V414L76 462V730L28 778V1190Q28 1206 44 1206H142',
  'M1440 72H1388Q1372 72 1372 88V288L1324 336V610Q1324 626 1340 626H1372Q1388 626 1388 642V1000L1336 1052V1350',
  'M1440 112H1420Q1404 112 1404 128V320L1360 364V576Q1360 592 1376 592H1404Q1420 592 1420 608V1028L1372 1076V1410',
];

export default function CircuitBackdrop() {
  const root = useRef(null);
  useGSAP((context) => later(context, () => {
    const mm = gsap.matchMedia(root.current);
    mm.add(MOTION_OK, () => {
      gsap.fromTo('.circuit-active', { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current.parentElement, start: 'top 35%', end: 'bottom 75%', scrub: 0.35 },
      });
    });
    return () => mm.revert();
  }), { scope: root });

  return (
    <div ref={root} className="circuit-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1440 1440" preserveAspectRatio="none" fill="none" strokeWidth="1" className="h-full w-full">
        {PATHS.map((d) => <g key={d}>
          <path d={d} stroke="#232227" vectorEffect="non-scaling-stroke" />
          <path d={d} className="circuit-active" pathLength="1" stroke="currentColor" strokeDasharray="1" vectorEffect="non-scaling-stroke" />
        </g>)}
      </svg>
    </div>
  );
}
