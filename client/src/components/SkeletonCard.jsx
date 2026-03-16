// client/src/components/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.05)' }}>
      <div className="h-52 skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 rounded-full skeleton-shimmer" />
        <div className="h-4 w-full rounded skeleton-shimmer" />
        <div className="h-3 w-32 rounded skeleton-shimmer" />
        <div className="h-5 w-24 rounded skeleton-shimmer" />
      </div>
    </div>
  )
}