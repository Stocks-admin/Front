import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      boxShadow: {
        innerxl: "inset 0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      },
      gridTemplateColumns: {
        sidebar: "300px auto", //for sidebar layout
        "sidebar-collapsed": "64px auto", //for collapsed sidebar layout
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        circular: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        bull_green: "#00c28f",
        bear_red: "#eb0a3a",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
export default config;
