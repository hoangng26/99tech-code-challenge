/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        '3xl':
          '0px 18px 36px -18px rgba(0,0,0,.1),0px 30px 45px -30px rgba(50,50,93,.1)',
      },
    },
  },
  plugins: [],
};
