export default function StatusBadge({ result, total }) {
  if (!result) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
        Non iniziato
      </span>
    )
  }
  if (result.status === 'in_progress') {
    const done = Object.keys(result.answers || {}).length
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block animate-pulse"></span>
        In corso {done}/{total}
      </span>
    )
  }
  const pct = Math.round((result.score / result.total) * 100)
  const passed = pct >= 67
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${passed ? 'bg-green-500' : 'bg-red-500'}`}></span>
      {pct}% – {result.score}/{result.total}
    </span>
  )
}
