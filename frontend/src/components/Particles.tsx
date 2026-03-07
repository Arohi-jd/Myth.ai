import { useEffect, useRef } from 'react'
import './Particles.css'

export default function GoldenParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Array<{
      x: number; y: number; size: number; speed: number;
      opacity: number; drift: number
    }> = []

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        drift: (Math.random() - 0.5) * 0.3,
      })
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      particles.forEach((p) => {
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(212, 168, 67, ${p.opacity})`
        ctx!.fill()

        // Subtle glow
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(212, 168, 67, ${p.opacity * 0.15})`
        ctx!.fill()

        p.y -= p.speed
        p.x += p.drift

        if (p.y < -10) {
          p.y = canvas!.height + 10
          p.x = Math.random() * canvas!.width
        }
        if (p.x < -10 || p.x > canvas!.width + 10) {
          p.x = Math.random() * canvas!.width
        }
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="golden-particles" />
}
