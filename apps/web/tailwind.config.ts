import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0b1120',
        panel: '#111827',
        line: '#23314f',
        accent: '#38bdf8',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      boxShadow: {
        panel: '0 20px 60px rgba(0, 0, 0, 0.28)'
      }
    }
  },
  plugins: []
};

export default config;
