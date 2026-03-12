import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-6 px-4">
      <div 
        className={`flex items-center justify-between px-6 py-3 transition-all duration-500 ease-out rounded-[2rem] w-full max-w-5xl ${
          isScrolled 
            ? 'bg-[#0a0a0b]/70 backdrop-blur-[12px] border border-transparent border-b-accent/20 shadow-lg text-text' 
            : 'bg-transparent text-text border border-transparent'
        }`}
      >
        <div className="font-heading font-bold text-xl tracking-tight text-white whitespace-nowrap">FlowSync AI Solutions</div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-sans font-medium">
          <a href="#features" className={`transition-colors hover:text-accent ${isScrolled ? 'text-text/80' : 'text-text/90'}`}>Systems</a>
          <a href="#philosophy" className={`transition-colors hover:text-accent ${isScrolled ? 'text-text/80' : 'text-text/90'}`}>Philosophy</a>
          <a href="#protocol" className={`transition-colors hover:text-accent ${isScrolled ? 'text-text/80' : 'text-text/90'}`}>Protocol</a>
        </div>
        
        <a href="#waitlist" className="bg-accent text-[#0a0a0b] font-sans font-semibold text-sm px-6 py-2.5 rounded-full btn-magnetic">
          Waitlist
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
