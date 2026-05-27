import { delay } from './index.js'

export const MOCK_STUDENTS = [
  {
    id: 'u001',
    studentId: '2024001',
    password: '123456',
    nickname: '语文小将',
    avatar: '',
    currentTier: '青铜',
    totalPoints: 0,
    consecutiveLoginDays: 3,
    protectionCards: 1,
    skipCards: 0
  },
  {
    id: 'u002',
    studentId: '2024002',
    password: '123456',
    nickname: '诗词达人',
    avatar: '',
    currentTier: '白银',
    totalPoints: 120,
    consecutiveLoginDays: 7,
    protectionCards: 2,
    skipCards: 1
  },
  {
    id: 'u003',
    studentId: '2024003',
    password: '123456',
    nickname: '文学少年',
    avatar: '',
    currentTier: '黄金',
    totalPoints: 250,
    consecutiveLoginDays: 12,
    protectionCards: 3,
    skipCards: 2
  }
]

let nextUserId = 4

export async function validateLogin(studentId, password) {
  await delay(400)
  const student = MOCK_STUDENTS.find(s => s.studentId === studentId && s.password === password)
  if (!student) return null
  const { password: _, ...userInfo } = student
  return userInfo
}

export async function registerStudent(studentId, password, nickname) {
  await delay(500)
  const existing = MOCK_STUDENTS.find(s => s.studentId === studentId)
  if (existing) {
    return { success: false, message: '该学号已被注册' }
  }
  const newStudent = {
    id: `u${String(nextUserId++).padStart(3, '0')}`,
    studentId,
    password,
    nickname,
    avatar: '',
    currentTier: '青铜',
    totalPoints: 0,
    consecutiveLoginDays: 1,
    protectionCards: 1,
    skipCards: 0
  }
  MOCK_STUDENTS.push(newStudent)
  const { password: _, ...userInfo } = newStudent
  return { success: true, student: userInfo }
}
