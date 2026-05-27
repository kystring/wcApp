import { TIERS } from '@/utils/constants.js'
import { delay, randomPick, randomInt } from './index.js'

// 预设AI对手
const AI_OPPONENTS = [
  { id: 'ai001', name: '语文达人', avatar: '', tier: '青铜', skill: 0.5 },
  { id: 'ai002', name: '追风少年', avatar: '', tier: '青铜', skill: 0.45 },
  { id: 'ai003', name: '笔墨书生', avatar: '', tier: '白银', skill: 0.55 },
  { id: 'ai004', name: '学海无涯', avatar: '', tier: '白银', skill: 0.6 },
  { id: 'ai005', name: '落笔惊风', avatar: '', tier: '黄金', skill: 0.65 },
  { id: 'ai006', name: '满腹经纶', avatar: '', tier: '黄金', skill: 0.7 },
  { id: 'ai007', name: '文采飞扬', avatar: '', tier: '铂金', skill: 0.72 },
  { id: 'ai008', name: '博学多才', avatar: '', tier: '铂金', skill: 0.75 },
  { id: 'ai009', name: '才华横溢', avatar: '', tier: '钻石', skill: 0.78 },
  { id: 'ai010', name: '国学大师', avatar: '', tier: '钻石', skill: 0.8 },
  { id: 'ai011', name: '文坛新星', avatar: '', tier: '王者', skill: 0.85 },
  { id: 'ai012', name: '学神降临', avatar: '', tier: '王者', skill: 0.88 },
  { id: 'ai013', name: '知识海洋', avatar: '', tier: '青铜', skill: 0.48 },
  { id: 'ai014', name: '墨香致远', avatar: '', tier: '白银', skill: 0.58 },
  { id: 'ai015', name: '知书达理', avatar: '', tier: '黄金', skill: 0.68 },
  { id: 'ai016', name: '妙笔生花', avatar: '', tier: '铂金', skill: 0.73 },
  { id: 'ai017', name: '翰林学士', avatar: '', tier: '钻石', skill: 0.79 },
  { id: 'ai018', name: '诗文雅士', avatar: '', tier: '白银', skill: 0.57 },
  { id: 'ai019', name: '勤学苦练', avatar: '', tier: '黄金', skill: 0.67 },
  { id: 'ai020', name: '意气风发', avatar: '', tier: '铂金', skill: 0.74 }
]

// 匹配对手: 同段位或相邻段位
export async function findOpponent(mode) {
  await delay(800 + Math.random() * 1200) // 模拟匹配等待

  const userTier = '青铜' // Default, will be overridden by actual user tier
  const userTierIdx = TIERS.findIndex(t => t.name === userTier)

  // 80% chance of real match, 20% chance of AI match
  // If matching takes >15s, auto AI match (simulated here)
  const useAi = Math.random() < 0.3 // simulate 30% AI match rate

  let opponent
  if (useAi) {
    // Pick AI from same or adjacent tier
    const validOpponents = AI_OPPONENTS.filter(o => {
      const oppIdx = TIERS.findIndex(t => t.name === o.tier)
      return Math.abs(oppIdx - userTierIdx) <= 1
    })
    opponent = validOpponents[Math.floor(Math.random() * validOpponents.length)]
    opponent.isAI = true
  } else {
    // Simulate real player opponent
    const players = AI_OPPONENTS.filter(o => {
      const oppIdx = TIERS.findIndex(t => t.name === o.tier)
      return Math.abs(oppIdx - userTierIdx) <= 1
    })
    opponent = { ...players[Math.floor(Math.random() * players.length)] }
    opponent.isAI = false
  }

  if (mode === '1v4') {
    // Return 4 opponents for 1v4 mode
    const opponents = [opponent]
    const remaining = AI_OPPONENTS.filter(o => o.id !== opponent.id)
    const extras = randomPick(remaining, 3)
    return [...opponents, ...extras].map(o => ({ ...o, isAI: true }))
  }

  return opponent
}

// 模拟AI答题 (根据skill概率正确回答)
export function simulateAiAnswer(question, skill) {
  const roll = Math.random()
  // Difficulty adjustment: harder questions reduce effective skill
  const adjustedSkill = skill - (question.difficulty - 1) * 0.1
  return roll < Math.max(0.2, adjustedSkill)
}

// AI回答延迟 (2-5秒)
export async function aiAnswerDelay() {
  await delay(2000 + Math.random() * 3000)
}
