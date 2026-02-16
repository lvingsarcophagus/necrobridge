import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8244ee",
        "background-light": "#f7f6f8",
        "background-dark": "#0b0714",
        "terminal-green": "#2dd4bf",
        "slate-custom": {
          800: "#1e1b2e",
          900: "#13111c",
          950: "#0b0714",
        },
        necro: {
          50: "#f7f3ff",
          100: "#ede5ff",
          200: "#d0bcff",
          300: "#b399ff",
          400: "#9d7bff",
          500: "#8558ff",
          600: "#7033ff",
          700: "#5a1ee0",
          800: "#451db4",
          900: "#301d7a",
        },
        grave: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716b",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      boxShadow: {
        "neon-glow-primary": "0 0 20px rgba(130, 68, 238, 0.3)",
        "neon-glow-teal": "0 0 20px rgba(45, 212, 191, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
