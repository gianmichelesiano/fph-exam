export function normalizeTest(raw) {
  const questions = (raw.questions || []).map((q, i) => {
    const tipo = q.tipo || q.type
    const type = tipo === 'vero_falso' ? 'truefalse' : 'multiple'

    const base = {
      id: q.id || `q${i + 1}`,
      type,
      text: q.domanda ?? q.text,
      topic: q.tema ?? q.topic,
      motivation: q.motivazione ?? q.motivation,
    }

    if (type === 'multiple') {
      let options
      const rawOpts = q.opzioni ?? q.options
      if (Array.isArray(rawOpts)) {
        options = rawOpts
      } else {
        options = ['A', 'B', 'C', 'D'].map(k => rawOpts?.[k]).filter(v => v != null)
      }

      let correct
      const rc = q.risposta_corretta ?? q.correct
      if (typeof rc === 'string' && /^[A-Da-d]$/.test(rc)) {
        correct = rc.toUpperCase().charCodeAt(0) - 65
      } else {
        correct = rc
      }

      return { ...base, options, correct }
    } else {
      const items = (q.items || []).map(item => ({
        text: item.testo ?? item.text,
        correct: item.corretto ?? item.correct,
      }))
      return { ...base, items }
    }
  })

  const area = raw.area ?? questions[0]?.ruolo ?? 4

  return {
    id: raw.id,
    title: raw.title ?? raw.titolo,
    area,
    areaName: raw.areaName,
    timer: raw.timer,
    questions,
  }
}
