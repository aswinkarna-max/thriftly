// client/src/components/ErrorBoundary.jsx
import { Component } from 'react'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[Thriftly Error]', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: '#030712' }}
      >
        <div className="text-center max-w-md">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.25)' }}
          >
            <FiAlertTriangle size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            An unexpected error occurred. Try refreshing the page — if it keeps happening, contact support.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre
              className="text-left text-xs text-red-400 rounded-xl p-4 mb-6 overflow-auto max-h-40"
              style={{ background: 'rgba(239,68,68,0.06)', border: '0.5px solid rgba(239,68,68,0.15)' }}
            >
              {this.state.error.toString()}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(5,150,105,0.35)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <FiRefreshCw size={15} /> Refresh page
          </button>
        </div>
      </div>
    )
  }
}