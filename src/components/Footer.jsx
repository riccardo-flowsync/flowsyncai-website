import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] rounded-t-[3rem] md:rounded-t-[4rem] text-text pt-20 pb-10 px-6 md:px-16 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
        
        <div className="md:col-span-6 flex flex-col items-start h-full">
          <h3 className="font-heading font-bold text-3xl tracking-tight text-white mb-4">FlowSync AI Solutions</h3>
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
            <li><a href="#features" className="hover:text-accent transition-colors">Systems</a></li>
            <li><a href="#philosophy" className="hover:text-accent transition-colors">Philosophy</a></li>
            <li><a href="#protocol" className="hover:text-accent transition-colors">Protocol</a></li>
            <li><a href="#waitlist" className="hover:text-accent transition-colors">Waitlist</a></li>
          </ul>
        </div>
        
        <div className="md:col-span-3 flex flex-col">
          <h4 className="font-mono text-xs text-text/40 uppercase tracking-widest mb-6">Legal</h4>
          <ul className="space-y-4 font-sans text-sm text-text/70">
            <li><a href="#" className="hover:text-text transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-text transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-text transition-colors">Contact</a></li>
          </ul>
        </div>
        
      </div>
      
      <div className="max-w-6xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-text/40 font-mono">
        <p>&copy; {new Date().getFullYear()} FlowSync AI Solutions. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">TW</a>
          <a href="#" className="hover:text-white transition-colors">LI</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
