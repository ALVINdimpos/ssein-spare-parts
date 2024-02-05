/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DB2512",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        floor: "var(--floor)",
        light: "var(--light)",
        dark: "var(--dark)",
      },
    },
  },
  plugins: [],
};
