/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'retro-primary': 'var(--retro-primary)',
        'retro-secondary': 'var(--retro-secondary)',
        'retro-accent': 'var(--retro-accent)',
        'retro-dark': 'var(--retro-dark)',
        'retro-light': 'var(--retro-light)',
        'retro-info': 'var(--retro-info)',
        'retro-success': 'var(--retro-success)',
        'retro-warning': 'var(--retro-warning)',
        'retro-danger': 'var(--retro-danger)',
      },
      boxShadow: {
        'retro-sm': '2px 2px 0px rgba(0, 0, 0, 0.2)',
        'retro-md': '4px 4px 0px rgba(0, 0, 0, 0.2)',
        'retro-lg': '6px 6px 0px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-in-out',
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
    },
  },
  plugins: [],
}
