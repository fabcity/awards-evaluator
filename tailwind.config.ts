import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fab City brand 2026
        dark: '#1E1E1E',
        cream: '#F7F5F1',
        red: '#E62038',
        green: '#00A057',
        blue: '#20388D',
        muted: '#6B6B6B',
        'light-gray': '#E8E5DF',
        gold: '#B8860B',
      },
      fontFamily: {
        heading: [
          "'Circular Std'",
          "'Funnel Display'",
          "'Mulish'",
          "'Funnel Sans'",
          'system-ui',
          'sans-serif',
        ],
        sans: [
          "'Funnel Sans'",
          "'Inter'",
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        full: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
