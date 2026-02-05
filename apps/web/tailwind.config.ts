import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        raptor: {
          dark: "#0B101C",
          gray: "#242C38",
          yellow: "#FAD512",
          lightgray: "#4B5663",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
