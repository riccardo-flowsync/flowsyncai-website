import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Waitlist = () => {
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const sectionRef = useRef(null);
  const popupRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance animation for the section
      gsap.from(".waitlist-anim", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (status === 'success') {
      let ctx = gsap.context(() => {
        // Pop-up animate in
        gsap.fromTo(popupRef.current, 
          { scale: 0.9, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" }
        );
        
        // Checkmark animation
        gsap.fromTo(".check-path", 
          { strokeDashoffset: 100 },
          { strokeDashoffset: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
        );
        
        // Quote text stagger
        gsap.fromTo(".quote-anim",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.6, ease: "power2.out" }
        );

        // Auto-hide popup after 6 seconds
        setTimeout(() => {
          gsap.to(popupRef.current, {
            scale: 0.9,
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
              setStatus('idle');
              setFormData({ name: '', email: '', company: '' }); // Reset form
            }
          });
        }, 6000);
        
      });
      return () => ctx.revert();
    }
  }, [status]);

  return (
    <section ref={sectionRef} id="waitlist" className="relative w-full py-32 bg-[#050505] overflow-hidden flex items-center justify-center -mt-10">
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(157,124,255,0.05)_0%,transparent_50%)]" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="relative z-10 w-full max-w-2xl px-6 lg:px-0">
        <div className="text-center mb-12">
          <span className="waitlist-anim font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4 block">Initialization</span>
          <h2 className="waitlist-anim font-heading font-bold text-3xl md:text-5xl text-text mb-4">
            Join the Waitlist
          </h2>
          <p className="waitlist-anim font-sans text-text/60 text-lg">
            Secure your position for the next onboarding cohort.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-20 flex flex-col gap-5 w-full bg-[#0a0a0b] border border-white/5 p-8 md:p-10 rounded-3xl glass-panel shadow-[0_20px_60px_rgba(0,0,0,0.4)] waitlist-anim">
          
          <div className="flex flex-col md:flex-row gap-5">
             <div className="flex-1 space-y-2">
               <label className="font-mono text-[10px] text-text/50 uppercase tracking-widest pl-1">Full Name</label>
               <input 
                 type="text" 
                 required
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-text font-sans focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-colors placeholder:text-text/20"
                 placeholder="John Doe"
               />
             </div>
             
             <div className="flex-1 space-y-2">
               <label className="font-mono text-[10px] text-text/50 uppercase tracking-widest pl-1">Work Email</label>
               <input 
                 type="email" 
                 required
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-text font-sans focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-colors placeholder:text-text/20"
                 placeholder="john@company.com"
               />
             </div>
          </div>
          
          <div className="space-y-2 mb-2">
             <label className="font-mono text-[10px] text-text/50 uppercase tracking-widest pl-1">Company Name</label>
             <input 
               type="text" 
               required
               value={formData.company}
               onChange={(e) => setFormData({...formData, company: e.target.value})}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-text font-sans focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-colors placeholder:text-text/20"
               placeholder="Acme Corp"
             />
          </div>

          <button 
            type="submit" 
            disabled={status !== 'idle'}
            className="w-full bg-accent text-[#0a0a0b] font-sans font-bold text-base px-8 py-4 rounded-xl mt-2 flex items-center justify-center transition-all hover:shadow-[0_0_30px_rgba(157,124,255,0.4)] disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {status === 'submitting' ? (
               <div className="w-5 h-5 border-2 border-[#0a0a0b]/20 border-t-[#0a0a0b] rounded-full animate-spin" />
            ) : (
               <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                 Initialize Request 
                 <span className="text-xl leading-none">&rarr;</span>
               </span>
            )}
          </button>
        </form>
      </div>

      {/* Success Popup Overlay */}
      {status === 'success' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none">
          {/* Backdrop blur block */}
          <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-md pointer-events-auto" />
          
          <div ref={popupRef} className="relative z-10 w-full max-w-lg bg-[#0a0a0b] border border-accent/30 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(157,124,255,0.15)] overflow-hidden flex flex-col items-center text-center pointer-events-auto">
            
            {/* Animated SVG Check */}
            <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-8 relative">
               <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping opacity-20" />
               <svg viewBox="0 0 50 50" className="w-10 h-10 text-accent" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                 <path 
                   className="check-path" 
                   d="M14 27 L22 35 L38 15" 
                   strokeDasharray="100" 
                   strokeDashoffset="100" 
                 />
               </svg>
            </div>
            
            <h3 className="quote-anim font-heading font-bold text-2xl text-text mb-2">Request Confirmed</h3>
            <p className="quote-anim font-mono text-xs text-accent uppercase tracking-widest mb-10">System Initializing</p>
            
            <div className="quote-anim relative">
              <span className="absolute -top-4 -left-4 text-4xl text-accent/20 font-serif font-black">"</span>
              <p className="font-sans text-lg md:text-xl leading-relaxed text-text/80 italic relative z-10 px-4">
                The first rule of any technology used in a business is that automation applied to an efficient operation will magnify the efficiency.
              </p>
              <span className="absolute -bottom-4 -right-4 text-4xl text-accent/20 font-serif font-black rotate-180">"</span>
            </div>
            
            <div className="quote-anim mt-6 flex items-center gap-3">
               <div className="w-8 h-[1px] bg-accent/40" />
               <span className="font-heading font-bold text-accent tracking-wide">Bill Gates</span>
               <div className="w-8 h-[1px] bg-accent/40" />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Waitlist;
