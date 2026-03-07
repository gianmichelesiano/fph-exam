import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { allTests, testMap } from '../data/loadTests'
import { AREAS } from '../data/areas'

export default function Stats() {
  const navigate = useNavigate()
  const { progress } = useProgress()

  const completed = allTests.filter(t => progress[t.id]?.status === 'completed')

  // Global stats
  const totalDone = completed.length
  const totalTests = allTests.length
  const totalQuestions = completed.reduce((sum, t) => sum + (progress[t.id]?.total || 0), 0)
  const totalCorrect = completed.reduce((sum, t) => sum + (progress[t.id]?.score || 0), 0)
  const globalPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : null

  // Per-area stats
  const areaStats = {}
  completed.forEach(test => {
    const result = progress[test.id]
    const area = test.area
    if (!areaStats[area]) areaStats[area] = { correct: 0, total: 0, tests: 0 }
    areaStats[area].correct += result.score || 0
    areaStats[area].total += result.total || 0
    areaStats[area].tests++
  })

  // Per-topic wrong answers
  const topicErrors = {}
  completed.forEach(test => {
    const result = progress[test.id]
    const questions = testMap[test.id]?.questions || []
    questions.forEach((q, i) => {
      const ans = result.answers?.[i]
      let correct = false
      if (q.type === 'multiple') correct = ans === q.correct
      else if (q.type === 'truefalse') correct = q.items.every((item, j) => (ans || {})[j] === item.correct)

      if (!correct && q.topic) {
        if (!topicErrors[q.topic]) topicErrors[q.topic] = { wrong: 0, total: 0 }
        topicErrors[q.topic].wrong++
      }
      if (q.topic) {
        if (!topicErrors[q.topic]) topicErrors[q.topic] = { wrong: 0, total: 0 }
        topicErrors[q.topic].total++
      }
    })
  })

  const weakTopics = Object.entries(topicErrors)
    .filter(([, v]) => v.total > 0)
    .map(([topic, v]) => ({ topic, pct: Math.round((v.wrong / v.total) * 100), ...v }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Statistiche</h1>
            <p className="text-xs text-gray-500">Riepilogo progressi</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {totalDone === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg">Nessun test completato</p>
            <p className="text-gray-400 text-sm mt-1">Completa almeno un test per vedere le statistiche</p>
            <button className="btn-primary mt-5" onClick={() => navigate('/')}>Vai ai test</button>
          </div>
        ) : (
          <>
            {/* Global score card */}
            <div className={`card text-center border-2 ${globalPct >= 67 ? 'border-green-200 bg-green-50' : globalPct >= 50 ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
              <div className={`text-5xl font-black ${globalPct >= 67 ? 'text-green-600' : globalPct >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                {globalPct}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Media generale</p>
              <p className="text-xs text-gray-400 mt-0.5">{totalCorrect} corrette su {totalQuestions} totali</p>

              <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${globalPct >= 67 ? 'bg-green-500' : globalPct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${globalPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span className="text-gray-600 font-semibold">67% soglia</span>
                <span>100%</span>
              </div>
            </div>

            {/* Quick numbers */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-600">{totalDone}</div>
                <div className="text-xs text-gray-500 mt-0.5">Test completati</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-gray-700">{totalTests - totalDone}</div>
                <div className="text-xs text-gray-500 mt-0.5">Da fare</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-gray-700">{totalQuestions}</div>
                <div className="text-xs text-gray-500 mt-0.5">Domande fatte</div>
              </div>
            </div>

            {/* Per-area stats */}
            {Object.keys(areaStats).length > 0 && (
              <div>
                <h2 className="font-bold text-gray-900 mb-3">Per area tematica</h2>
                <div className="space-y-2">
                  {Object.entries(areaStats)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([area, stat]) => {
                      const pct = Math.round((stat.correct / stat.total) * 100)
                      const areaInfo = AREAS[area]
                      return (
                        <div key={area} className="card py-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-xs font-bold text-gray-400 mr-2">R{area}</span>
                              <span className="text-sm font-semibold text-gray-800">{areaInfo?.name || `Area ${area}`}</span>
                            </div>
                            <span className={`text-sm font-bold ${pct >= 67 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                              {pct}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 67 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{stat.correct}/{stat.total} corrette · {stat.tests} test</p>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Weak topics */}
            {weakTopics.length > 0 && (
              <div>
                <h2 className="font-bold text-gray-900 mb-1">Argomenti da ripassare</h2>
                <p className="text-xs text-gray-400 mb-3">Ordinati per % errori</p>
                <div className="space-y-2">
                  {weakTopics.map(({ topic, wrong, total, pct }) => (
                    <div key={topic} className="card py-3 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${pct >= 60 ? 'bg-red-100 text-red-600' : pct >= 30 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {pct}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{topic}</p>
                        <p className="text-xs text-gray-400">{wrong} errate su {total}</p>
                      </div>
                      {pct >= 50 && (
                        <span className="text-xs text-red-500 font-semibold flex-shrink-0">Da ripassare</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
