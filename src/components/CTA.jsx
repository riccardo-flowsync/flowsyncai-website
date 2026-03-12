import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="w-full relative py-32 md:py-48 px-6 bg-background overflow-hidden flex items-center justify-center">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-accent/10 blur-[100px] rounded-[100%] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center">
        <h2 className="font-heading font-bold text-4xl md:text-6xl text-text mb-6 leading-tight">
          Ready to scale <span className="font-drama italic text-accent font-normal mr-2">without</span> headcount?
        </h2>
        <p className="font-sans text-xl text-text/60 mb-12 max-w-xl leading-relaxed">
          We're selective about who we work with. Join the waitlist and we'll reach out when we have a spot open.
        </p>
        
        <a href="#waitlist" className="group relative overflow-hidden bg-text text-[#0a0a0b] font-sans font-bold text-lg px-8 py-4 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(244,243,237,0.15)] flex items-center">
          <span className="relative z-10 flex items-center transition-colors group-hover:text-white">
            Join the Waitlist
            <ArrowRight className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
        </a>
      </div>
    </section>
  );
};

export default CTA;
