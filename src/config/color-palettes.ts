/**
 * Color palettes for category cards and UI elements
 * Carefully selected for optimal contrast in both light and dark modes
 */

export interface ColorPalette {
  light: string; // Light mode background
  dark: string; // Dark mode background
  name?: string; // Optional name for reference
}

// 12 simple color pairs
export const CATEGORY_PALETTES: ColorPalette[] = [
  { light: "#FEF3E2", dark: "#4A2C1A" }, // Warm peach
  { light: "#E8EEFF", dark: "#1A2B4A" }, // Soft indigo
  { light: "#E2F3F0", dark: "#1A4038" }, // Mint teal
  { light: "#FFF4D6", dark: "#4A3E1A" }, // Soft yellow
  { light: "#FCE8F0", dark: "#4A1A2F" }, // Blush pink
  { light: "#E8F5E8", dark: "#1A401A" }, // Fresh green
  { light: "#F0E8FF", dark: "#2A1A4A" }, // Soft violet
  { light: "#FFF0E0", dark: "#4A2A1A" }, // Warm amber
  { light: "#E3F0FA", dark: "#1A3340" }, // Sky blue
  { light: "#FFE8E8", dark: "#4A1A1A" }, // Soft red
  { light: "#F5EDE0", dark: "#3A2E1A" }, // Warm sand
  { light: "#E0F5E8", dark: "#1A402A" }, // Emerald
];

// More vibrant palette for promotional sections
export const PROMO_PALETTES: ColorPalette[] = [
  { light: "#FFE5D9", dark: "#8B3A2C", name: "coral" },
  { light: "#E5DEFF", dark: "#3834A2", name: "purple" },
  { light: "#D9FFE5", dark: "#1B6B4E", name: "forest" },
  { light: "#FFE5F1", dark: "#8B3B6C", name: "rose" },
  { light: "#DEFFF2", dark: "#1B6B6C", name: "mint" },
  { light: "#FFF2DE", dark: "#8B6B2C", name: "golden" },
  { light: "#FFDEE5", dark: "#8B3B4C", name: "berry" },
  { light: "#E5F0FF", dark: "#2C3BA2", name: "ocean" },
  { light: "#F0FFDE", dark: "#3B6B1B", name: "lime" },
  { light: "#FFE5DE", dark: "#8B4B2C", name: "apricot" },
  { light: "#F5DEFF", dark: "#4C3BA2", name: "lavender" },
  { light: "#DEFFDE", dark: "#1B6B3B", name: "sage" },
];

// Helper function to get palette by index (with cycling)
// Helper function to get palette by index
export function getPaletteByIndex(index: number): ColorPalette {
  return CATEGORY_PALETTES[index % CATEGORY_PALETTES.length];
}

// Generate CSS for the palette system
export function generatePaletteCSS(): string {
  return CATEGORY_PALETTES.map(
    (p, i) => `
    [data-cat-palette="${i}"] { background-color: ${p.light}; }
    .dark [data-cat-palette="${i}"] { background-color: ${p.dark}; }
  `,
  ).join("");
}
