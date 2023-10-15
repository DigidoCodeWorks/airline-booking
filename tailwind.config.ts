import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#282828',
          100: '#DBDBDB',
          500: '#ABABAB',
          700: '#8B8B8B',
        },
        primary: {
          500: '#2280EF',
        },
      },
      fontFamily: {
        body: ['var(--font-nunito-sans)'],
        display: ['var(--font-nunito)'],
      },
    },
  },
  plugins: [],
};
export default config;
