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
        bg: {
          canvas:   "var(--bg-canvas)",
          surface:  "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
        },
        text: {
          primary:    "var(--text-primary)",
          secondary:  "var(--text-secondary)",
          tertiary:   "var(--text-tertiary)",
          quaternary: "var(--text-quaternary)",
          muted:      "var(--text-muted)",
        },
        accent: {
          primary:   "var(--accent-primary)",
          secondary: "var(--accent-secondary)",
        },
        severity: {
          positive: "var(--severity-positive)",
          caution:  "var(--severity-caution)",
          concern:  "var(--severity-concern)",
        },
        border: {
          default: "var(--border-default)",
          subtle:  "var(--border-subtle)",
        },
      },
      fontFamily: {
        // "Source Serif 4" is the variable-font successor to Source Serif Pro;
        // loaded via Google Fonts so weight 500 is available.
        serif: ['"Source Serif 4"', "Georgia", "serif"],
        sans:  ["Inter", "system-ui", "sans-serif"],
        mono:  ['"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        // Named type scale from DESIGN.md
        "h1":             ["38px", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "h2":             ["22px", { lineHeight: "1.3"  }],
        "h3":             ["24px", { lineHeight: "1.3"  }],
        "body-editorial": ["15px", { lineHeight: "1.65" }],
        "body-data":      ["13px", { lineHeight: "1.5"  }],
        "field-value":    ["16px", { lineHeight: "1.4"  }],
        "section-label":  ["11px", { lineHeight: "1",   letterSpacing: "0.18em" }],
        "field-label":    ["10px", { lineHeight: "1",   letterSpacing: "0.06em" }],
        "metadata":       ["11px", { lineHeight: "1",   letterSpacing: "0.18em" }],
        "mono":           ["12px", { lineHeight: "1.5", letterSpacing: "0.04em" }],
      },
      letterSpacing: {
        // Named spacing values used in DESIGN.md type scale
        "tighter-h1":          "-0.01em",
        "wider-button":        "0.02em",
        "wider-mono":          "0.04em",
        "wider-field-label":   "0.06em",
        "wider-metadata":      "0.14em",
        "widest-section-label": "0.18em",
      },
      borderRadius: {
        card:   "0px",   // editorial rectangles — no rounded corners on content blocks
        button: "2px",   // slight, almost square — never pill-shaped
      },
    },
  },
  plugins: [],
};

export default config;
