import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import AreaBadge from '../components/AreaBadge'
import QuestionMultiple from '../components/QuestionMultiple'
import QuestionTrueFalse from '../components/QuestionTrueFalse'
import { testMap } from '../data/loadTests'

export default function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { progress, clearResult } = useProgress()

  const test = testMap[id]
  const result = progress[id]

  if (!test || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Risultati non trovati</p>
          <button className="btn-primary mt-4" onClick={() => navigate('/')}>Home</button>
        </div>
      </div>
    )
  }

  const { score, total, answers } = result
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 67

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-xs text-gray-500">{test.title}</p>
            <p className="text-sm font-semibold">Risultati</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Score card */}
        <div className={`card text-center border-2 ${passed ? 'border-green-300 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <div className={`text-6xl font-black ${passed ? 'text-green-600' : 'text-red-500'}`}>{pct}%</div>
          <div className="text-lg font-semibold text-gray-800 mt-1">{score} / {total} corrette</div>
          <div className={`mt-2 text-sm font-semibold ${passed ? 'text-green-700' : 'text-red-600'}`}>
            {passed ? 'Superato!' : `Non superato (soglia 67%)`}
          </div>
          {result.completedAt && (
            <p className="text-xs text-gray-400 mt-2">
              {new Date(result.completedAt).toLocaleString('it-IT')}
            </p>
          )}
          <div className="flex gap-3 mt-4">
            <button
              className="btn-secondary flex-1 text-sm py-2"
              onClick={() => { clearResult(id); navigate(`/quiz/${id}`) }}
            >
              Ripeti il test
            </button>
            <button className="btn-primary flex-1 text-sm py-2" onClick={() => navigate('/')}>
              Home
            </button>
          </div>
        </div>

        {/* Per-question review */}
        <h2 className="font-bold text-gray-900 text-base mt-6">Revisione domande</h2>

        {test.questions.map((q, i) => {
          const ans = answers[i]
          let isCorrect = false
          if (q.type === 'multiple') isCorrect = ans === q.correct
          else if (q.type === 'truefalse') isCorrect = q.items.every((item, j) => (ans || {})[j] === item.correct)

          return (
            <div key={q.id} className={`card border-l-4 ${isCorrect ? 'border-l-green-400' : 'border-l-red-400'}`}>
              <div className="flex items-start gap-2 mb-2">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1 mb-1">
                    <AreaBadge area={test.area} />
                    {q.topic && <span className="text-xs text-gray-400">{q.topic}</span>}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{q.text}</p>
                </div>
              </div>

              <div className="mt-3">
                {q.type === 'multiple' && (
                  <QuestionMultiple question={q} answer={ans} onChange={() => {}} showResult={true} />
                )}
                {q.type === 'truefalse' && (
                  <QuestionTrueFalse question={q} answer={ans} onChange={() => {}} showResult={true} />
                )}
              </div>

              {q.motivation && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Motivazione</p>
                  <p className="text-xs text-blue-900 leading-relaxed">{q.motivation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
