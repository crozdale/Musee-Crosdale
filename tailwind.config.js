/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        facinations: {
          blue: "#1F4DFF"
        }
      }
    }
  },
  plugins: []
};
