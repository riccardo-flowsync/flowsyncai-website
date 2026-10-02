import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Site } from './App';
import { loaders } from './lib/pages';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { pagePath } from './lib/routes';

// Resolve the route before rendering: the static output has no loading boundary or client-only insertion script.
export async function render(path) {
  const route = pagePath(path);
  const Page = route === '/' ? Home : loaders[route] ? (await loaders[route]()).default : NotFound;
  const service = route === '/sales-outreach' ? 'outbound' : 'support';
  return renderToStaticMarkup(<StaticRouter location={path}><Site page={<Page service={service} />} /></StaticRouter>);
}
