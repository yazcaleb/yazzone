'use client'

import { useEffect, useRef } from 'react'

type RenderMode =
  | 'characters' | 'dither' | 'mosaic' | 'pixel' | 'dots' | 'cross'
  | 'diamond' | 'voxel' | 'lego' | 'mixed' | 'lines' | 'diagonal'
  | 'braille' | 'disco' | 'hexdump' | 'matrix' | 'rings' | 'hearts'
  | 'stars' | 'hexagons' | 'triangles' | 'bubbles' | 'hatch'
  | 'contour' | 'halfblocks'

type Cell = {
  x: number
  y: number
  r: number
  g: number
  b: number
  luminance: number
  edge: number
}

const CONFIG = {
  renderMode: 'dither' as RenderMode,
  cellSize: 10,
  coverage: 100,
  invert: false,
  brightness: 0,
  contrast: 128,
  saturation: 0,
  grayscale: 100,
  tint: '#3ca6ff',
  tintOpacity: 0,
  edgeEmphasis: 0,
  density: 0,
  bgOpacity: 91,
  blurAmount: 30,
  tiltFocus: 35,
  tiltPosition: 50,
  tiltFeather: 15,
  animStyle: 'shimmer' as 'wave' | 'pulse' | 'shimmer' | 'ripple' | 'flicker',
  animSpeed: 100,
  animIntensity: 60,
  pfx: {
    chromatic: 20,
    halftone: 20,
    filmDust: 20,
  },
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

const GLYPHS = ' .,:;irsXA253hMHGS#9B&@'
const HEX = '0123456789ABCDEF'
const MATRIX = '01アイウエオカキクケコサシスセソ'

function clamp(value: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value))
}

