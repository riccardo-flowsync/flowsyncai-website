import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

const HeroGraphic = () => {
  const graphicRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Floating motion
      gsap.to(".orb-container", {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      // Rotations
      gsap.to(".orb-1", { rotation: 360, duration: 25, repeat: -1, ease: "linear" });
      gsap.to(".orb-2", { rotation: -360, duration: 20, repeat: -1, ease: "linear" });
      gsap.to(".orb-3", { rotation: 360, duration: 30, repeat: -1, ease: "linear" });
    }, graphicRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={graphicRef} className="relative w-full aspect-square max-w-[500px] flex items-center justify-center hero-anim opacity-0 translate-y-8 pointer-events-none">
      {/* Deep glow backdrop */}
      <div className="absolute inset-10 bg-accent/20 rounded-full blur-[100px]" />
      
      <div className="orb-container relative w-full h-full flex items-center justify-center">
        {/* Abstract animated shapes */}
        <div className="orb-1 absolute w-[70%] h-[70%] bg-gradient-to-tr from-accent/40 to-transparent border border-accent/20 blur-[2px]"
             style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
             
        <div className="orb-2 absolute w-[65%] h-[65%] bg-gradient-to-bl from-accent/30 to-background border border-text/10 blur-[1px]"
             style={{ borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }} />
             
        <div className="orb-3 absolute w-[50%] h-[50%] bg-accent/10 border-[0.5px] border-accent/50 backdrop-blur-xl shadow-[inset_0_0_40px_rgba(157,124,255,0.3)]"
             style={{ borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%' }} />

        {/* Crisp Data Ring */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-text/10 border-dashed animate-[spin_40s_linear_infinite]" />
        
        {/* Core highlight */}
        <div className="absolute w-3 h-3 bg-white/80 blur-[2px] rounded-full shadow-[0_0_20px_rgba(255,255,255,1)]" />
      </div>

      {/* Decorative HUD Elements */}
      <div className="absolute top-[15%] left-[10%] font-mono text-[10px] text-text/50 tracking-widest border border-text/10 px-2 py-1 rounded backdrop-blur-sm">
        SYS.ONLINE
      </div>
      <div className="absolute bottom-[20%] right-[10%] flex items-end gap-1.5 h-6">
        <div className="w-1 h-3 bg-accent/60 animate-pulse" />
        <div className="w-1 h-full bg-accent/80 animate-pulse delay-75" />
        <div className="w-1 h-4 bg-accent/40 animate-pulse delay-150" />
      </div>
    </div>
  );
};

const Hero = () => {
  const comp = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(".hero-anim", {
        y: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.1
      });

      // Headline Blur Reveal
      gsap.to(".hero-drama-text", {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5
      });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={comp} className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 lg:px-24">
      
      {/* Content Container - Split Layout on Desktop */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 lg:gap-8">
        
        {/* Left Side text */}
        <div className="flex flex-col items-start text-left w-full lg:w-[65%] xl:w-[75%] z-20">
          <h1 className="mb-6 md:mb-8 w-full leading-[1.1]">
            <span className="hero-anim opacity-0 translate-y-8 font-heading font-bold text-3xl md:text-5xl lg:text-[3.25rem] text-text/90 tracking-tight uppercase inline-block mr-3 md:mr-5">
              Operational scaling beyond
            </span>
            <span className="hero-drama-text font-drama italic text-5xl md:text-7xl lg:text-[7rem] text-accent tracking-tighter inline-block relative translate-y-1 md:translate-y-2" style={{ filter: 'blur(8px)', opacity: 0 }}>
              Human limits.
            </span>
          </h1>
          
          <p className="hero-anim opacity-0 translate-y-8 font-sans text-lg md:text-xl text-text/70 max-w-2xl mb-10 md:mb-12 leading-relaxed">
            The definitive AI operations partner for B2B companies that want to scale without adding headcount.
          </p>
          
          <div className="hero-anim opacity-0 translate-y-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full sm:w-auto">
            <a href="#waitlist" className="bg-accent text-[#0a0a0b] font-sans font-bold text-base px-8 py-4 rounded-full btn-magnetic whitespace-nowrap shadow-[0_0_20px_rgba(157,124,255,0.3)] hover:shadow-[0_0_30px_rgba(157,124,255,0.5)] transition-shadow">
              Join the Waitlist
            </a>
            <div className="flex items-center px-2 py-2 opacity-60">
              <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse mr-3 shadow-[0_0_8px_rgba(157,124,255,1)]" />
              <span className="font-mono text-[0.65rem] sm:text-xs uppercase tracking-wider text-text/80">We're selective about who we work with.</span>
            </div>
          </div>
        </div>

        {/* Right Side - Custom GSAP Animation */}
        <div className="w-full lg:w-[35%] xl:w-[30%] flex justify-center lg:justify-end lg:mb-12 xl:mb-16">
          <HeroGraphic />
        </div>
      </div>
    </section>
  );
};

export default Hero;
