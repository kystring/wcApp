import { TIERS } from './constants.js'

// 计算得分和段位晋升
export function calculateQuizScore(answers, questions) {
  let correct = 0
  const results = []

  questions.forEach(q => {
    const answer = answers.find(a => a.questionId === q.id)
    const isCorrect = answer && answer.selectedOption === q.correctIndex
    if (isCorrect) correct++

    results.push({
      questionId: q.id,
      selected: answer?.selectedOption,
      correct: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    })
  })

  const score = Math.round((correct / questions.length) * 100)

  return {
    score,
    correct,
    total: questions.length,
    results
  }
}

// 判断是否晋升
export function checkPromotion(currentTier, score) {
  const currentIdx = TIERS.findIndex(t => t.name === currentTier)
  if (currentIdx >= TIERS.length - 1) {
    // Already at max tier
    return { promoted: false, newTier: currentTier, reason: '已达最高段位' }
  }

  const nextTier = TIERS[currentIdx + 1]
  const requiredScore = nextTier.minScore || 85

  if (score >= requiredScore) {
    return { promoted: true, newTier: nextTier.name, fromTier: currentTier }
  }

  return { promoted: false, newTier: currentTier, requiredScore, currentScore: score }
}

// 计算PK积分
export function calculatePkPoints(mode, won, rank) {
  if (mode === '1v1') {
    return won ? 10 : 2
  } else if (mode === '1v4') {
    // rank: 1-5 (1st place gets most)
    const pointsMap = { 1: 30, 2: 15, 3: 10, 4: 5, 5: 2 }
    return pointsMap[rank] || 0
  }
  return 0
}

// 每日训练次数排名 (前10%得勤学之星)
export function checkDailyStar(dailyCount, allUsersCounts) {
  const sorted = [...allUsersCounts].sort((a, b) => b - a)
  const threshold = sorted[Math.floor(sorted.length * 0.1)] || 0
  return dailyCount >= threshold
}

// 段位进度百分比
export function getTierProgress(currentTier, totalPoints) {
  const idx = TIERS.findIndex(t => t.name === currentTier)
  if (idx >= TIERS.length - 1) return 100

  const currentMin = TIERS[idx].minScore
  const nextMin = TIERS[idx + 1].minScore
  const range = nextMin - currentMin
  const progress = totalPoints - currentMin
  return Math.min(100, Math.max(0, Math.round((progress / range) * 100)))
}