function seeded(value: number) {
  const x = Math.sin(value * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function adjustedColor(cell: Cell) {
  let { r, g, b } = cell
  const brightness = CONFIG.brightness * 2.55
  r += brightness
  g += brightness
  b += brightness

  const contrast = (259 * (CONFIG.contrast + 255)) / (255 * (259 - CONFIG.contrast))
  r = contrast * (r - 128) + 128
  g = contrast * (g - 128) + 128
  b = contrast * (b - 128) + 128

  const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const saturation = (CONFIG.saturation + 100) / 100
  r = gray + (r - gray) * saturation
  g = gray + (g - gray) * saturation
  b = gray + (b - gray) * saturation

  const grayscale = CONFIG.grayscale / 100
  r = r * (1 - grayscale) + gray * grayscale
  g = g * (1 - grayscale) + gray * grayscale
  b = b * (1 - grayscale) + gray * grayscale

  return { r: clamp(r), g: clamp(g), b: clamp(b) }
}

function animationOffset(cell: Cell, time: number, width: number, height: number) {
  const speed = 0.25 + CONFIG.animSpeed / 55
  const amount = CONFIG.animIntensity / 100
  const t = time * 0.001 * speed

  switch (CONFIG.animStyle) {
    case 'wave':
      return Math.sin(cell.x * 0.025 + t * 2) * 0.16 * amount
    case 'pulse':
      return Math.sin(t * 2.4) * 0.14 * amount
    case 'ripple': {
      const dx = cell.x - width / 2
      const dy = cell.y - height / 2
      return Math.sin(Math.hypot(dx, dy) * 0.035 - t * 3) * 0.13 * amount
    }
    case 'flicker':
      return (seeded(cell.x * 41 + cell.y * 17 + Math.floor(t * 12)) - 0.5) * 0.24 * amount
    default:
      return Math.sin(cell.x * 0.018 + cell.y * 0.011 + t * 2.7) * 0.11 * amount
  }
}

function pathStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    const r = i % 2 === 0 ? radius : radius * 0.42
    const px = x + Math.cos(angle) * r
    const py = y + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

function pathHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath()
  ctx.moveTo(x, y + size * 0.35)
  ctx.bezierCurveTo(x - size, y - size * 0.25, x - size * 0.65, y - size, x, y - size * 0.45)
  ctx.bezierCurveTo(x + size * 0.65, y - size, x + size, y - size * 0.25, x, y + size * 0.35)
  ctx.closePath()
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  cell: Cell,
  luminance: number,
  time: number,
) {
  const size = CONFIG.cellSize
  const x = cell.x
  const y = cell.y
  const darkness = 1 - luminance
  const centerX = x + size / 2
  const centerY = y + size / 2
  const radius = Math.max(0.5, darkness * size * 0.48)
  const mode = CONFIG.renderMode

  if (mode === 'dither') {
    const threshold = (BAYER[(y / size) % 4 | 0][(x / size) % 4 | 0] + 0.5) / 16
    if (darkness > threshold) ctx.fillRect(x, y, size, size)
    return
  }

  if (mode === 'characters' || mode === 'hexdump' || mode === 'matrix' || mode === 'braille') {
    const chars = mode === 'hexdump' ? HEX : mode === 'matrix' ? MATRIX : mode === 'braille' ? '⠁⠃⠇⠏⠟⠿⣿' : GLYPHS
    const index = Math.min(chars.length - 1, Math.floor(darkness * chars.length))
    const rain = mode === 'matrix' ? Math.floor(time * 0.012 + y / size) : 0
    const glyph = chars[(index + rain) % chars.length]
    ctx.font = `${Math.max(6, size * (0.65 + darkness * 0.45))}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(glyph, centerX, centerY)
    return
  }

  switch (mode) {
    case 'mosaic':
    case 'pixel':
      ctx.fillRect(x + 0.5, y + 0.5, Math.max(1, size - (mode === 'mosaic' ? 1 : 0)), Math.max(1, size - (mode === 'mosaic' ? 1 : 0)))
      break
    case 'dots':
    case 'disco':
    case 'bubbles':
      ctx.beginPath()
      ctx.arc(centerX, centerY, mode === 'bubbles' ? radius * 0.82 : radius, 0, Math.PI * 2)
      mode === 'bubbles' ? ctx.stroke() : ctx.fill()
      break
    case 'cross':
      ctx.fillRect(centerX - radius * 0.2, centerY - radius, radius * 0.4, radius * 2)
      ctx.fillRect(centerX - radius, centerY - radius * 0.2, radius * 2, radius * 0.4)
      break
    case 'diamond':
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - radius)
      ctx.lineTo(centerX + radius, centerY)
      ctx.lineTo(centerX, centerY + radius)
      ctx.lineTo(centerX - radius, centerY)
      ctx.closePath()
      ctx.fill()
      break
    case 'voxel':
      ctx.fillRect(x + 1, y + size * 0.28, size - 2, size * 0.7)
      ctx.globalAlpha *= 0.6
      ctx.beginPath()
      ctx.moveTo(x + 1, y + size * 0.28)
      ctx.lineTo(centerX, y)
      ctx.lineTo(x + size - 1, y + size * 0.28)
      ctx.closePath()
      ctx.fill()
      break
    case 'lego':
      ctx.fillRect(x + 1, y + 2, size - 2, size - 3)
      ctx.beginPath()
      ctx.arc(centerX, y + 2, Math.max(1, size * 0.18), 0, Math.PI * 2)
      ctx.fill()
      break
    case 'mixed':
      if (((x + y) / size) % 3 < 1) ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2)
      else {
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    case 'lines':
      ctx.lineWidth = Math.max(0.5, darkness * 2)
      ctx.beginPath()
      ctx.moveTo(x, centerY)
      ctx.lineTo(x + size, centerY)
      ctx.stroke()
      break
    case 'diagonal':
      ctx.lineWidth = Math.max(0.5, darkness * 2)
      ctx.beginPath()
      ctx.moveTo(x, y + size)
      ctx.lineTo(x + size, y)
      ctx.stroke()
      break
    case 'rings':
      ctx.lineWidth = Math.max(0.5, darkness * 1.5)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()
      break
    case 'hearts':
      pathHeart(ctx, centerX, centerY, radius)
      ctx.fill()
      break
    case 'stars':
      pathStar(ctx, centerX, centerY, radius)
      ctx.fill()
      break
    case 'hexagons': {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const px = centerX + Math.cos(angle) * radius
        const py = centerY + Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      break
    }
    case 'triangles':
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - radius)
      ctx.lineTo(centerX + radius, centerY + radius)
      ctx.lineTo(centerX - radius, centerY + radius)
      ctx.closePath()
      ctx.fill()
      break
    case 'hatch':
      ctx.lineWidth = Math.max(0.5, darkness * 1.2)
      ctx.beginPath()
      ctx.moveTo(x, y + size)
      ctx.lineTo(x + size, y)
      if (darkness > 0.55) {
        ctx.moveTo(x, y)
        ctx.lineTo(x + size, y + size)
      }
      ctx.stroke()
      break
    case 'contour':
      if (Math.abs((luminance * 8) % 1 - 0.5) < 0.16) {
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, size * 0.38, 0, Math.PI * 2)
        ctx.stroke()
      }
      break
    case 'halfblocks':
      ctx.fillRect(x, y + (luminance > 0.5 ? size / 2 : 0), size, size / 2)
      break
  }
}

function sampleImage(image: HTMLImageElement, width: number, height: number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []

  canvas.width = width
  canvas.height = height
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  const offsetX = (width - drawWidth) / 2
  const offsetY = (height - drawHeight) / 2
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)

  const pixels = ctx.getImageData(0, 0, width, height).data
  const cells: Cell[] = []
  const size = CONFIG.cellSize

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      let r = 0
      let g = 0
      let b = 0
      let count = 0
      for (let sy = y; sy < Math.min(y + size, height); sy += 2) {
        for (let sx = x; sx < Math.min(x + size, width); sx += 2) {
          const index = (sy * width + sx) * 4
          r += pixels[index]
          g += pixels[index + 1]
          b += pixels[index + 2]
          count++
        }
      }
      r /= count
      g /= count
      b /= count
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
      cells.push({ x, y, r, g, b, luminance, edge: 0 })
    }
  }

  const columns = Math.ceil(width / size)
  for (let i = 0; i < cells.length; i++) {
    const right = cells[i + 1]?.luminance ?? cells[i].luminance
    const below = cells[i + columns]?.luminance ?? cells[i].luminance
    cells[i].edge = Math.min(1, Math.abs(cells[i].luminance - right) + Math.abs(cells[i].luminance - below))
  }

  return cells
}

function addPostEffects(
  ctx: CanvasRenderingContext2D,
  scratch: HTMLCanvasElement,
  width: number,
  height: number,
  time: number,
  dark: boolean,
) {
  if (CONFIG.pfx.chromatic > 0) {
    const shift = CONFIG.pfx.chromatic / 12
    const scratchCtx = scratch.getContext('2d')
    if (scratchCtx) {
      scratchCtx.clearRect(0, 0, width, height)
      scratchCtx.drawImage(ctx.canvas, 0, 0)
      scratchCtx.globalCompositeOperation = 'source-atop'
      scratchCtx.fillStyle = 'rgba(255, 32, 32, 0.28)'
      scratchCtx.fillRect(0, 0, width, height)
      scratchCtx.globalCompositeOperation = 'source-over'

      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.08
      ctx.drawImage(scratch, -shift, 0)

      scratchCtx.clearRect(0, 0, width, height)
      scratchCtx.drawImage(ctx.canvas, 0, 0)
      scratchCtx.globalCompositeOperation = 'source-atop'
      scratchCtx.fillStyle = 'rgba(32, 120, 255, 0.25)'
      scratchCtx.fillRect(0, 0, width, height)
      scratchCtx.globalCompositeOperation = 'source-over'
      ctx.drawImage(scratch, shift, 0)
      ctx.restore()
    }
  }

  if (CONFIG.pfx.halftone > 0) {
    ctx.save()
    ctx.globalAlpha = CONFIG.pfx.halftone / 900
    ctx.fillStyle = dark ? '#fff' : '#000'
    const spacing = 6
    for (let y = 0; y < height; y += spacing) {
      for (let x = (y / spacing) % 2 ? spacing / 2 : 0; x < width; x += spacing) {
        ctx.beginPath()
        ctx.arc(x, y, 0.65, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.restore()
  }

  if (CONFIG.pfx.filmDust > 0) {
    ctx.save()
    ctx.fillStyle = dark ? '#fff' : '#000'
    ctx.globalAlpha = CONFIG.pfx.filmDust / 650
    const frame = Math.floor(time / 180)
    const particles = Math.floor((width * height) / 28000)
    for (let i = 0; i < particles; i++) {
      const x = seeded(i * 71 + frame * 5) * width
      const y = seeded(i * 113 + frame * 9) * height
      const size = 0.5 + seeded(i * 47 + frame) * 1.5
      ctx.fillRect(x, y, size, size)
    }
    ctx.restore()
  }
}

export default function AsciiBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const image = new Image()
    image.src = '/yazpic2-sm.webp'
    const scratch = document.createElement('canvas')
    let frames: HTMLCanvasElement[] = []
    let animationFrame = 0
    let animationTimer = 0
    let resizeTimer = 0
    let stopped = false
    let frameIndex = 0
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const renderFrame = (
      target: HTMLCanvasElement,
      cells: Cell[],
      width: number,
      height: number,
      time: number,
      dark: boolean,
    ) => {
      const targetCtx = target.getContext('2d')
      if (!targetCtx) return

      targetCtx.clearRect(0, 0, width, height)
      targetCtx.globalCompositeOperation = 'source-over'
      targetCtx.globalAlpha = CONFIG.bgOpacity / 100
      targetCtx.fillStyle = dark ? '#18181b' : '#ffffff'
      targetCtx.fillRect(0, 0, width, height)
      targetCtx.globalAlpha = 1

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        if (seeded(i * 19) * 100 > CONFIG.coverage) continue
        const color = adjustedColor(cell)
        let luminance = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255
        luminance += animationOffset(cell, time, width, height)
        luminance -= cell.edge * (CONFIG.edgeEmphasis / 100)
        luminance = clamp(luminance, 0, 1)
        if (CONFIG.invert) luminance = 1 - luminance

        targetCtx.globalAlpha = 0.24 + (1 - luminance) * 0.62
        targetCtx.fillStyle = dark ? '#f4f4f5' : '#18181b'
        targetCtx.strokeStyle = targetCtx.fillStyle
        drawCell(targetCtx, cell, luminance, time)
      }

      targetCtx.globalAlpha = 1
      addPostEffects(targetCtx, scratch, width, height, time, dark)
    }

    const stopAnimation = () => {
      window.clearTimeout(animationTimer)
      cancelAnimationFrame(animationFrame)
      animationTimer = 0
      animationFrame = 0
    }

    const scheduleAnimation = () => {
      stopAnimation()
      if (stopped || document.hidden || reduceMotion.matches || frames.length < 2) {
        return
      }

      animationTimer = window.setTimeout(() => {
        animationFrame = requestAnimationFrame(() => {
          if (stopped || document.hidden || reduceMotion.matches || frames.length < 2) {
            return
          }
          frameIndex = (frameIndex + 1) % frames.length
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(frames[frameIndex], 0, 0)
          scheduleAnimation()
        })
      }, 110)
    }

    const buildFrames = () => {
      if (!image.complete || !image.naturalWidth) return

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const scale = Math.min(1, 960 / viewportWidth, 640 / viewportHeight)
      const width = Math.max(1, Math.round(viewportWidth * scale))
      const height = Math.max(1, Math.round(viewportHeight * scale))
      const cells = sampleImage(image, width, height)
      const frameCount = reduceMotion.matches ? 1 : 6
      const dark = darkQuery.matches

      canvas.width = width
      canvas.height = height
      canvas.style.width = `${viewportWidth}px`
      canvas.style.height = `${viewportHeight}px`
      scratch.width = width
      scratch.height = height

      frames = Array.from({ length: frameCount }, (_, index) => {
        const frame = document.createElement('canvas')
        frame.width = width
        frame.height = height
        renderFrame(frame, cells, width, height, index * 180, dark)
        return frame
      })
      frameIndex = 0
      ctx.clearRect(0, 0, width, height)
      if (frames[0]) ctx.drawImage(frames[0], 0, 0)
      scheduleAnimation()
    }

    const scheduleBuild = () => {
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(buildFrames, 160)
    }

    const handleMotionChange = () => {
      buildFrames()
    }

    const handleVisibility = () => {
      stopAnimation()
      if (document.hidden) return
      if (frames[frameIndex]) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(frames[frameIndex], 0, 0)
      }
      scheduleAnimation()
    }

    const handleImageError = () => {
      stopAnimation()
      frames = []
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    image.addEventListener('load', buildFrames)
    image.addEventListener('error', handleImageError)
    window.addEventListener('resize', scheduleBuild)
    darkQuery.addEventListener('change', buildFrames)
    reduceMotion.addEventListener('change', handleMotionChange)
    document.addEventListener('visibilitychange', handleVisibility)
    if (image.complete && image.naturalWidth) buildFrames()

    return () => {
      stopped = true
      stopAnimation()
      window.clearTimeout(resizeTimer)
      frames = []
      image.removeEventListener('load', buildFrames)
      image.removeEventListener('error', handleImageError)
      window.removeEventListener('resize', scheduleBuild)
      darkQuery.removeEventListener('change', buildFrames)
      reduceMotion.removeEventListener('change', handleMotionChange)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="ascii-backdrop pointer-events-none fixed inset-0"
    />
  )
}
