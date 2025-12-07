// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "ui-sans-serif", "system-ui"],
        display: ["Playfair Display", "ui-serif", "Georgia"],
      },
    },
  },
  plugins: [],
};
