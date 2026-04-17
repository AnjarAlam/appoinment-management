import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        display: ["Manrope", "sans-serif"], /* For headlines */
        ui: ["Inter", "sans-serif"], /* For interface/data */
      },
      colors: {
        /* Ethereal Clinical Aesthetic - Dark Mode */
        surface: "#121414",
        "surface-low": "#1a1c1c",
        "surface-container-low": "#1a1c1c",
        "surface-container": "#1e2020",
        "surface-container-highest": "#333535",
        "surface-container-lowest": "#0a0c0c",
        
        /* Primary Palette - Forest Green */
        "primary": "#95d4b3",
        "primary-container": "#003f29",
        "primary-dim": "#003f29",
        
        /* On-Surface - Text & UI */
        "on-surface": "#e2e2e2",
        "on-surface-variant": "#c1c8c4",
        "surface-variant": "rgba(65,72,70,0.15)",
        "outline-variant": "rgba(65,72,70,0.15)",
        
        /* Semantic */
        "success": "#95d4b3",
        "warning": "#f5b800",
        "error": "#dc2626",
        "info": "#3b82f6",
        
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        error: "hsl(var(--error))",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "ambient": "0 24px 48px -12px rgba(18, 20, 20, 0.5)", /* Ethereal shadow */
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      scale: {
        98: "0.98",
        102: "1.02",
      },
      animation: {
        "in": "slideIn 0.3s ease-out",
        "fade": "fadeIn 0.3s ease-out",
      },
    },
  },
  darkMode: ["class"],
  plugins: [],
} satisfies Config;