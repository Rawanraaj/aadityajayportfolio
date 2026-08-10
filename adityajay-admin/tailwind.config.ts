import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070B14",
          900: "#0B1120",
          800: "#121A2E",
          700: "#1A2440",
          600: "#273356",
        },
        press: {
          DEFAULT: "#C81E3A",
          600: "#A81830",
          700: "#8B1428",
        },
        paper: {
          50: "#F5F1EA",
          100: "#EFEAE0",
          200: "#E2DCCF",
          300: "#CFC7B6",
          400: "#A39B89",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        "eyebrow-1": "0.22em",
        "eyebrow-2": "0.18em",
        tightest: "-0.04em",
      },
      maxWidth: {
        editorial: "1320px",
      },
      keyframes: {
        tickerScroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        grainShift: {
          "0%,100%": { transform: "translate(0,0)" },
          "20%": { transform: "translate(-4%,3%)" },
          "40%": { transform: "translate(3%,-5%)" },
          "60%": { transform: "translate(-2%,4%)" },
          "80%": { transform: "translate(4%,-3%)" },
        },
      },
      animation: {
        tickerScroll: "tickerScroll 40s linear infinite",
        grainShift: "grainShift 8s steps(4) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
