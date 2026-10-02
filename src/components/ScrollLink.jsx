import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToEl } from '../lib/motion';
import { useLang } from '../lib/lang';
import { localizedPath, pagePath } from '../lib/routes';

// Link to a home-page section (to="#results"): scrolls in place on the home page, navigates there from any other page.
export default function ScrollLink({ to, local = false, onClick, children, ...props }) {
  const { pathname } = useLocation();
  const { lang } = useLang();
  const navigate = useNavigate();
  const href = `${local || pagePath(pathname) === '/' ? pathname : localizedPath('/', lang)}${to}`;

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (local || pagePath(pathname) === '/') {
      scrollToEl(document.getElementById(to.slice(1)));
      navigate(href, { replace: true });
    } else {
      navigate(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
