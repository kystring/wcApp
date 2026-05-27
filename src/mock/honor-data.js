import { TIERS } from '@/utils/constants.js'

const NAMES = [
  '张伟', '李娜', '王芳', '陈静', '刘洋', '杨敏', '赵丽', '黄强', '周杰', '吴鑫',
  '徐慧', '孙超', '马林', '朱婷', '胡波', '郭宇', '何霖', '高峰', '林涛', '郑雪',
  '梁辉', '谢蕾', '宋波', '唐艳', '韩冰', '冯凯', '董洁', '袁亮', '邓颖', '曹阳',
  '彭飞', '蒋悦', '沈威', '余欢', '潘峰', '杜鹏', '戴晨', '夏雨', '田博', '任娟',
  '姜龙', '范云', '方浩', '石磊', '姚兰', '谭军', '廖菲', '邹俊', '熊星', '金梅'
]

function randomTier() {
  return TIERS[Math.floor(Math.random() * TIERS.length)].name
}

export function getHonorBoard(type) {
  const board = NAMES.map((name, idx) => ({
    userId: 'u' + (100 + idx),
    name,
    tier: randomTier(),
    avatar: '',
    practiceCount: Math.floor(Math.random() * 50) + 5,
    weeklyProgress: Math.floor(Math.random() * 100),
    score: Math.floor(Math.random() * 2000) + 100
  }))

  if (type === 'daily') {
    board.sort((a, b) => b.practiceCount - a.practiceCount)
  } else {
    board.sort((a, b) => b.weeklyProgress - a.weeklyProgress)
  }

  // Add current user at a random position
  board.splice(Math.floor(Math.random() * 15) + 5, 0, {
    userId: 'u001',
    name: '语文小将',
    tier: '青铜',
    avatar: '',
    practiceCount: 8,
    weeklyProgress: 45,
    score: 320,
    isMe: true
  })

  return board
}
