import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TIERS } from '@/utils/constants.js'
import { mockRequest } from '@/mock/index.js'
import { validateLogin, registerStudent } from '@/mock/students.js'

const STORAGE_KEY_TOKEN = 'auth_token'
const STORAGE_KEY_USER = 'user_info'

function getDefaultState() {
  return {
    id: '',
    studentId: '',
    nickname: '',
    avatar: '',
    currentTier: '青铜',
    totalPoints: 0,
    consecutiveLoginDays: 0,
    protectionCards: 0,
    skipCards: 0
  }
}

export const useUserStore = defineStore('user', () => {
  // State
  const id = ref('')
  const studentId = ref('')
  const nickname = ref('')
  const avatar = ref('')
  const currentTier = ref('青铜')
  const totalPoints = ref(0)
  const consecutiveLoginDays = ref(0)
  const protectionCards = ref(0)
  const skipCards = ref(0)
  const isLoggedIn = ref(false)
  const token = ref('')

  // Getters
  const tierIndex = computed(() => {
    const idx = TIERS.findIndex(t => t.name === currentTier.value)
    return idx >= 0 ? idx : 0
  })

  const currentTierInfo = computed(() => {
    return TIERS.find(t => t.name === currentTier.value) || TIERS[0]
  })

  const nextTier = computed(() => {
    const idx = tierIndex.value
    return idx < TIERS.length - 1 ? TIERS[idx + 1].name : null
  })

  // Actions
  async function fetchUserProfile() {
    await mockRequest()
  }

  function addPoints(pts) {
    totalPoints.value += pts
    _persistSession()
  }

  function updateTier(newTier) {
    currentTier.value = newTier
    _persistSession()
  }

  function useProtectionCard() {
    if (protectionCards.value > 0) {
      protectionCards.value--
      _persistSession()
      return true
    }
    return false
  }

  function addSkipCard() {
    skipCards.value++
    _persistSession()
  }

  function useSkipCard() {
    if (skipCards.value > 0) {
      skipCards.value--
      _persistSession()
      return true
    }
    return false
  }

  function incrementLoginDay() {
    consecutiveLoginDays.value++
    _persistSession()
  }

  // --- Auth actions ---

  async function login(sid, pwd) {
    const user = await validateLogin(sid, pwd)
    if (!user) {
      return { success: false, message: '学号或密码错误' }
    }
    _applyUserData(user)
    token.value = 'token_' + Date.now()
    isLoggedIn.value = true
    _persistSession()
    return { success: true }
  }

  async function register(sid, pwd, nick) {
    const result = await registerStudent(sid, pwd, nick)
    return result
  }

  function logout() {
    const defaults = getDefaultState()
    id.value = defaults.id
    studentId.value = defaults.studentId
    nickname.value = defaults.nickname
    avatar.value = defaults.avatar
    currentTier.value = defaults.currentTier
    totalPoints.value = defaults.totalPoints
    consecutiveLoginDays.value = defaults.consecutiveLoginDays
    protectionCards.value = defaults.protectionCards
    skipCards.value = defaults.skipCards
    isLoggedIn.value = false
    token.value = ''
    try {
      uni.removeStorageSync(STORAGE_KEY_TOKEN)
      uni.removeStorageSync(STORAGE_KEY_USER)
    } catch (e) { /* ignore */ }
  }

  function _restoreSession() {
    try {
      const savedToken = uni.getStorageSync(STORAGE_KEY_TOKEN)
      const savedUser = uni.getStorageSync(STORAGE_KEY_USER)
      if (savedToken && savedUser) {
        _applyUserData(savedUser)
        token.value = savedToken
        isLoggedIn.value = true
        return true
      }
    } catch (e) { /* ignore */ }
    return false
  }

  function _persistSession() {
    try {
      uni.setStorageSync(STORAGE_KEY_TOKEN, token.value)
      uni.setStorageSync(STORAGE_KEY_USER, {
        id: id.value,
        studentId: studentId.value,
        nickname: nickname.value,
        avatar: avatar.value,
        currentTier: currentTier.value,
        totalPoints: totalPoints.value,
        consecutiveLoginDays: consecutiveLoginDays.value,
        protectionCards: protectionCards.value,
        skipCards: skipCards.value
      })
    } catch (e) { /* ignore */ }
  }

  function _applyUserData(user) {
    id.value = user.id
    studentId.value = user.studentId
    nickname.value = user.nickname
    avatar.value = user.avatar || ''
    currentTier.value = user.currentTier
    totalPoints.value = user.totalPoints
    consecutiveLoginDays.value = user.consecutiveLoginDays
    protectionCards.value = user.protectionCards
    skipCards.value = user.skipCards
  }

  return {
    id, studentId, nickname, avatar, currentTier, totalPoints, consecutiveLoginDays,
    protectionCards, skipCards, isLoggedIn, token,
    tierIndex, currentTierInfo, nextTier,
    fetchUserProfile, addPoints, updateTier, useProtectionCard,
    addSkipCard, useSkipCard, incrementLoginDay,
    login, register, logout, _restoreSession
  }
})
