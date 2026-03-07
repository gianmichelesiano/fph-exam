export default function QuestionTrueFalse({ question, answer, onChange, showResult }) {
  const answers = answer || {}

  function toggle(i, val) {
    if (showResult) return
    onChange({ ...answers, [i]: val })
  }

  return (
    <div className="space-y-3">
      {question.items.map((item, i) => {
        const selected = answers[i]
        const isCorrect = item.correct

        return (
          <div key={i} className={`p-4 rounded-xl border-2 transition-all ${
            showResult
              ? isCorrect ? 'border-green-300 bg-green-50' : 'border-red-200 bg-red-50'
              : 'border-gray-200 bg-white'
          }`}>
            <p className="text-sm text-gray-800 mb-3 leading-relaxed">{item.text}</p>
            <div className="flex gap-2">
              {[true, false].map(val => {
                const isSelected = selected === val
                const isThisCorrect = showResult && val === isCorrect
                const isThisWrong = showResult && isSelected && val !== isCorrect

                return (
                  <button
                    key={String(val)}
                    disabled={showResult}
                    onClick={() => toggle(i, val)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all active:scale-95 ${
                      isThisCorrect ? 'border-green-500 bg-green-500 text-white' :
                      isThisWrong ? 'border-red-500 bg-red-100 text-red-700' :
                      isSelected ? 'border-blue-500 bg-blue-500 text-white' :
                      'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    {val ? 'Vero' : 'Falso'}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
