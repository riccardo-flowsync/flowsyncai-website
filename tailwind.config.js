import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0a0a0b',
        surface: '#121214',
        raised: '#17161b',
        line: '#232227',
        fg: '#f4f3ed',
        muted: '#b3b1aa',
        faint: '#82817c', // 4.6:1 on raised, lowest contrast allowed for text
        accent: '#9d7cff', // a signal, not decoration: primary action, live state, key figures
      },
      fontFamily: {
        sans: ['"Mona Sans Variable"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond Variable"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        page: '1200px',
      },
    },
  },
  plugins: [
    // coarse: touch screens, where tap targets grow to 44px. A plugin and not a `screens` entry: any object in
    // `screens` switches off the min-* variants (min-[360px] in the navbar would silently disappear)
    plugin(({ addVariant }) => addVariant('coarse', '@media (pointer: coarse)')),
  ],
}
