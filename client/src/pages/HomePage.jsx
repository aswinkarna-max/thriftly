// client/src/pages/HomePage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchProducts } from '../features/productSlice.js'
import Navbar from '../components/NavBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { FiSearch, FiSliders } from 'react-icons/fi'

const CATEGORIES = ['all', 'sneakers', 'bags', 'watches', 'clothing', 'accessories', 'other']
const CONDITIONS = ['all', 'new', 'like-new', 'good', 'fair']
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export default function HomePage() {
  const dispatch = useDispatch()
  const { products, loading, totalPages, page } = useSelector((state) => state.products)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [condition, setCondition] = useState('all')
  const [sort, setSort] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const params = { page: currentPage, sort }
    if (search) params.search = search
    if (category !== 'all') params.category = category
    if (condition !== 'all') params.condition = condition
    dispatch(fetchProducts(params))
  }, [dispatch, search, category, condition, sort, currentPage])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 md:px-10 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.06) 0%,transparent 65%)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 65%)', transform: 'translate(-30%,30%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          {/* Live pill */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(52,211,153,0.08)', border: '0.5px solid rgba(52,211,153,0.2)', color: '#34d399' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live — verified listings updated daily
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
            The smarter way<br />
            <span style={{
              background: 'linear-gradient(135deg,#34d399 0%,#0891b2 50%,#34d399 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 4s linear infinite',
            }}>
              to thrift premium.
            </span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
            Certified pre-owned fashion and accessories from trusted sellers.
            Every item verified for authenticity and condition.
          </p>

          {/* Stats */}
          <div className="flex gap-8">
            {[['12K+', 'Listings'], ['3.4K', 'Sellers'], ['98%', 'Satisfaction']].map(([num, label]) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}>
                <div className="text-xl font-bold text-white">{num}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Search + Filter Bar */}
      <section className="px-6 md:px-10 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 mb-5"
        >
          {/* Search */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-full"
            style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)' }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(52,211,153,0.4)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <FiSearch size={16} className="text-gray-500 flex-shrink-0" />
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search sneakers, bags, watches..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-600"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all"
            style={{
              background: showFilters ? 'rgba(52,211,153,0.12)' : '#111827',
              border: showFilters ? '0.5px solid rgba(52,211,153,0.3)' : '0.5px solid rgba(255,255,255,0.08)',
              color: showFilters ? '#34d399' : '#9ca3af',
            }}
          >
            <FiSliders size={15} /> Filters
          </button>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-full text-sm outline-none"
            style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </motion.div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setCurrentPage(1) }}
              className="px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
              style={{
                background: category === cat ? 'rgba(52,211,153,0.12)' : 'transparent',
                border: category === cat ? '0.5px solid rgba(52,211,153,0.35)' : '0.5px solid rgba(255,255,255,0.08)',
                color: category === cat ? '#34d399' : '#6b7280',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Condition filter */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 flex-wrap pb-4"
            >
              <span className="text-xs text-gray-600 self-center mr-2">Condition:</span>
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  onClick={() => { setCondition(cond); setCurrentPage(1) }}
                  className="px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
                  style={{
                    background: condition === cond ? 'rgba(52,211,153,0.12)' : 'transparent',
                    border: condition === cond ? '0.5px solid rgba(52,211,153,0.35)' : '0.5px solid rgba(255,255,255,0.08)',
                    color: condition === cond ? '#34d399' : '#6b7280',
                  }}
                >
                  {cond}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Product Grid */}
      <section className="px-6 md:px-10 pb-20">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your filters or search</p>
          </motion.div>
        ) : (
          <>
            <p className="text-xs text-gray-600 mb-5">{products.length} listings found</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className="w-9 h-9 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: currentPage === p ? 'rgba(52,211,153,0.15)' : 'transparent',
                      border: currentPage === p ? '0.5px solid rgba(52,211,153,0.4)' : '0.5px solid rgba(255,255,255,0.08)',
                      color: currentPage === p ? '#34d399' : '#6b7280',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Gradient shift keyframe */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}