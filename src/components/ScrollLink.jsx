import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToEl } from '../lib/motion';

// Link to a home-page section (to="#results"): scrolls in place on the home page, navigates there from any other page.
export default function ScrollLink({ to, onClick, children, ...props }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (pathname === '/') {
      scrollToEl(document.getElementById(to.slice(1)));
      history.replaceState(null, '', to);
    } else {
      navigate('/' + to);
    }
  };

  return (
    <a href={'/' + to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
