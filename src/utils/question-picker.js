import { EXAM_TAGS } from './exam-points.js'
import { shuffle, randomPick } from '@/mock/index.js'
import { questionBank } from '@/mock/questions.js'

// 3+2 渐进式组卷 + 错题优先 + 标签轮换
export function pickQuestionsForTier({ tier, mode, isOnboarding, onboardingStage, wrongBanks, isRetry, questionCount = 10 }) {
  let pool = [...questionBank]

  // 1. Filter by tier difficulty range
  const tierDifficultyMap = {
    '青铜': [1, 2],
    '白银': [1, 2, 3],
    '黄金': [2, 3, 4],
    '铂金': [3, 4, 5],
    '钻石': [3, 4, 5],
    '王者': [4, 5]
  }
  const allowedDifficulties = tierDifficultyMap[tier] || [1, 2]
  pool = pool.filter(q => allowedDifficulties.includes(q.difficulty))

  // 2. "3+2" 渐进式 onboarding
  if (isOnboarding && mode !== 'promotion') {
    const stageConfig = {
      1: { easyPercent: 1.0, minScore: 95 },    // 纯基础题
      2: { easyPercent: 0.8, minScore: 90 },    // 80%基础+20%陷阱
      3: { easyPercent: 0.6, minScore: 85 }     // 60%基础+40%常规
    }
    const config = stageConfig[onboardingStage] || stageConfig[1]

    const easyPool = pool.filter(q => q.difficulty === 1)
    const trapPool = pool.filter(q => q.difficulty === 2)

    const easyCount = Math.floor(questionCount * config.easyPercent)
    const trapCount = questionCount - easyCount

    const selected = [
      ...randomPick(easyPool, Math.min(easyCount, easyPool.length)),
      ...randomPick(trapPool, Math.min(trapCount, trapPool.length))
    ]
    return shuffle(selected).slice(0, questionCount)
  }

  // 3. 错题优先 (retry mode: 50% from wrong bank, 50% new)
  if (isRetry) {
    const wrongIds = []
    Object.values(wrongBanks || {}).forEach(ids => {
      wrongIds.push(...ids)
    })

    const wrongPool = pool.filter(q => wrongIds.includes(q.id))
    const newPool = pool.filter(q => !wrongIds.includes(q.id))

    const wrongCount = Math.floor(questionCount * 0.5)
    const newCount = questionCount - wrongCount

    const selected = [
      ...randomPick(wrongPool, Math.min(wrongCount, wrongPool.length)),
      ...randomPick(newPool, Math.min(newCount, newPool.length))
    ]
    // If not enough wrong questions, fill with new ones
    if (selected.length < questionCount) {
      const remaining = randomPick(newPool, questionCount - selected.length)
      selected.push(...remaining)
    }
    return shuffle(selected).slice(0, questionCount)
  }

  // 4. 标签轮换: ensure each exam point's tags are rotated
  const byExamPoint = {}
  pool.forEach(q => {
    if (!byExamPoint[q.examPoint]) byExamPoint[q.examPoint] = []
    byExamPoint[q.examPoint].push(q)
  })

  const examPointIds = Object.keys(byExamPoint)
  const perPoint = Math.ceil(questionCount / examPointIds.length)

  const selected = []
  const usedTags = {}

  examPointIds.forEach(epId => {
    const epQuestions = byExamPoint[epId] || []
    // Group by tag and rotate
    const tagQuestions = {}
    epQuestions.forEach(q => {
      (q.tags || []).forEach(tag => {
        if (!tagQuestions[tag]) tagQuestions[tag] = []
        tagQuestions[tag].push(q)
      })
    })

    const tags = Object.keys(tagQuestions)
    const pickedFromEp = []

    // Try to pick one from each tag before repeating
    const shuffledTags = shuffle(tags)
    for (const tag of shuffledTags) {
      if (pickedFromEp.length >= perPoint) break
      const tagPool = tagQuestions[tag].filter(q => !selected.find(s => s.id === q.id))
      if (tagPool.length > 0) {
        pickedFromEp.push(tagPool[Math.floor(Math.random() * tagPool.length)])
      }
    }

    // Fill remaining
    if (pickedFromEp.length < perPoint) {
      const remaining = epQuestions.filter(q =>
        !pickedFromEp.find(p => p.id === q.id) &&
        !selected.find(s => s.id === q.id)
      )
      pickedFromEp.push(...randomPick(remaining, perPoint - pickedFromEp.length))
    }

    selected.push(...pickedFromEp)
  })

  // Fill to questionCount if short
  if (selected.length < questionCount) {
    const remaining = pool.filter(q => !selected.find(s => s.id === q.id))
    selected.push(...randomPick(remaining, questionCount - selected.length))
  }

  return shuffle(selected).slice(0, questionCount)
}
