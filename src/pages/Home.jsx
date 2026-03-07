import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import AreaBadge from '../components/AreaBadge'
import StatusBadge from '../components/StatusBadge'
import { allTests } from '../data/loadTests'

const AREA_COLORS = {
  1: 'border-l-purple-400',
  2: 'border-l-green-400',
  3: 'border-l-teal-400',
  4: 'border-l-blue-400',
  5: 'border-l-indigo-400',
  6: 'border-l-orange-400',
  7: 'border-l-yellow-400',
  8: 'border-l-red-400',
  9: 'border-l-pink-400',
}

export default function Home() {
  const navigate = useNavigate()
  const { progress, clearResult } = useProgress()

  const totalTests = allTests.length
  const completed = allTests.filter(t => progress[t.id]?.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">FPH Farmacia</h1>
            <p className="text-xs text-gray-500">Esame Specialista – Farmacia Officinale</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completed}/{totalTests}</div>
              <div className="text-xs text-gray-500">completati</div>
            </div>
            <button
              onClick={() => navigate('/stats')}
              className="p-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              title="Statistiche"
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Global progress bar */}
        {totalTests > 0 && (
          <div className="max-w-2xl mx-auto px-4 pb-3">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(completed / totalTests) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Test list */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {allTests.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg">Nessun test disponibile</p>
            <p className="text-gray-400 text-sm mt-1">Aggiungi file JSON in <code className="bg-gray-100 px-1 rounded">src/data/tests/</code></p>
          </div>
        ) : (
          allTests
            .sort((a, b) => a.area - b.area || a.title.localeCompare(b.title))
            .map(test => {
              const result = progress[test.id]
              return (
                <div
                  key={test.id}
                  className={`card border-l-4 ${AREA_COLORS[test.area] || 'border-l-gray-300'} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => navigate(`/quiz/${test.id}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-gray-900 text-base leading-tight">{test.title}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <AreaBadge area={test.area} />
                        <span className="text-xs text-gray-400">{test.questions.length} domande</span>
                        {test.timer && <span className="text-xs text-gray-400">{test.timer} min</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <StatusBadge result={result} total={test.questions.length} />
                      {result && (
                        <button
                          onClick={e => { e.stopPropagation(); clearResult(test.id) }}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          Ripeti
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
        )}
      </div>

      {/* Footer info */}
      <div className="max-w-2xl mx-auto px-4 pb-8 text-center">
        <p className="text-xs text-gray-400">Soglia superamento esame: 67/100 (≈ 67%)</p>
      </div>
    </div>
  )
}
