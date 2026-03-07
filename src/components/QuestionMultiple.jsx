export default function QuestionMultiple({ question, answer, onChange, showResult }) {
  return (
    <div className="space-y-3">
      {question.options.map((opt, i) => {
        const isSelected = answer === i
        const isCorrect = question.correct === i
        let style = 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'

        if (showResult) {
          if (isCorrect) style = 'border-green-400 bg-green-50'
          else if (isSelected && !isCorrect) style = 'border-red-400 bg-red-50'
          else style = 'border-gray-200 bg-white opacity-60'
        } else if (isSelected) {
          style = 'border-blue-500 bg-blue-50'
        }

        return (
          <button
            key={i}
            disabled={showResult}
            onClick={() => onChange(i)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${style} flex items-start gap-3`}
          >
            <span className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold ${
              showResult && isCorrect ? 'border-green-500 bg-green-500 text-white' :
              showResult && isSelected ? 'border-red-500 bg-red-500 text-white' :
              isSelected ? 'border-blue-500 bg-blue-500 text-white' :
              'border-gray-300 text-gray-500'
            }`}>
              {String.fromCharCode(65 + i)}
            </span>
            <span className="text-sm leading-relaxed">{opt.replace(/^[A-D]\.\s*/, '')}</span>
          </button>
        )
      })}
    </div>
  )
}
