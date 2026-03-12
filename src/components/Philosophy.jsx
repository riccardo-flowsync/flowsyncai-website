import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper to wrap words in spans for GSAP
const splitTextToSpans = (text, isBold = false, isAccent = false) => {
  return text.split(' ').map((word, i) => (
    <span 
      key={(word + i)} 
      className={`inline-block mr-[0.25em] mb-[0.2em] opacity-20 reveal-word ${isBold ? 'font-bold text-text' : ''} ${isAccent ? 'font-sans text-accent' : ''}`}
    >
      {word}
    </span>
  ));
};

const Philosophy = () => {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Find all the newly created spans
      const words = gsap.utils.toArray('.reveal-word');

      // The Scrubbing scroll animation
      gsap.to(words, {
        scrollTrigger: {
          trigger: textContainerRef.current,
          start: "top 80%", // Starts revealing exactly when the block enters the bottom 20% of the screen
          end: "bottom 50%",   // Finishes revealing when the BOTTOM of the block hits the middle of the screen
          scrub: true,      // Bind directly to the scrollbar
        },
        opacity: 1,
        stagger: 0.1,       // Reveal one after another
        ease: "none"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="philosophy" className="relative w-full pt-16 pb-16 md:pt-24 md:pb-24 bg-[#050505] overflow-visible flex items-center justify-center">
      
      {/* Background Texture Engine */}
      <div 
        className="absolute inset-0 h-[100%] w-full opacity-[0.03] select-none pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1623868512530-97b77ab2d674?q=80&w=2000&auto=format&fit=crop")' }}
      />
      
      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0a0a0b] to-transparent z-10" />
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0b] to-transparent z-10" />

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-7xl px-6 md:px-12 mx-auto flex flex-col-reverse md:flex-row gap-16 md:gap-24 items-start">
        
        {/* LEFT SIDE: The Monolith Text (Scrubbing) */}
        <div 
          ref={textContainerRef}
          className="w-full md:w-1/2 text-left text-sm md:text-lg font-sans text-white/90 font-light leading-[1.8] md:leading-[1.8] tracking-normal"
        >
          <div className="mb-8 md:mb-10">
            {splitTextToSpans("In Greek mythology, Hephaestus walked into fire while others ran.", true)}
            {splitTextToSpans(" He took the most dangerous force in existence and hammered it into precision. Same fire. Completely different outcome. The difference was structure.")}
          </div>
          
          <div className="mb-8 md:mb-10">
            {splitTextToSpans("AI is the fire of our generation.", true)}
            {splitTextToSpans(" Most businesses have already gotten burned. Not because AI isn't powerful. Because raw power without structure is just chaos with a price tag.")}
          </div>

          <div className="mb-8 md:mb-10">
            {splitTextToSpans("We are the forge.", true)}
            {splitTextToSpans(" We take that chaotic force and build it into systems that run without errors, execute without deviation, and scale without headcount.")}
          </div>

          <div className="mb-8 md:mb-10">
            {splitTextToSpans("We don't ask you to trust our word. We hand you the weapon and let it speak for itself. That's why every system we build comes with guarantees. Not because we're confident in our pitch. Because we're confident in our forge.", false, true)}
          </div>
        </div>

        {/* RIGHT SIDE: The Sticky Title */}
        <div className="w-full md:w-1/2 relative md:sticky md:top-[30vh] flex flex-col items-start md:items-start text-left">
          <span className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4 block opacity-80">
            Philosophy
          </span>
          <div className="relative mb-20 md:mb-0">
            {/* Amber Forge Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-orange-500/15 blur-[60px] rounded-[100%] pointer-events-none" />
            <h2 className="relative z-10 font-heading font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-text leading-tight uppercase w-full tracking-normal">
              <span className="whitespace-nowrap">THE HEPHAESTUS</span><br/>
              <span className="text-gradient-accent">FORGE</span>
            </h2>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Philosophy;
