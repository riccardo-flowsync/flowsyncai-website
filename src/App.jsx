import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Services from './components/Services';
import Philosophy from './components/Philosophy';
import Protocol from './components/Protocol';
import CTA from './components/CTA';
import Waitlist from './components/Waitlist';
import Footer from './components/Footer';

function App() {
  return (
    <main className="w-full min-h-screen bg-transparent text-text selection:bg-accent/30 selection:text-text">
      <Navbar />
      <Hero />
      <Features />
      <Services />
      <Philosophy />
      <Protocol />
      <CTA />
      <Waitlist />
      <Footer />
    </main>
  );
}

export default App;
