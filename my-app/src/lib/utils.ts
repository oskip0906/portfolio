import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Hex color utilities ───────────────────────────────────────────────────────

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

/** Returns just the hue (0–360) from a hex color. */
export function hexHue(hex: string): number {
  return hexToHsl(hex).h
}

export function getAccentColors(hex: string): { accent: string; accentLight: string } {
  const { h, s } = hexToHsl(hex)
  return {
    accent: `hsl(${h}, ${s}%, 65%)`,
    accentLight: `hsl(${h}, ${s}%, 82%)`,
  }
}

// ── Room helpers ──────────────────────────────────────────────────────────────

/**
 * Scale for a world-space billboard label so its on-screen size stays roughly
 * constant: apparent size ~ 1/distance, so counter it by scaling with distance.
 * Clamped so a focused cup's label can't fill the screen and a far one can't
 * shrink to a smudge.
 */
export function labelScale(distance: number, ref = 6, min = 0.55, max = 2.4): number {
  const d = Number.isFinite(distance) ? distance : 0
  return Math.min(max, Math.max(min, d / ref))
}

/**
 * Mapbox markers are DOM overlays — they need no style or source load, so the
 * only preconditions are a live map and something to place. Deliberately does
 * NOT consult map.loaded(): that is recomputed per frame and goes false again
 * while tiles stream, which used to send a late locations response down the
 * `map.on("load")` path after that one-shot event had already fired.
 */
export function shouldPlaceMarkers(mapReady: boolean, locationCount: number): boolean {
  return mapReady && locationCount > 0
}
