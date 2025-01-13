import { join } from "path";
import { skeleton } from "@skeletonlabs/tw-plugin";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}"),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        heading: ["DM Serif Display", "serif"],
      },
      colors: {
        // --- Vivid Color Scheme ---
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          50: "#fce7f3",
          100: "#fbcfe8",
          200: "#f9a8d4",
          300: "#f472b6",
          400: "#ec4899",
          500: "#db2777",
          600: "#be185d",
          700: "#9d174d",
          800: "#831843",
          900: "#641e38",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [
    skeleton({
      themes: {
        preset: [
          {
            name: "modern",
            enhancements: true,
            properties: {
              // Custom theme colors
              "--theme-font-family-base": "theme(fontFamily.sans)",
              "--theme-font-family-heading": "theme(fontFamily.heading)",
              "--color-primary-50": "theme(colors.primary.50)",
              "--color-primary-100": "theme(colors.primary.100)",
              "--color-primary-200": "theme(colors.primary.200)",
              "--color-primary-300": "theme(colors.primary.300)",
              "--color-primary-400": "theme(colors.primary.400)",
              "--color-primary-500": "theme(colors.primary.500)",
              "--color-primary-600": "theme(colors.primary.600)",
              "--color-primary-700": "theme(colors.primary.700)",
              "--color-primary-800": "theme(colors.primary.800)",
              "--color-primary-900": "theme(colors.primary.900)",
              "--color-secondary-50": "theme(colors.secondary.50)",
              "--color-secondary-100": "theme(colors.secondary.100)",
              "--color-secondary-200": "theme(colors.secondary.200)",
              "--color-secondary-300": "theme(colors.secondary.300)",
              "--color-secondary-400": "theme(colors.secondary.400)",
              "--color-secondary-500": "theme(colors.secondary.500)",
              "--color-secondary-600": "theme(colors.secondary.600)",
              "--color-secondary-700": "theme(colors.secondary.700)",
              "--color-secondary-800": "theme(colors.secondary.800)",
              "--color-secondary-900": "theme(colors.secondary.900)",
              // Light mode
              "--color-surface-50": "theme(colors.surface.50)",
              "--color-surface-100": "theme(colors.surface.100)",
              "--color-surface-200": "theme(colors.surface.200)",
              "--color-surface-300": "theme(colors.surface.300)",
              "--color-surface-400": "theme(colors.surface.400)",
              "--color-surface-500": "theme(colors.surface.500)",
              "--color-surface-600": "theme(colors.surface.600)",
              "--color-surface-700": "theme(colors.surface.700)",
              "--color-surface-800": "theme(colors.surface.800)",
              "--color-surface-900": "theme(colors.surface.900)",
            },
          },
        ],
      },
    }),
  ],
};
