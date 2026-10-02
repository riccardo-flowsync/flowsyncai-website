import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../lib/lang';
import { localizedPath, pagePath } from '../lib/routes';

export default function SiteLink({ to, children, ...props }) {
  const { lang } = useLang();
  const { pathname } = useLocation();
  return <Link to={localizedPath(to, lang)} aria-current={pagePath(pathname) === to ? 'page' : undefined} {...props}>{children}</Link>;
}
