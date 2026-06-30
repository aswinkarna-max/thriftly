// client/src/pages/LoginPage.jsx
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginUser, clearError } from '../features/authSlice.js'
import toast from 'react-hot-toast'

const NUM_PARTICLES = 140

function initParticles(W, H) {
  return Array.from({ length: NUM_PARTICLES }, () => {
    const emerald = Math.random() < 0.3
    const cyan    = !emerald && Math.random() < 0.2
    return {
      x:            Math.random() * W,
      y:            Math.random() * H,
      r:            Math.random() * 1.6 + 0.3,
      vx:           (Math.random() - 0.5) * 0.25,
      vy:           (Math.random() - 0.5) * 0.25,
      alpha:        Math.random() * 0.5 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir:   Math.random() < 0.5 ? 1 : -1,
      color:        emerald ? '52,211,153' : cyan ? '6,182,212' : '255,255,255',
    }
  })
}

function ParticleCanvas() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W   = window.innerWidth
    const H   = window.innerHeight
    canvas.width  = W
    canvas.height = H

    const particles = initParticles(W, H)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        p.alpha += p.twinkleSpeed * p.twinkleDir
        if (p.alpha > 0.75 || p.alpha < 0.05) p.twinkleDir *= -1
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`
        ctx.fill()
      }

      let connected = 0
      for (let i = 0; i < NUM_PARTICLES && connected < 80; i++) {
        for (let j = i + 1; j < NUM_PARTICLES && connected < 80; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(52,211,153,${(1 - dist / 100) * 0.12})`
            ctx.lineWidth = 0.5
            ctx.stroke()
            connected++
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (user) navigate(user.role === 'seller' ? '/seller/dashboard' : '/home')
  }, [user, navigate])

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser(form)) }

  const inputStyle = {
    background: '#1e293b',
    border: '0.5px solid rgba(255,255,255,0.08)',
  }
  const inputFocus = (e) => e.target.style.borderColor = 'rgba(52,211,153,0.4)'
  const inputBlur  = (e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#030712' }}
    >
      <ParticleCanvas />

      {/* Soft radial glow behind form */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl p-8 relative z-10"
        style={{
          background: 'rgba(15,23,42,0.85)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
          >
            <span className="text-white font-black text-sm">T</span>
          </div>
          <span className="text-white font-bold text-lg">Thriftly</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
              style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Password</label>
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange} required placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
              style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
            />
          </div>

          <motion.button
            type="submit" disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(5,150,105,0.35)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </motion.button>
        </form>

        <p className="text-gray-600 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  )
}