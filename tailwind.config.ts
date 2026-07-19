import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        omnia: {
          primary: {
            blue: "#2563EB",
            purple: "#7C3AED",
            emerald: "#10B981",
            teal: "#0D9488",
            indigo: "#4F46E5",
            sky: "#0284C7",
            rose: "#E11D48"
          },
          secondary: {
            orange: "#F97316",
            cyan: "#06B6D4",
            pink: "#EC4899",
            amber: "#F59E0B",
            lime: "#84CC16",
            violet: "#8B5CF6",
            red: "#EF4444"
          },
          ink: "#0F172A",
          muted: "#475569",
          line: "#E2E8F0",
          cloud: "#F8FAFC"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
