/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        title: "var(--color-title)",
        text: "var(--color-text)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        icons: "var(--color-icons)",
        borderColor: "var(--color-border)",
      },
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Source Serif 4"', "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 12px 40px rgba(28, 20, 16, 0.06)",
      },
      screens: {
        sm: "540px",
        md: "720px",
        lg: "960px",
        xl: "1250px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};
