/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins"],
      },
      boxShadow: {
        innerOne: "-1px -1px 7px 2px rgba(0, 0, 0, 0.089) inset",
      },
    },
  },
  plugins: [],
};
