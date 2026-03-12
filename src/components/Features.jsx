import React, { useState, useEffect, useRef } from 'react';
import { Activity, MousePointer2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ShufflerCard = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Data Pipeline', color: 'from-accent/20 to-transparent' },
    { id: 2, title: 'Automation Engine', color: 'from-purple-500/20 to-transparent' },
    { id: 3, title: 'Operations Hub', color: 'from-indigo-500/20 to-transparent' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev];
        const last = newCards.pop();
        newCards.unshift(last);
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-48 flex items-center justify-center -mt-4">
      {cards.map((card, i) => {
        const isTop = i === 0;
        const scale = 1 - i * 0.1;
        const translateY = i * 20;
        const opacity = 1 - i * 0.3;
        const zIndex = 3 - i;

        return (
          <div
            key={card.id}
            className={`absolute w-11/12 md:w-[90%] h-24 rounded-2xl border border-white/10 glass-panel flex items-center px-6 transition-all bg-gradient-to-r ${card.color}`}
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              zIndex,
              transitionDuration: '800ms',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="flex items-center space-x-4 w-full">
              <div className={`w-2 h-2 rounded-full ${isTop ? 'bg-accent shadow-[0_0_8px_rgba(157,124,255,1)]' : 'bg-white/20'}`} />
              <span className={`font-mono text-sm ${isTop ? 'text-text' : 'text-text/50'}`}>{card.title}</span>
              {isTop && <Activity className="w-4 h-4 ml-auto text-accent opacity-80" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TypewriterCard = () => {
  const [text, setText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Executing meeting book action...",
    "Scoring inbound lead data...",
    "Creating priority support ticket...",
    "Rescheduling conflicting demo..."
  ];

  useEffect(() => {
    let currentText = '';
    let charIndex = 0;
    const targetMessage = messages[messageIndex];
    let isDeleting = false;
    let timeoutId;

    const type = () => {
      if (!isDeleting && charIndex <= targetMessage.length) {
        currentText = targetMessage.substring(0, charIndex);
        setText(currentText);
        charIndex++;
        timeoutId = setTimeout(type, Math.random() * 50 + 30);
      } else if (!isDeleting && charIndex > targetMessage.length) {
        isDeleting = true;
        timeoutId = setTimeout(type, 1500);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        currentText = targetMessage.substring(0, charIndex);
        setText(currentText);
        timeoutId = setTimeout(type, 20);
      } else {
        isDeleting = false;
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }
    };

    timeoutId = setTimeout(type, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line
  }, [messageIndex]);

  return (
    <div className="w-full h-48 bg-[#0a0a0b] border border-white/5 rounded-2xl flex flex-col p-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(157,124,255,0.8)]" />
          <span className="font-mono text-xs text-text/60 uppercase tracking-widest">Live Feed</span>
        </div>
        <div className="text-[10px] text-text/30 font-mono">SYS.LOG</div>
      </div>
      <div className="flex-1 font-mono text-sm text-text/80 relative z-10">
        <span className="text-accent/80 mr-2 text-xs">»</span>
        <span>{text}</span>
        <span className="inline-block w-2.5 h-4 bg-accent align-middle ml-1 animate-[pulse_1s_step-end_infinite]" />
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700 z-0" />
    </div>
  );
};

const PipelineCard = () => {
  const nodeRef1 = useRef(null);
  const nodeRef2 = useRef(null);
  const nodeRef3 = useRef(null);
  const packetRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      
      // Initial state
      tl.set(packetRef.current, { x: 10, y: 30, opacity: 0, scale: 0.5 });
      tl.set([nodeRef1.current, nodeRef2.current, nodeRef3.current], { 
        borderColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(255,255,255,0.02)'
      });

      // Packet appear & Node 1 active
      tl.to(packetRef.current, { opacity: 1, scale: 1, duration: 0.3 })
        .to(nodeRef1.current, { borderColor: 'rgba(157,124,255,0.5)', backgroundColor: 'rgba(157,124,255,0.1)', duration: 0.2 }, "<");
      
      // Move to Node 2
      tl.to(packetRef.current, { x: 130, duration: 1, ease: "power1.inOut" })
        .to(nodeRef1.current, { borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)', duration: 0.2 }, "-=0.2")
        .to(nodeRef2.current, { borderColor: 'rgba(157,124,255,0.5)', backgroundColor: 'rgba(157,124,255,0.1)', duration: 0.2 }, "<");

      // Split or move to Node 3 (Simulate processing)
      tl.to(nodeRef2.current, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 })
        .to(packetRef.current, { scale: 1.5, opacity: 0, duration: 0.2 }, "-=0.1"); // Packet gets "processed"
      
      tl.to(nodeRef2.current, { borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)', duration: 0.2 })
        .to(nodeRef3.current, { borderColor: 'rgba(157,124,255,0.5)', backgroundColor: 'rgba(157,124,255,0.1)', duration: 0.2 }, "<");
      
      // Node 3 completion state
      tl.to(nodeRef3.current, { scale: 1.05, duration: 0.2, ease: "back.out(1.5)" })
        .to(nodeRef3.current, { scale: 1, duration: 0.2 })
        .to(nodeRef3.current, { borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)', duration: 0.2, delay: 0.5 });

    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full h-48 bg-[#121214] border border-white/5 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group">
      <div className="flex justify-between items-center w-full mb-2">
        <span className="font-mono text-[10px] text-accent/80 uppercase tracking-widest bg-accent/10 px-2 py-1 rounded">Routing Engine</span>
      </div>
      
      <div className="relative w-full h-full flex items-center justify-between px-2 mt-4">
        {/* Background track line */}
        <div className="absolute top-1/2 left-8 right-8 h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
        
        {/* Nodes */}
        <div ref={nodeRef1} className="w-12 h-12 rounded-lg border border-white/5 bg-white/5 z-10 flex items-center justify-center transition-colors">
          <span className="font-mono text-[9px] text-text/40">IN</span>
        </div>
        
        <div ref={nodeRef2} className="w-14 h-14 rounded-full border border-white/5 bg-white/5 z-10 flex items-center justify-center backdrop-blur-sm transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="w-6 h-6 rounded-full border border-dashed border-text/20 animate-[spin_4s_linear_infinite]" />
        </div>
        
        <div ref={nodeRef3} className="w-12 h-12 rounded-lg border border-white/5 bg-white/5 z-10 flex items-center justify-center transition-colors flex-col gap-1">
          <div className="w-4 h-1 bg-white/20 rounded-full" />
          <div className="w-4 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Moving Packet */}
        <div 
          ref={packetRef}
          className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(157,124,255,1)] z-20 pointer-events-none" 
        />
      </div>
    </div>
  );
};

const Features = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="w-full py-20 md:py-32 px-6 md:px-16 lg:px-24 bg-background relative z-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-20 text-center flex flex-col items-center">
          <span className="font-mono text-[10px] md:text-xs text-accent uppercase tracking-[0.2em] mb-4 block">Functional Artifacts</span>
          <h2 className="font-heading font-bold text-2xl md:text-5xl text-text overflow-hidden">
            <span className="block">Why FlowSync AI Solutions</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Card 1 */}
          <div className="feature-card glass-panel rounded-[2rem] p-6 md:p-8 flex flex-col h-full hover:border-white/10 transition-colors duration-500">
            <h3 className="font-heading font-semibold text-xl text-text mb-3">Systems, Not Campaigns</h3>
            <p className="font-sans text-sm text-text/60 leading-relaxed max-w-[90%] mb-10 md:mb-12">
              Bespoke infrastructure that runs daily without manual effort. No retainers needing babysitting.
            </p>
            <div className="mt-auto">
              <ShufflerCard />
            </div>
          </div>

          {/* Card 2 */}
          <div className="feature-card glass-panel rounded-[2rem] p-6 md:p-8 flex flex-col h-full hover:border-white/10 transition-colors duration-500">
            <h3 className="font-heading font-semibold text-xl text-text mb-3">Execution, Not Answers</h3>
            <p className="font-sans text-sm text-text/60 leading-relaxed max-w-[90%] mb-10 md:mb-12">
              Agents push data, book meetings, score leads, and resolve tickets. Action beats conversation.
            </p>
            <div className="mt-auto">
              <TypewriterCard />
            </div>
          </div>

          {/* Card 3 */}
          <div className="feature-card glass-panel rounded-[2rem] p-6 md:p-8 flex flex-col h-full hover:border-white/10 transition-colors duration-500">
            <h3 className="font-heading font-semibold text-xl text-text mb-3">Full-Stack Capability</h3>
            <p className="font-sans text-sm text-text/60 leading-relaxed max-w-[90%] mb-10 md:mb-12">
              One partner across sales, hiring, marketing, and support routing. No fragmented vendors.
            </p>
            <div className="mt-auto">
              <PipelineCard />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
