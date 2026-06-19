import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Caribbean palette: sea, sky, sunset, sand, palm
        sea: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        sunset: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        mango: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        palm: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        sand: "#fef3c7",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "island-gradient":
          "linear-gradient(135deg, #06b6d4 0%, #10b981 45%, #f59e0b 100%)",
        "sunset-gradient":
          "linear-gradient(135deg, #f97316 0%, #f59e0b 60%, #06b6d4 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
