import React, { useState } from 'react';

// Shared shell for legal/contact pages: heading, EN/IT toggle, styled prose.
const PageLayout = ({ label, title, lang, setLang, children }) => {
  return (
    <section className="w-full min-h-screen bg-background pt-36 md:pt-44 pb-24 px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-4 block">{label}</span>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-text leading-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 mt-2 shrink-0">
            {['en', 'it'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${
                  lang === l ? 'bg-accent text-[#0a0a0b] font-bold' : 'text-text/50 hover:text-text'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-10">{children}</div>
      </div>
    </section>
  );
};

export const PageSection = ({ heading, children }) => (
  <div>
    {heading && (
      <h2 className="font-heading font-bold text-xl md:text-2xl text-text mb-4">{heading}</h2>
    )}
    <div className="font-sans text-text/70 leading-relaxed space-y-4 text-base md:text-lg">{children}</div>
  </div>
);

export default PageLayout;
