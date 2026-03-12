import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Protocol = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const steps = [
    {
      num: "01",
      title: "Discovery & Blueprint",
      desc: "We analyze your operations infrastructure to identify high-leverage bottlenecks and plot out comprehensive system architecture.",
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center rotate-motif-container">
          <svg viewBox="0 0 100 100" className="w-full h-full rotate-motif opacity-80" fill="none" stroke="currentColor" strokeWidth="0.5">
            {/* Outer concentric dashed ring */}
            <circle cx="50" cy="50" r="42" className="text-white/10" strokeDasharray="4 4" />
            {/* Middle tracking ring */}
            <circle cx="50" cy="50" r="32" className="text-white/20" />
            {/* Inner accent ring */}
            <circle cx="50" cy="50" r="22" className="text-accent/50" strokeDasharray="8 3" strokeWidth="1" />
            {/* Crosshairs */}
            <path d="M50 4 L50 20 M50 80 L50 96 M4 50 L20 50 M80 50 L96 50" className="text-accent" strokeWidth="1" />
            <path d="M17 17 L28 28 M83 83 L72 72 M17 83 L28 72 M83 17 L72 28" className="text-white/20" strokeWidth="0.5" />
            {/* Core Box */}
            <rect x="45" y="45" width="10" height="10" className="text-accent fill-accent/20" strokeWidth="1" />
            <circle cx="50" cy="50" r="2" className="fill-white" />
          </svg>
        </div>
      )
    },
    {
      num: "02",
      title: "System Integration",
      desc: "Full-stack deployment across your existing tools. Seamless API bridging transforms disparate apps into a unified operations engine.",
      graphic: (
        <div className="laser-container relative w-full h-full rounded overflow-hidden flex items-center justify-center border border-white/5">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]" />
          
          {/* Data Nodes */}
          <div className="absolute top-[20%] left-[30%] w-2 h-2 rounded-full bg-white/30" />
          <div className="absolute top-[60%] left-[20%] w-2 h-2 rounded-full bg-white/30" />
          <div className="absolute top-[40%] left-[70%] w-3 h-3 rounded-full bg-accent/50" />
          <div className="absolute top-[80%] left-[60%] w-2 h-2 rounded-full bg-white/30" />

          {/* The scanning laser line */}
          <div className="laser-line absolute top-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_20px_rgba(157,124,255,1)] z-10">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-white blur-[1px]" />
          </div>
          
          {/* Laser fade trailing effect */}
          <div className="laser-fade absolute top-0 left-0 w-full h-16 bg-gradient-to-t from-accent/20 to-transparent pointer-events-none" />
        </div>
      )
    },
    {
      num: "03",
      title: "Autonomous Operation",
      desc: "The AI takes over daily execution. Lead scoring, ticketing, and scheduling run continuously, scaling your output without headcount.",
      graphic: (
        <svg viewBox="0 0 100 50" className="w-full h-full opacity-90 overflow-visible" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path 
            className="text-accent ekg-path"
            d="M0,25 L20,25 L25,10 L30,40 L35,25 L100,25" 
            strokeDasharray="150" 
            strokeDashoffset="150"
            style={{ filter: 'drop-shadow(0 0 10px rgba(157,124,255,0.8))' }}
          />
          <path 
            className="text-white/10"
            d="M0,25 L20,25 L25,10 L30,40 L35,25 L100,25" 
          />
        </svg>
      )
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        // Effect when next card rolls over
        if (index < cardsRef.current.length - 1) {
          gsap.to(card.querySelector('.card-inner'), {
            scale: 0.9,
            opacity: 0.4,
            filter: "blur(20px)",
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: cardsRef.current[index + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            }
          });
        }

        // Upward Drift Entry Animation for the whole card
        gsap.from(card.querySelector('.card-inner'), {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        });

        // Staggered text entry inside the card
        gsap.from(card.querySelectorAll('.text-anim'), {
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            toggleActions: "play none none reverse"
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out"
        });
      });
      
      // Card 1 animation: Slowly rotating geometric motif
      gsap.to(".rotate-motif", {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: "none",
        transformOrigin: "center"
      });
      
      // Card 2 animation: Scanning horizontal laser-line
      gsap.fromTo([".laser-line", ".laser-fade"], 
        { y: -20 },
        {
          y: 400, // Move down across the container
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );
      
      // Card 3 animation: Pulsing waveform
      gsap.to(".ekg-path", {
        strokeDashoffset: 0,
        duration: 2.5,
        repeat: -1,
        ease: "linear"
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="protocol" className="relative w-full bg-background pt-32 pb-32">
      <div className="text-center w-full relative z-10 px-6 mb-12">
        <span className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4 block">Methodology</span>
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-text">
          Operations Protocol
        </h2>
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <div 
            key={i}
            ref={el => cardsRef.current[i] = el}
            className="w-full h-[100vh] lg:h-[85vh] flex flex-col items-center justify-center p-6 md:p-8 sticky top-0"
            style={{ zIndex: i + 1 }}
          >
            <div className="card-inner w-full h-[80vh] lg:h-[70vh] rounded-[3rem] glass-panel bg-[#0b0b0e] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/5 mx-auto">
              
              <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center h-1/2 md:h-full relative z-10">
                <span className="text-anim font-mono text-xs text-accent mb-6 bg-accent/5 border border-accent/20 px-3 py-1.5 rounded w-fit uppercase tracking-widest">
                  PHASE {step.num}
                </span>
                <h3 className="text-anim font-heading font-bold text-3xl md:text-4xl text-text mb-6 leading-tight">
                  {step.title}
                </h3>
                <p className="text-anim font-sans text-base md:text-lg text-text/60 leading-relaxed max-w-md">
                  {step.desc}
                </p>
              </div>
              
              <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#050505] border-t md:border-t-0 md:border-l border-white/5 flex items-center justify-center p-8 md:p-16 relative overflow-hidden">
                 {/* Decorative background glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
                 <div className="w-48 h-48 md:w-72 md:h-72 relative z-10 flex items-center justify-center">
                    {step.graphic}
                 </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Protocol;
