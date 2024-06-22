type Pixel = [number, number, number] // RGB values

export function nearestNeighbor(pixels: Pixel[], width: number, height: number, factor: number): Pixel[] {
  const newWidth = Math.floor(width / factor)
  const newHeight = Math.floor(height / factor)
  const newPixels: Pixel[] = []

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const i = y * newWidth + x
      const j = Math.floor(y * factor) * width + Math.floor(x * factor)
      newPixels[i] = pixels[j]
    }
  }

  return newPixels
}

export function quantizePixels(pixels: Pixel[], numColors: number, iterationCount = 1): Pixel[] {
  // Helper function to calculate the Euclidean distance between two pixels
  function distance(p1: Pixel, p2: Pixel): number {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2)
  }

  // Initialize centroids randomly
  const centroids: Pixel[] = []
  for (let i = 0; i < numColors; i++) {
    const randomIndex = Math.floor(Math.random() * pixels.length)
    centroids.push(pixels[randomIndex])
  }

  let clusters: Pixel[][] = new Array(numColors).fill(null).map(() => [])
  let oldClusters: Pixel[][] = []

  // Repeat until convergence
  for (let i = 0; i < iterationCount; i++) {
    // Assign each pixel to the nearest centroid
    clusters = new Array(numColors).fill(null).map(() => [])
    for (const pixel of pixels) {
      let minDistance = Infinity
      let closestCentroidIndex = -1
      for (let i = 0; i < centroids.length; i++) {
        const d = distance(pixel, centroids[i])
        if (d < minDistance) {
          minDistance = d
          closestCentroidIndex = i
        }
      }
      clusters[closestCentroidIndex].push(pixel)
    }

    // Check for convergence
    if (i + 1 === iterationCount) {
      break
    }

    // Update centroids to the mean of the clusters
    for (let i = 0; i < numColors; i++) {
      if (clusters[i].length > 0) {
        const sum = clusters[i].reduce(
          (acc, pixel) => {
            return [acc[0] + pixel[0], acc[1] + pixel[1], acc[2] + pixel[2]]
          },
          [0, 0, 0],
        )
        centroids[i] = [
          Math.round(sum[0] / clusters[i].length),
          Math.round(sum[1] / clusters[i].length),
          Math.round(sum[2] / clusters[i].length),
        ]
      }
    }

    oldClusters = clusters
  }

  // Replace each pixel with the centroid of the cluster it belongs to
  const quantizedPixels: Pixel[] = pixels.map((pixel) => {
    let minDistance = Infinity
    let closestCentroid: Pixel = [0, 0, 0]
    for (const centroid of centroids) {
      const d = distance(pixel, centroid)
      if (d < minDistance) {
        minDistance = d
        closestCentroid = centroid
      }
    }
    return closestCentroid
  })

  return quantizedPixels
}

function calculateLuminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function calculateVibrance(r: number, g: number, b: number): number {
  return Math.max(r, g, b) - Math.min(r, g, b)
}

export function selectDarkVibrantPixel(pixels: Pixel[]): Pixel | null {
  let darkVibrantPixel: Pixel | null = null
  let maxVibrance = -1
  let minLuminance = 256 // Luminance can't be more than 255

  for (const pixel of pixels) {
    const [r, g, b] = pixel
    const luminance = calculateLuminance(r, g, b)
    const vibrance = calculateVibrance(r, g, b)

    // Check if this pixel is darker and more vibrant than the current candidate
    if (vibrance > maxVibrance && luminance < minLuminance) {
      darkVibrantPixel = pixel
      maxVibrance = vibrance
      minLuminance = luminance
    }
  }

  return darkVibrantPixel
}
