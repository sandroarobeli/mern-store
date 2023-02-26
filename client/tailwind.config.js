module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // CHANGES DEFAULTS... (CHANGES WHAT ALREADY EXISTS IN TAILWIND)
    extend: {
      // EXTENDS DEFAULTS... (ADDS WHAT TAILWIND DIDN'T HAVE BEFORE)
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
