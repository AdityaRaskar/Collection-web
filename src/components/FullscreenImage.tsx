import React, { useRef, useState, useEffect } from 'react'

type Props = {
  src: string
  alt?: string
  onClose?: () => void
}

export default function FullscreenImage({ src, alt = '', onClose }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 })
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const dragging = useRef(false)
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null)
  const lastTap = useRef<number>(0)
  const pinch = useRef<{ startDist: number; startScale: number; origin: { x: number; y: number } } | null>(null)
  const baseScale = useRef(1)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function clientToPercentFromPoint(x: number, y: number) {
    const el = imgRef.current
    if (!el) return { x: 50, y: 50 }
    const rect = el.getBoundingClientRect()
    const px = ((x - rect.left) / rect.width) * 100
    const py = ((y - rect.top) / rect.height) * 100
    return { x: Math.max(0, Math.min(100, px)), y: Math.max(0, Math.min(100, py)) }
  }

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    const naturalW = img.naturalWidth || img.width
    const naturalH = img.naturalHeight || img.height
    const vw = window.innerWidth
    const vh = window.innerHeight
    const fit = Math.min(vw / naturalW, vh / naturalH)
    baseScale.current = fit || 1
    setScale(1)
    setTranslate({ x: 0, y: 0 })
    setOrigin({ x: 50, y: 50 })
  }

  function handleDoubleClick(ev: React.MouseEvent) {
    ev.preventDefault()
    const levels = [1, 2, 4]
    const rounded = Math.round(scale)
    const idx = Math.max(0, levels.indexOf(rounded))
    const nextLevel = levels[(idx + 1) % levels.length] || 2
    if (nextLevel === 1) {
      setScale(1)
      setTranslate({ x: 0, y: 0 })
      setOrigin({ x: 50, y: 50 })
    } else {
      const p = clientToPercentFromPoint(ev.clientX, ev.clientY)
      setOrigin(p)
      setScale(nextLevel)
    }
  }

  function handleTap(ev: React.TouchEvent) {
    const t = Date.now()
    const dt = t - lastTap.current
    lastTap.current = t
    if (dt < 300 && ev.touches.length === 1) {
      const touch = ev.touches[0]
      const p = clientToPercentFromPoint(touch.clientX, touch.clientY)
      const levels = [1, 2, 4]
      const current = Math.round(scale)
      const idx = Math.max(0, levels.indexOf(current))
      const nextLevel = levels[(idx + 1) % levels.length] || 2
      if (nextLevel === 1) {
        setScale(1)
        setTranslate({ x: 0, y: 0 })
        setOrigin({ x: 50, y: 50 })
      } else {
        setOrigin(p)
        setScale(nextLevel)
      }
    }
  }

  function handleMouseDown(ev: React.MouseEvent) {
    if (scale <= 1) return
    dragging.current = true
    dragStart.current = { x: ev.clientX, y: ev.clientY, tx: translate.x, ty: translate.y }
    window.addEventListener('mousemove', handleMouseMove as any)
    window.addEventListener('mouseup', handleMouseUp as any)
  }

  function handleMouseMove(ev: MouseEvent) {
    if (!dragging.current || !dragStart.current) return
    const dx = ev.clientX - dragStart.current.x
    const dy = ev.clientY - dragStart.current.y
    setTranslate({ x: dragStart.current.tx + dx, y: dragStart.current.ty + dy })
  }

  function handleMouseUp() {
    dragging.current = false
    dragStart.current = null
    window.removeEventListener('mousemove', handleMouseMove as any)
    window.removeEventListener('mouseup', handleMouseUp as any)
  }

  function handleWheel(ev: React.WheelEvent) {
    ev.preventDefault()
    const delta = -ev.deltaY
    const step = delta > 0 ? 0.25 : -0.25
    const next = Math.min(6, Math.max(1, +(scale + step).toFixed(2)))
    const img = imgRef.current
    if (!img) {
      setScale(next)
      return
    }
    const rect = img.getBoundingClientRect()
    const px = ((ev.clientX - rect.left) / rect.width) * 100
    const py = ((ev.clientY - rect.top) / rect.height) * 100
    setOrigin({ x: Math.max(0, Math.min(100, px)), y: Math.max(0, Math.min(100, py)) })
    setScale(next)
  }

  function getDist(t1: any, t2: any) {
    const dx = t2.clientX - t1.clientX
    const dy = t2.clientY - t1.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  function handleTouchStart(ev: React.TouchEvent) {
    if (ev.touches.length === 2) {
      const d = getDist(ev.touches[0], ev.touches[1])
      const midX = (ev.touches[0].clientX + ev.touches[1].clientX) / 2
      const midY = (ev.touches[0].clientY + ev.touches[1].clientY) / 2
      pinch.current = { startDist: d, startScale: scale, origin: clientToPercentFromPoint(midX, midY) }
    } else if (ev.touches.length === 1) {
      const t = ev.touches[0]
      dragStart.current = { x: t.clientX, y: t.clientY, tx: translate.x, ty: translate.y }
      dragging.current = scale > 1
    }
  }

  function handleTouchMove(ev: React.TouchEvent) {
    if (pinch.current && ev.touches.length === 2) {
      const d = getDist(ev.touches[0], ev.touches[1])
      const factor = d / pinch.current.startDist
      const next = Math.max(1, Math.min(6, +(pinch.current.startScale * factor).toFixed(2)))
      setOrigin(pinch.current.origin)
      setScale(next)
    } else if (dragging.current && ev.touches.length === 1 && dragStart.current) {
      const t = ev.touches[0]
      const dx = t.clientX - dragStart.current.x
      const dy = t.clientY - dragStart.current.y
      setTranslate({ x: dragStart.current.tx + dx, y: dragStart.current.ty + dy })
    }
  }

  function handleTouchEnd(ev: React.TouchEvent) {
    if (ev.touches.length < 2) pinch.current = null
    if (ev.touches.length === 0) {
      dragging.current = false
      dragStart.current = null
    }
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <button
        aria-label="Close image"
        onClick={onClose}
        className="absolute top-4 right-4 z-60 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
      >
        ✕
      </button>

      <div className="w-screen h-screen overflow-hidden touch-none flex items-center justify-center">
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          onTouchStart={(e) => {
            handleTap(e as any)
            handleTouchStart(e)
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transformOrigin: `${origin.x}% ${origin.y}%`,
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${baseScale.current * scale})`,
            cursor: scale > 1 ? (dragging.current ? 'grabbing' : 'grab') : 'zoom-in',
            transition: dragging.current ? 'none' : 'transform 120ms ease',
            maxWidth: 'none',
            maxHeight: 'none',
            display: 'block'
          }}
        />
      </div>
    </div>
  )
}
