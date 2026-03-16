// client/src/pages/ProductDetailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowLeft, FiShoppingCart, FiHeart,
  FiShield, FiStar, FiPackage, FiChevronLeft, FiChevronRight,
  FiZoomIn, FiZoomOut, FiX
} from 'react-icons/fi'
import { fetchProductById, fetchRelatedProducts } from '../features/productSlice.js'
import Navbar from '../components/NavBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import toast from 'react-hot-toast'

const conditionConfig = {
  'new': { label: 'New', color: 'text-emerald-400 bg-emerald-400/10', desc: 'Brand new, never used' },
  'like-new': { label: 'Like New', color: 'text-blue-400 bg-blue-400/10', desc: 'Used once or twice, no visible wear' },
  'good': { label: 'Good', color: 'text-yellow-400 bg-yellow-400/10', desc: 'Minor signs of wear, fully functional' },
  'fair': { label: 'Fair', color: 'text-orange-400 bg-orange-400/10', desc: 'Visible wear but works perfectly' },
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { product, relatedProducts, loading } = useSelector((state) => state.products)
  const { user } = useSelector((state) => state.auth)

  const [activeImg, setActiveImg] = useState(0)
  const [liked, setLiked] = useState(false)
  const [imgDirection, setImgDirection] = useState(1)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setActiveImg(0)
    dispatch(fetchProductById(id))
    dispatch(fetchRelatedProducts(id))
    window.scrollTo(0, 0)
  }, [id, dispatch])

  const changeImg = (newIndex, direction) => {
    setImgDirection(direction)
    setActiveImg(newIndex)
  }

  const prevImg = () => {
    if (!product?.images?.length) return
    const newIndex = activeImg === 0 ? product.images.length - 1 : activeImg - 1
    changeImg(newIndex, -1)
  }

  const nextImg = () => {
    if (!product?.images?.length) return
    const newIndex = activeImg === product.images.length - 1 ? 0 : activeImg + 1
    changeImg(newIndex, 1)
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add to cart')
      return
    }
    toast.success(`${product.name} added to cart!`)
  }

  if (loading || !product) {
    return (
      <div className="min-h-screen" style={{ background: '#030712' }}>
        <Navbar />
        <div className="pt-24 px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="rounded-2xl skeleton-shimmer h-96" />
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-8 rounded-xl skeleton-shimmer" style={{ width: `${80 - i * 10}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const condition = conditionConfig[product.condition] || conditionConfig['good']
  const images = product.images || []

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <Navbar />

      <div className="pt-24 px-6 md:px-10 pb-20 max-w-7xl mx-auto">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-400 transition-colors mb-8"
        >
          <FiArrowLeft size={16} /> Back to listings
        </motion.button>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">

          {/* Left — Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="group"
          >
            {/* Main image */}
            <div
              className="relative rounded-2xl overflow-hidden mb-4 cursor-zoom-in"
              style={{ background: 'linear-gradient(135deg,#1e293b,#2d3748)', aspectRatio: '1' }}
              onClick={() => setZoomOpen(true)}
            >
              <AnimatePresence mode="wait" custom={imgDirection}>
                    <motion.img
                        key={activeImg}
                        custom={imgDirection}
                        variants={{
                        enter: (d) => ({ opacity: 0, x: d * 30 }),
                        center: { opacity: 1, x: 0 },
                        exit: (d) => ({ opacity: 0, x: d * -30 }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                        src={images[activeImg]?.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        style={{ willChange: 'transform, opacity' }}
                        />
                </AnimatePresence>

              {/* Click to zoom hint */}
              <div
                className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#9ca3af', backdropFilter: 'blur(4px)' }}
              >
                🔍 Click to zoom
              </div>

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImg() }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '0.5px solid rgba(255,255,255,0.15)' }}
                  >
                    <FiChevronLeft size={18} className="text-white" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImg() }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '0.5px solid rgba(255,255,255,0.15)' }}
                  >
                    <FiChevronRight size={18} className="text-white" />
                  </button>
                </>
              )}

              {/* Certified badge */}
              {product.certification?.hasCertification && (
                <div
                  className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(5,150,105,0.9)', color: 'white', backdropFilter: 'blur(4px)' }}
                >
                  <FiShield size={12} /> Originality Certified
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => changeImg(i, i > activeImg ? 1 : -1)}
                    className="w-16 h-16 rounded-xl overflow-hidden transition-all"
                    style={{
                      border: i === activeImg ? '2px solid #34d399' : '2px solid transparent',
                      opacity: i === activeImg ? 1 : 0.5,
                    }}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right — Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {/* Category + condition */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-medium px-3 py-1 rounded-full capitalize"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '0.5px solid rgba(255,255,255,0.08)' }}
              >
                {product.category}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${condition.color}`}>
                {condition.label}
              </span>
              {product.isSold && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full text-red-400 bg-red-400/10">
                  Sold
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Brand + Size */}
            <div className="flex gap-4">
              {product.brand && (
                <div className="text-sm text-gray-400">
                  Brand: <span className="text-white font-medium">{product.brand}</span>
                </div>
              )}
              {product.size && (
                <div className="text-sm text-gray-400">
                  Size: <span className="text-white font-medium">{product.size}</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div
              className="text-4xl font-extrabold"
              style={{ background: 'linear-gradient(135deg,#34d399,#0891b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              ₹{product.price.toLocaleString()}
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed text-sm">{product.description}</p>

            {/* Condition info */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}
            >
              <FiPackage size={16} className="text-gray-500" />
              <span className="text-sm text-gray-400">{condition.desc}</span>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(52,211,153,0.08)', color: '#34d399', border: '0.5px solid rgba(52,211,153,0.15)' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA buttons */}
            {!product.isSold ? (
              <div className="flex gap-3 mt-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(5,150,105,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <FiShoppingCart size={16} /> Add to cart
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setLiked(!liked)}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                  style={{
                    background: liked ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                    border: liked ? '0.5px solid rgba(239,68,68,0.3)' : '0.5px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <FiHeart size={18} className={liked ? 'text-red-400 fill-red-400' : 'text-gray-500'} />
                </motion.button>
              </div>
            ) : (
              <div
                className="py-4 rounded-2xl text-center text-sm font-semibold text-red-400"
                style={{ background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.2)' }}
              >
                This item has been sold
              </div>
            )}

            {/* Seller card */}
            <div
              className="rounded-2xl p-4 mt-2"
              style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-xs text-gray-600 mb-3 uppercase tracking-wider">Sold by</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#059669,#0891b2)' }}
                >
                  {product.seller?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {product.seller?.shopName || product.seller?.name}
                    </span>
                    {product.seller?.isVerifiedSeller && (
                      <span className="text-xs text-emerald-400 font-medium">✓ Verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FiStar key={s} size={10} className="text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Views */}
            <p className="text-xs text-gray-600">{product.views} people viewed this listing</p>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">Similar listings</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              <div>
                <h3 className="text-sm font-semibold text-white">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{activeImg + 1} / {images.length}</p>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setZoomScale(1); setZoomPos({ x: 0, y: 0 }) }}
                  className="text-xs px-3 py-1.5 rounded-full transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '0.5px solid rgba(255,255,255,0.1)' }}
                >
                  Reset
                </button>
                <button
                  onClick={() => setZoomScale(s => Math.max(1, s - 0.5))}
                  disabled={zoomScale <= 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)' }}
                >
                  <FiZoomOut size={16} className="text-white" />
                </button>
                <span className="text-sm font-medium text-gray-400 w-12 text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={() => setZoomScale(s => Math.min(4, s + 0.5))}
                  disabled={zoomScale >= 4}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)' }}
                >
                  <FiZoomIn size={16} className="text-white" />
                </button>
                <button
                  onClick={() => { setZoomOpen(false); setZoomScale(1); setZoomPos({ x: 0, y: 0 }) }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all ml-2"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)' }}
                >
                  <FiX size={16} className="text-white" />
                </button>
              </div>
            </div>

            {/* Image area */}
            <div
              className="flex-1 overflow-hidden flex items-center justify-center relative select-none"
              style={{ cursor: zoomScale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in' }}
              onWheel={(e) => {
                e.preventDefault()
                const delta = e.deltaY > 0 ? -0.25 : 0.25
                const newScale = Math.min(4, Math.max(1, zoomScale + delta))
                setZoomScale(newScale)
                if (newScale <= 1) setZoomPos({ x: 0, y: 0 })
              }}
              onMouseDown={(e) => {
                if (zoomScale > 1) {
                  setIsPanning(true)
                  setPanStart({ x: e.clientX - zoomPos.x, y: e.clientY - zoomPos.y })
                }
              }}
              onMouseMove={(e) => {
                if (isPanning && zoomScale > 1) {
                  setZoomPos({ x: e.clientX - panStart.x, y: e.clientY - panStart.y })
                }
              }}
              onMouseUp={() => setIsPanning(false)}
              onMouseLeave={() => setIsPanning(false)}
              onClick={() => {
                if (zoomScale === 1) setZoomScale(2)
              }}
            >
              <motion.img
                src={images[activeImg]?.url}
                alt={product.name}
                animate={{ scale: zoomScale, x: zoomPos.x, y: zoomPos.y }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                style={{ maxHeight: '75vh', maxWidth: '90vw', objectFit: 'contain', pointerEvents: 'none' }}
                draggable={false}
              />
            </div>

            {/* Bottom bar */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex gap-2">
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => { prevImg(); setZoomScale(1); setZoomPos({ x: 0, y: 0 }) }}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)' }}
                    >
                      <FiChevronLeft size={16} className="text-white" />
                    </button>
                    <button
                      onClick={() => { nextImg(); setZoomScale(1); setZoomPos({ x: 0, y: 0 }) }}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)' }}
                    >
                      <FiChevronRight size={16} className="text-white" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { changeImg(i, i > activeImg ? 1 : -1); setZoomScale(1); setZoomPos({ x: 0, y: 0 }) }}
                    className="w-12 h-12 rounded-lg overflow-hidden transition-all"
                    style={{
                      border: i === activeImg ? '2px solid #34d399' : '2px solid transparent',
                      opacity: i === activeImg ? 1 : 0.4,
                    }}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-600">Scroll to zoom · Drag to pan</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}