/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode toggle
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        primary: 'var(--text-primary)',
        muted: 'var(--text-muted)',
        border: 'var(--border)',
        accent: '#10b981', // emerald-500
        'accent-hover': '#059669', // emerald-600
        success: '#10b981', // emerald-500
        warning: '#f59e0b', // amber-500
        danger: '#ef4444', // red-500
        // Legacy fallbacks so nothing breaks immediately
        navy: 'var(--bg)',
        'electric-blue': '#10b981',
        card: 'var(--surface)',
        'dark-bg': 'var(--bg)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};