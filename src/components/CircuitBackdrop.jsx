import { useId, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, useGSAP, MOTION_OK, later } from '../lib/motion';

// Broad routes cross the canvas at different depths; the content sits above them.
const PATHS = [
  'M-40 220H250Q280 220 280 250V560L420 700V1040Q420 1070 450 1070H860Q890 1070 890 1100V1550L730 1710V2110Q730 2140 700 2140H220Q190 2140 190 2170V2780L430 3020V3460Q430 3490 460 3490H980Q1010 3490 1010 3520V4090L830 4270V4830Q830 4860 800 4860H350Q320 4860 320 4890V5470L540 5690V6210Q540 6240 570 6240H1050Q1080 6240 1080 6270V7200',
  'M1480 100H1180Q1150 100 1150 130V490L1010 630V930Q1010 960 980 960H570Q540 960 540 990V1640L360 1820V2340Q360 2370 390 2370H1090Q1120 2370 1120 2400V2900L920 3100V3700Q920 3730 890 3730H310Q280 3730 280 3760V4400L470 4590V5200Q470 5230 500 5230H1170Q1200 5230 1200 5260V5880L990 6090V6680Q990 6710 960 6710H650Q620 6710 620 6740V7200',
  'M650 0V300L800 450V770Q800 800 830 800H1360Q1390 800 1390 830V1370L1180 1580V1940Q1180 1970 1150 1970H500Q470 1970 470 2000V2610L650 2790V3220Q650 3250 680 3250H1230Q1260 3250 1260 3280V3890L1090 4060V4580Q1090 4610 1060 4610H650Q620 4610 620 4640V5600L780 5760V6420Q780 6450 750 6450H210Q180 6450 180 6480V7200',
];

export default function CircuitBackdrop() {
  const root = useRef(null);
  const id = useId();
  const home = useLocation().pathname === '/';
  useGSAP((context) => {
    if (!home) return;
    later(context, () => {
      const mm = gsap.matchMedia(root.current);
      mm.add(MOTION_OK, () => {
        // The light stays in view and finishes when the footer reaches the bottom.
        gsap.fromTo('.circuit-reveal', { attr: { height: 0 } }, {
          attr: { height: 7200 },
          ease: 'none',
          scrollTrigger: { trigger: root.current.parentElement, start: 'top 65%', end: 'bottom bottom', scrub: 0.2 },
        });
      });
      return () => mm.revert();
    });
  }, { scope: root, dependencies: [home], revertOnUpdate: true });

  if (!home) return null;
  return (
    <div ref={root} className="circuit-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1440 7200" preserveAspectRatio="none" fill="none" stroke="currentColor" className="circuit-field h-full w-full">
        <defs>
          <clipPath id={id}><rect className="circuit-reveal" width="1440" height="7200" /></clipPath>
        </defs>
        <g opacity="0.1" strokeWidth="1">
          {PATHS.map((d) => <path key={d} d={d} vectorEffect="non-scaling-stroke" />)}
        </g>
        <g clipPath={`url(#${id})`}>
          {[0, 1].map((layer) => (
            <g key={layer} transform={layer ? 'translate(24 -24)' : undefined} opacity={layer ? 0.14 : 0.34} strokeWidth={layer ? 0.8 : 1.3}>
              {PATHS.map((d) => <path key={d} d={d} className="circuit-active" vectorEffect="non-scaling-stroke" />)}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
