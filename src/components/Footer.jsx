import React from 'react';
import { Link } from 'react-router-dom';
import ScrollLink from './ScrollLink';

const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] rounded-t-[3rem] md:rounded-t-[4rem] text-text pt-20 pb-10 px-6 md:px-16 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
        
        <div className="md:col-span-6 flex flex-col items-start h-full">
          <div className="flex items-center gap-2 md:gap-2.5 mb-8 -ml-3 md:-ml-4">
            <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 min-w-[3rem] md:min-w-[4rem]">
              <div 
                className="w-full h-full bg-accent"
                style={{
                  WebkitMaskImage: 'url(/logo.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: 'url(/logo.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
                aria-label="FlowSync"
              />
            </div>
            <h3 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-white mb-0 leading-none">FlowSync AI Solutions</h3>
          </div>
          <p className="font-sans text-text/50 max-w-sm mb-12 flex-grow">
            The definitive AI operations partner for B2B companies that want to scale without adding headcount.
          </p>
          
          <div className="flex items-center px-4 py-2.5 bg-[#0a0a0b]/80 rounded-full border border-white/10 mt-auto shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-[pulse_2s_infinite] mr-3 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
            <span className="font-mono text-xs text-text/80 uppercase tracking-widest mt-0.5">System Operational</span>
          </div>
        </div>
        
        <div className="md:col-span-3 flex flex-col">
          <h4 className="font-mono text-xs text-text/40 uppercase tracking-widest mb-6">Navigation</h4>
          <ul className="space-y-4 font-sans text-sm text-text/70">
            <li><ScrollLink hash="#features" className="hover:text-accent transition-colors">Systems</ScrollLink></li>
            <li><ScrollLink hash="#philosophy" className="hover:text-accent transition-colors">Philosophy</ScrollLink></li>
            <li><ScrollLink hash="#protocol" className="hover:text-accent transition-colors">Protocol</ScrollLink></li>
            <li><ScrollLink hash="#waitlist" className="hover:text-accent transition-colors">Waitlist</ScrollLink></li>
          </ul>
        </div>
        
        <div className="md:col-span-3 flex flex-col">
          <h4 className="font-mono text-xs text-text/40 uppercase tracking-widest mb-6">Legal</h4>
          <ul className="space-y-4 font-sans text-sm text-text/70">
            <li><Link to="/privacy" className="hover:text-text transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-text transition-colors">Terms of Service</Link></li>
            <li><Link to="/contact" className="hover:text-text transition-colors">Contact</Link></li>
            <li><a href="mailto:riccardo@flowsyncaisolutions.com" className="hover:text-accent transition-colors">riccardo@flowsyncaisolutions.com</a></li>
          </ul>
        </div>
        
      </div>
      
      <div className="max-w-6xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-text/40 font-mono">
        <p>&copy; {new Date().getFullYear()} FlowSync AI Solutions. All rights reserved.</p>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <div 
            className="w-4 h-4 bg-accent opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            style={{
              WebkitMaskImage: 'url(/logo.png)',
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskImage: 'url(/logo.png)',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
            }}
            aria-label="FlowSync Logo"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
