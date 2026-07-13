/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#15110D",
        bgAlt: "#1B1610",
        surface: "#221B14",
        surfaceLight: "#2B2218",
        border: "#3A2F22",
        borderLight: "#473A29",
        gold: "#E8A33D",
        goldDark: "#C2811F",
        terracotta: "#C1432D",
        terracottaDark: "#9C3220",
        green: "#5C7956",
        cream: "#F5EFE6",
        muted: "#B5A893",
        mutedDark: "#85785F",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
