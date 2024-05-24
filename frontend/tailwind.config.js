/** @type {import('tailwindcss').Config} */
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
      },
  },
  plugins: [],
}