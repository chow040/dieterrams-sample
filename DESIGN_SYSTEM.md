# Dieter Rams / "Braun" Design System

This project adheres to the **"Less but Better"** philosophy—stripping away decoration (shadows, gradients, blurs) to leave only pure function, grids, and typography. The interface mimics high-end hi-fi equipment: tactile, precise, and neutral.

## 1. The Philosophy

*   **Honesty:** The UI does not pretend to be material (no heavy shadows or bevels). It is digital paper on a digital chassis.
*   **Unobtrusive:** The interface recedes; the data (content) comes forward.
*   **Precision:** Alignment is rigorous. Every element aligns to a grid.

## 2. Color Palette (Monochrome + Signal)

The palette is intentionally limited to grayscale to reduce visual noise, with a single "Signal" color for action.

| Token | Hex | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Chassis** | `#F5F5F5` | `bg-neutral-100` | The background of the entire app. Mimics the plastic casing of a device. |
| **Surface** | `#FFFFFF` | `bg-white` | Cards and content areas. |
| **Border** | `#E5E5E5` | `border-neutral-200` | Hard, 1px separators. No soft shadows. |
| **Ink (Primary)** | `#171717` | `text-neutral-900` | Headlines, data values, primary buttons. |
| **Ink (Secondary)**| `#737373` | `text-neutral-500` | Helper text, metadata. |
| **Ink (Label)** | `#A3A3A3` | `text-neutral-400` | Uppercase labels (machine markings). |
| **Signal** | `#EA580C` | `text-orange-600` | "International Orange". Used sparingly for key indicators. |

## 3. Typography System

Typography is treated as the primary interface control.

*   **Font Family:** `Inter` (San-serif). Objective, legible, unadorned.
*   **The "Machine Label" Style:**
    *   *Usage:* Field labels, table headers, small metadata.
    *   *CSS:* `text-xs font-bold uppercase tracking-widest text-neutral-400`
    *   *Effect:* Looks like text silkscreened onto a metal faceplate.
*   **The "Readout" Style:**
    *   *Usage:* Prices, scores, large data.
    *   *CSS:* `text-3xl font-mono font-medium text-neutral-900 tracking-tight`
    *   *Effect:* Mimics a digital LCD readout.

## 4. Component Styles

### The Card (Module)
*   **Background:** Flat White.
*   **Border:** 1px solid (`border-neutral-200`).
*   **Shadow:** None (or extremely subtle `shadow-sm` only for lifting interactive elements).
*   **Radius:** `rounded-md` or `rounded-lg`. Never fully pill-shaped.

### The Button (Tactile)
*   **Primary:** Solid Black (`bg-neutral-900`), White Text. High contrast.
*   **Secondary:** White (`bg-white`), Border (`border-neutral-200`), Black Text.
*   **Hover:** Minimal change. Darken slightly or shift border color.

### The Input (Control)
*   **Background:** Pale Grey (`bg-neutral-50`) to differentiate from the white card.
*   **Border:** Solid (`border-neutral-200`).
*   **Focus:** Darker border (`border-neutral-400`). No glowing rings.

## 5. Implementation Guide

### Tailwind Configuration

```javascript
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5', // The Chassis
          200: '#e5e5e5', // The Border
          400: '#a3a3a3', // The Label
          500: '#737373', // Secondary Ink
          900: '#171717', // Primary Ink
        },
        accent: '#ea580c', // Signal Orange
      },
      letterSpacing: {
        widest: '.15em', // Crucial for labels
      }
    }
  }
}
```

### Global CSS (The "Mechanical" Feel)

Add this to `index.html` or global CSS to style the scrollbars and selection.

```css
body {
  background-color: #f5f5f5;
  color: #171717;
  -webkit-font-smoothing: antialiased;
}

/* Mechanical Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f5f5f5; 
  border-left: 1px solid #e5e5e5;
}
::-webkit-scrollbar-thumb {
  background: #d4d4d4; 
  border: 2px solid #f5f5f5; /* Creates a gap effect */
  border-radius: 0px; /* Square edges */
}
::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3; 
}
```
