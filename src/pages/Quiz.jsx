import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import AreaBadge from '../components/AreaBadge'
import Timer from '../components/Timer'
import QuestionMultiple from '../components/QuestionMultiple'
import QuestionTrueFalse from '../components/QuestionTrueFalse'
import { testMap } from '../data/loadTests'

function isAnswerComplete(question, answer) {
  if (answer === undefined || answer === null) return false
  if (question.type === 'multiple') return answer !== undefined
  if (question.type === 'truefalse') {
    return question.items.every((_, i) => (answer || {})[i] !== undefined)
  }
  return false
}

export default function Quiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { progress, saveResult, savePartial } = useProgress()

  const test = testMap[id]
  const saved = progress[id]

  const [current, setCurrent] = useState(saved?.currentIndex || 0)
  const [answers, setAnswers] = useState(saved?.answers || {})
  const [submitted, setSubmitted] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)

  useEffect(() => {
    if (!submitted) {
      savePartial(id, answers, current)
    }
  }, [answers, current])

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Test non trovato</p>
          <button className="btn-primary mt-4" onClick={() => navigate('/')}>Torna alla home</button>
        </div>
      </div>
    )
  }

  const q = test.questions[current]
  const answer = answers[current]
  const canAnswer = !submitted && !timerExpired
  const totalQ = test.questions.length
  const answered = Object.keys(answers).length

  function handleAnswer(val) {
    if (!canAnswer) return
    setAnswers(prev => ({ ...prev, [current]: val }))
  }

  function calcScore(questions, answers) {
    let score = 0
    questions.forEach((q, i) => {
      const ans = answers[i]
      if (q.type === 'multiple') {
        if (ans === q.correct) score++
      } else if (q.type === 'truefalse') {
        const correct = q.items.filter((item, j) => (ans || {})[j] === item.correct).length
        if (correct === q.items.length) score += 1
        else if (correct === q.items.length - 1) score += 0.5
      }
    })
    return score
  }

  function handleSubmit() {
    const score = calcScore(test.questions, answers)
    saveResult(id, { status: 'completed', score, total: totalQ, answers })
    navigate(`/results/${id}`)
  }

  function handleTimerExpire() {
    setTimerExpired(true)
    const score = calcScore(test.questions, answers)
    saveResult(id, { status: 'completed', score, total: totalQ, answers })
    setTimeout(() => navigate(`/results/${id}`), 2000)
  }

  const pct = ((current + 1) / totalQ) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{test.title}</p>
            <p className="text-sm font-semibold text-gray-900">{current + 1} / {totalQ}</p>
          </div>
          {test.timer && !submitted && (
            <Timer minutes={test.timer} onExpire={handleTimerExpire} />
          )}
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Timer expired banner */}
      {timerExpired && (
        <div className="bg-red-500 text-white text-center py-2 text-sm font-semibold">
          Tempo scaduto! Salvataggio in corso...
        </div>
      )}

      {/* Question */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="mb-1">
          <AreaBadge area={test.area} />
          {q.topic && <span className="ml-2 text-xs text-gray-400">{q.topic}</span>}
        </div>

        <p className="text-base font-semibold text-gray-900 mt-3 mb-5 leading-relaxed">{q.text}</p>

        {q.type === 'multiple' && (
          <QuestionMultiple
            question={q}
            answer={answer}
            onChange={handleAnswer}
            showResult={false}
          />
        )}
        {q.type === 'truefalse' && (
          <QuestionTrueFalse
            question={q}
            answer={answer}
            onChange={handleAnswer}
            showResult={false}
          />
        )}
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t border-gray-100 sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-3 flex gap-3">
          <button
            className="btn-secondary flex-1"
            disabled={current === 0}
            onClick={() => setCurrent(c => c - 1)}
          >
            Indietro
          </button>

          {current < totalQ - 1 ? (
            <button
              className="btn-primary flex-1"
              onClick={() => setCurrent(c => c + 1)}
            >
              Avanti
            </button>
          ) : (
            <button
              className="btn-primary flex-1"
              onClick={handleSubmit}
              disabled={timerExpired}
            >
              Consegna ({answered}/{totalQ})
            </button>
          )}
        </div>

        {/* Dot navigator */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {test.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                  i === current ? 'bg-blue-600 text-white scale-110' :
                  answers[i] !== undefined ? 'bg-blue-200 text-blue-700' :
                  'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
