// client/src/pages/SellerDashboardPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchMyListings, createProduct, deleteProduct } from '../features/productSlice.js'
import Navbar from '../components/NavBar.jsx'
import toast from 'react-hot-toast'
import { FiPlus, FiTrash2, FiPackage, FiEye, FiX } from 'react-icons/fi'

const conditionConfig = {
  'new': { label: 'New', color: 'text-emerald-400 bg-emerald-400/10' },
  'like-new': { label: 'Like New', color: 'text-blue-400 bg-blue-400/10' },
  'good': { label: 'Good', color: 'text-yellow-400 bg-yellow-400/10' },
  'fair': { label: 'Fair', color: 'text-orange-400 bg-orange-400/10' },
}

const INITIAL_FORM = {
  name: '', description: '', price: '',
  category: 'sneakers', condition: 'good',
  brand: '', size: '', tags: '',
  hasCertification: false,
}

export default function SellerDashboardPage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { myListings, loading } = useSelector((state) => state.products)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])

  useEffect(() => { dispatch(fetchMyListings()) }, [dispatch])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (images.length === 0) return toast.error('Please upload at least one image')

    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    images.forEach((img) => formData.append('images', img))

    const result = await dispatch(createProduct(formData))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Listing created!')
      setForm(INITIAL_FORM)
      setImages([])
      setPreviews([])
      setShowForm(false)
    } else {
      toast.error(result.payload || 'Failed to create listing')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return
    const result = await dispatch(deleteProduct(id))
    if (result.meta.requestStatus === 'fulfilled') toast.success('Listing deleted')
    else toast.error('Failed to delete')
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
  const inputStyle = { background: '#1e293b', border: '0.5px solid rgba(255,255,255,0.08)' }

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <Navbar />
      <div className="pt-24 px-6 md:px-10 pb-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
            <p className="text-gray-500 mt-1">
              {user?.shopName && <span className="text-emerald-400">{user.shopName} · </span>}
              {myListings.length} active listings
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
          >
            <FiPlus size={16} /> New listing
          </button>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total listings', value: myListings.length, icon: <FiPackage /> },
            { label: 'Total views', value: myListings.reduce((a, p) => a + (p.views || 0), 0), icon: <FiEye /> },
            { label: 'Items sold', value: myListings.filter(p => p.isSold).length, icon: '✓' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5"
              style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-gray-500 text-sm mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Listings Grid */}
        {myListings.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Create your first listing to start selling</p>
            <button onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
              Create listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myListings.map((product, index) => {
              const cond = conditionConfig[product.condition] || conditionConfig['good']
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="h-44 relative" style={{ background: 'linear-gradient(135deg,#1e293b,#2d3748)' }}>
                    {product.images?.[0] && (
                      <img src={product.images[0].url} alt={product.name}
                        className="w-full h-full object-cover" />
                    )}
                    {product.certification?.hasCertification && (
                      <div className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(5,150,105,0.85)', color: 'white' }}>
                        ✓ Cert
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cond.color}`}>{cond.label}</span>
                    <h3 className="text-sm font-semibold text-gray-100 mt-2 truncate">{product.name}</h3>
                    <p className="text-emerald-400 font-bold mt-1">₹{product.price.toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-600">{product.views} views</span>
                      <button onClick={() => handleDelete(product._id)}
                        className="text-gray-600 hover:text-red-400 transition-colors">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create Listing Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
              style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">New listing</h2>
                <button onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-white transition-colors">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Images */}
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Product images (max 5)</label>
                  <label className="flex flex-col items-center justify-center h-32 rounded-xl cursor-pointer transition-all"
                    style={{ border: '1px dashed rgba(255,255,255,0.12)', background: '#1e293b' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(52,211,153,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                  >
                    <span className="text-2xl mb-2">📸</span>
                    <span className="text-sm text-gray-500">Click to upload images</span>
                    <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
                  </label>
                  {previews.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {previews.map((p, i) => (
                        <img key={i} src={p} alt="" className="w-16 h-16 object-cover rounded-lg" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Name + Brand */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Product name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      placeholder="Nike Air Jordan 1" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Brand</label>
                    <input name="brand" value={form.brand} onChange={handleChange}
                      placeholder="Nike" className={inputClass} style={inputStyle} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required
                    rows={3} placeholder="Describe your item..."
                    className={inputClass} style={{ ...inputStyle, resize: 'none' }} />
                </div>

                {/* Price + Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Price (₹) *</label>
                    <input name="price" type="number" value={form.price} onChange={handleChange} required
                      placeholder="4200" className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Size</label>
                    <input name="size" value={form.size} onChange={handleChange}
                      placeholder="US 10 / M / 32" className={inputClass} style={inputStyle} />
                  </div>
                </div>

                {/* Category + Condition */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Category *</label>
                    <select name="category" value={form.category} onChange={handleChange}
                      className={inputClass} style={inputStyle}>
                      {['sneakers','bags','watches','clothing','accessories','other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Condition *</label>
                    <select name="condition" value={form.condition} onChange={handleChange}
                      className={inputClass} style={inputStyle}>
                      {['new','like-new','good','fair'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Tags (comma separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange}
                    placeholder="vintage, streetwear, limited edition"
                    className={inputClass} style={inputStyle} />
                </div>

                {/* Certification */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="hasCertification" checked={form.hasCertification}
                    onChange={handleChange} className="w-4 h-4 accent-emerald-500" />
                  <span className="text-sm text-gray-400">
                    This item has an <span className="text-emerald-400">originality certificate</span>
                  </span>
                </label>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
                  {loading ? 'Creating listing...' : 'Create listing'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}