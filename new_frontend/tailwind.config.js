/** @type {import('tailwindcss').Config} */
import tailwindcssAnimated from 'tailwindcss-animated';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        danmaku: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-2500%)' },
        },
      },
      animation: {
        danmaku: 'danmaku 45s linear forwards',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    tailwindcssAnimated,
  ],
};
