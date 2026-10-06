/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#4a151b",
          primary: "#5C1C1D",
          hover: "#732325",
          gold: "#e6c875",
          light: "#fdfbfb",
        },
      },
    },
  },
  plugins: [],
};
