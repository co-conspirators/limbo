type RGB = [number, number, number]
type HSL = [number, number, number]

class Swatch {
  rgb: RGB
  population: number
  hsl?: HSL

  constructor(rgb: RGB, population: number) {
    this.rgb = rgb
    this.population = population
  }

  getHsl(): HSL {
    if (!this.hsl) {
      this.hsl = rgbToHsl(this.rgb[0], this.rgb[1], this.rgb[2])
    }
    return this.hsl
  }

  getHex(): string {
    const [r, g, b] = this.rgb
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, l]
}

function hslToRgb(h: number, s: number, l: number): RGB {
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function quantize(pixels: RGB[], colorCount: number): Swatch[] {
  const colorMap: { [key: string]: { rgb: RGB; count: number } } = {}

  pixels.forEach((pixel) => {
    const key = pixel.toString()
    if (!colorMap[key]) {
      colorMap[key] = { rgb: pixel, count: 0 }
    }
    colorMap[key].count++
  })

  return Object.values(colorMap).map((entry) => new Swatch(entry.rgb, entry.count))
}

function findVibrantSwatches(swatches: Swatch[]): Swatch[] {
  const vibrantSwatches: Swatch[] = []
  const targetLuma = 0.5
  const minLuma = 0.3
  const maxLuma = 0.7
  const targetSaturation = 0.7
  const minSaturation = 0.35

  swatches.forEach((swatch) => {
    const [h, s, l] = swatch.getHsl()
    if (s >= minSaturation && s <= targetSaturation && l >= minLuma && l <= maxLuma) {
      vibrantSwatches.push(swatch)
    }
  })

  return vibrantSwatches
}

export function getVibrantSwatches(pixels: RGB[], colorCount: number = 64): Swatch[] {
  const swatches = quantize(pixels, colorCount)
  const vibrantSwatches = findVibrantSwatches(swatches)
  return vibrantSwatches
}
