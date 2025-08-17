/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", ".app-dark"],
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1920px",
    },
    extend: {},
  },
  plugins: [],
};
