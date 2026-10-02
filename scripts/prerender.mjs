import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { ORIGIN, PAGES, localizedPath } from '../src/lib/routes.js';

const temporary = await mkdtemp(resolve('.prerender-'));
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
try {
  await build({
    logLevel: 'warn',
    ssr: { noExternal: ['gsap', '@gsap/react', 'lenis'] },
    build: { ssr: 'src/entry-server.jsx', outDir: temporary, emptyOutDir: true, rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } } },
  });
  const { render } = await import(pathToFileURL(`${temporary}/entry-server.mjs`));
  const template = await readFile('dist/index.html', 'utf8');
  const htmlFor = async (path, lang, known = true) => {
    const [name, description] = PAGES[path]?.[lang] || ['Page not found', 'This page does not exist.'];
    const title = escape(`${name} | FlowSync AI Solutions`);
    const url = `${ORIGIN}${localizedPath(path, lang)}`;
    let html = template.replace('<html lang="en">', `<html lang="${lang}">`)
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta name="description" content=")[^"]*("\s*\/>)/, `$1${escape(description)}$2`)
      .replace(/(<link rel="canonical" href=")[^"]*("\s*\/>)/, `$1${url}$2`);
    for (const [key, value] of Object.entries({ title, description: escape(description), url })) html = html.replace(new RegExp(`(<meta property="og:${key}" content=")[^"]*("\\s*\\/>)`), `$1${value}$2`);
    const alternates = known ? ['en', 'it'].map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${localizedPath(path, l)}" />`).join('\n    ') : '';
    html = html.replace('</head>', `<meta name="robots" content="${known ? 'index,follow' : 'noindex,follow'}" />\n    ${alternates}\n    <meta property="og:locale" content="${lang === 'it' ? 'it_IT' : 'en_GB'}" />\n    <meta name="twitter:title" content="${title}" />\n    <meta name="twitter:description" content="${escape(description)}" />\n  </head>`);
    return html.replace('<div id="root"></div>', `<div id="root">${await render(known ? localizedPath(path, lang) : path)}</div>`);
  };
  const entries = [];
  for (const path of Object.keys(PAGES)) {
    for (const lang of ['en', 'it']) {
      const url = localizedPath(path, lang);
      await mkdir(`dist${url}`, { recursive: true });
      await writeFile(`dist${url}/index.html`, await htmlFor(path, lang));
      entries.push(`<url><loc>${ORIGIN}${url}</loc>${['en', 'it'].map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN}${localizedPath(path, l)}" />`).join('')}</url>`);
    }
    // Old unprefixed links stay valid and use the visitor's saved/browser language after startup.
    const directory = `dist${path === '/' ? '' : path}`;
    await mkdir(directory, { recursive: true });
    await writeFile(`${directory}/index.html`, await htmlFor(path, 'en'));
  }
  await writeFile('dist/404.html', await htmlFor('/not-found', 'en', false));
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('\n')}</urlset>\n`);
  console.log(`Rendered ${entries.length} language pages, legacy pages and the sitemap.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
