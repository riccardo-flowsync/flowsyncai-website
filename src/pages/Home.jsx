import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Services from '../components/Services';
import Philosophy from '../components/Philosophy';
import Protocol from '../components/Protocol';
import CTA from '../components/CTA';
import Waitlist from '../components/Waitlist';

const Home = () => {
  const location = useLocation();

  // Support landing on /#section from other pages
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        // wait a tick so GSAP layouts settle
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location.hash]);

  return (
    <>
      <Hero />
      <Features />
      <Services />
      <Philosophy />
      <Protocol />
      <CTA />
      <Waitlist />
    </>
  );
};

export default Home;
