import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        celeste: "#0176DE",
        azul: "#173F8A",
        azul_oscuro: "#03122E",
        amarillo: "#FEC60D",
        amarillo_oscuro: "#E3AE00",
      },
    },
  },
  plugins: [],
};
export default config;
