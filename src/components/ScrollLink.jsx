import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Anchor link that scrolls in-page on the homepage and navigates to /#hash
// from any other route.
const ScrollLink = ({ hash, children, onClick, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    if (location.pathname === '/') {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/' + hash);
    }
  };

  return (
    <a href={'/' + hash} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default ScrollLink;
