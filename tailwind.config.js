/** @type {import('tailwindcss').Config} */

const { color } = require('framer-motion');

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    textShadow: {
      sm: "0px 4px 8.6px #00000040",
      md: "0px 4px 8.6px #00000070"
    },

    extend: {
      screens: {
        "3xl": "1920px",
        "screen-1366": "1366px",
        "screen-1360": "1360px"
      },
      boxShadow: {
        sky: "0 0 8px 4px rgba(56, 189, 248, 0.7)",
        red: "0 0 8px 4px rgba(239, 68, 68, 0.7)",
        "alert-normal":
          "inset 0px 0px 7.3px 0px #0B8515, 0px 0px 13.4px 2px #0B8515",
        "alert-critical":
          "inset 0px 0px 7.3px 0px #FF1A1A, 0px 0px 13.4px 2px #A60000",
        "alert-important":
          "inset 0px 0px 7.3px 0px #D7AC00, 0px 0px 13.4px 2px #D7AC00",
        "black-overview-card": "0px 0px 6.3px 0.5px #E8E8E880"
      },
      textShadow: {
        "custom-black": "0 4px 4px #000000", // Using hex code
        "custom-black-rgba": "0 4px 4px rgba(0, 0, 0, 1)", // Using rgba,
        critical: "0 0 8px rgba(255, 0, 0, 0.8)",
        important: "0 0 8px rgba(255, 255, 0, 0.8)",
        normal: "0 0 8px rgba(0, 255, 0, 0.8)"
      },
      fontSize: {
        xxs: "0.5rem"
      },
      fontFamily: {
        din: "var(--font-d-din)",
        russo: "var(--font-russo-one)", // if you export it as a CSS variable
        alexandria: "var(--font-alexandria)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      backgroundImage: {
        "gradient-navbar-bg": "var(--gradient-navbar-bg)",
        "gradient-1": "var(--gradient-1)",
        "gradient-2": "var(--gradient-2)",
        "gradient-3": "var(--gradient-3)",
        // "linear-black-overview-card": "linear-gradient(270deg, #3D3D3D 23.56%, #FFFFFF 50%, #4B4B4B 89.42%)",
        "linear-black-overview-card":
          "linear-gradient(180deg, #CECECE 0%, #555555 48.08%, #CECECE 100%)"
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))"
        }
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-textshadow"),
    require("@tailwindcss/typography")
  ]
};
