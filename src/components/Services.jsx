import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    title: "AI Email + LinkedIn Outreach",
    description: "Your pipeline runs on autopilot. AI sources, qualifies, and contacts your ideal prospects with personalized messages across Email and LinkedIn. An AI agent handles replies, qualifies interest, and books appointments directly into your calendar."
  },
  {
    title: "AI Customer Support Agents",
    description: "Your support runs 24/7 without extra headcount. Chat and voice agents handle tickets, pull live data, and execute real actions inside your systems. Human escalation happens only when it genuinely needs to."
  },
  {
    title: "AI Hiring Automation",
    description: "Hiring without the inbox chaos. We score CVs against your criteria, rank candidates, and book interviews automatically. We also scrape LinkedIn to actively find and contact prospects. You see the shortlist. You pick who moves forward."
  },
  {
    title: "AI Marketing Content Engine",
    description: "Consistent content without the production grind. We run your Instagram and TikTok with AI-driven planning, competitor analysis, video making, and full production. Cinema studio output for cents on the dollar."
  }
];

const Services = () => {
  const containerRef = useRef(null);
  const rightColumnRef = useRef(null);
  const panelsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Pin the left column while the right column scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: ".left-column",
        pinSpacing: false,
      });

      // Animate each panel on scroll
      panelsRef.current.forEach((panel) => {
        gsap.fromTo(panel, 
          {
            x: 50,
            opacity: 0,
          },
          {
            scrollTrigger: {
              trigger: panel,
              start: "top 80%", // trigger when top of panel hits 80% of viewport
              toggleActions: "play none none reverse", // play on enter, reverse on leave back
            },
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="services" className="relative w-full bg-transparent py-24 px-6 md:px-16" style={{ minHeight: '200vh' }}>
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row relative h-full">
        {/* Left Column - Pinned */}
        <div className="left-column flex-none w-full lg:w-1/3 h-auto lg:h-screen flex flex-col justify-center sticky top-0 py-12 lg:py-24 z-10">
          <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-7xl text-text leading-tight w-full">
            Our<br/><span className="text-gradient-accent">Services</span>
          </h2>
          <div className="mt-8 w-16 h-1 bg-accent/40 rounded-full"></div>
        </div>

        {/* Right Column - Scrolling Panels */}
        <div ref={rightColumnRef} className="flex-1 lg:w-2/3 flex flex-col gap-12 lg:gap-24 py-12 lg:py-[30vh] lg:pl-16 relative z-20">
          {servicesData.map((service, index) => (
            <div 
              key={index}
              ref={el => panelsRef.current[index] = el}
              className="glass-panel p-8 md:p-12 rounded-[2rem] flex flex-col gap-6"
            >
              <div className="text-accent font-mono text-sm tracking-widest uppercase">
                Service 0{index + 1}
              </div>
              <h3 className="font-heading font-bold text-2xl md:text-4xl text-text">
                {service.title}
              </h3>
              <p className="font-sans text-text/70 text-lg md:text-xl leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
