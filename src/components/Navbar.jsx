import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Systems', href: '#features' },
    { name: 'Philosophy', href: '#philosophy' },
    { name: 'Protocol', href: '#protocol' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center mt-4 md:mt-6 px-4">
      <div 
        className={`flex items-center justify-between px-5 md:px-6 py-3 transition-all duration-500 ease-out rounded-[1.5rem] md:rounded-[2rem] w-full max-w-5xl ${
          isScrolled || isOpen
            ? 'bg-[#0a0a0b]/80 backdrop-blur-[12px] border border-white/5 shadow-lg text-text' 
            : 'bg-transparent text-text border border-transparent'
        }`}
      >
        <div className="font-heading font-bold text-lg md:text-xl tracking-tight text-white whitespace-nowrap z-[110]">
          FlowSync <span className="hidden sm:inline">AI Solutions</span>
          <span className="sm:hidden text-accent">AI</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-sans font-medium">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className={`transition-colors hover:text-accent ${isScrolled ? 'text-text/80' : 'text-text/90'}`}
            >
              {link.name}
            </a>
          ))}
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 z-[110]">
          <a href="#waitlist" className="bg-accent text-[#0a0a0b] font-sans font-bold text-xs md:text-sm px-4 md:px-6 py-2 md:py-2.5 rounded-full btn-magnetic shadow-[0_0_15px_rgba(157,124,255,0.3)]">
            Waitlist
          </a>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-text/80 hover:text-accent transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#0a0a0b] transition-all duration-500 md:hidden z-[105] ${
          isOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-6">
          {navLinks.map((link, i) => (
            <a 
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-4xl font-heading font-bold text-text hover:text-accent transition-all duration-500 ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {link.name}
            </a>
          ))}
          
          <div className={`pt-12 transition-all duration-700 delay-300 ${isOpen ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             <div className="flex items-center space-x-3">
               <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
               <span className="font-mono text-[10px] uppercase tracking-[0.2em]">System Operational</span>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
