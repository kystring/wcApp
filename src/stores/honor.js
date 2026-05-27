import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockRequest } from '@/mock/index.js'
import { useUserStore } from './user.js'

export const useHonorStore = defineStore('honor', () => {
  // --- Boards ---
  const dailyBoard = ref([])
  const weeklyBoard = ref([])

  // --- User Honor Status ---
  const userRank = ref({ daily: null, weekly: null })
  const isDailyStar = ref(false)
  const isWeeklyStar = ref(false)
  const lastProtectionClaim = ref('')

  // --- Loading ---
  const isLoading = ref(false)

  // --- Getters ---
  const canClaimProtectionCard = computed(() => {
    if (!lastProtectionClaim.value) return true
    const last = new Date(lastProtectionClaim.value)
    const now = new Date()
    const diffDays = (now - last) / (1000 * 60 * 60 * 24)
    return diffDays >= 7
  })

  // --- Actions ---
  async function fetchDailyBoard() {
    isLoading.value = true
    await mockRequest()
    const { getHonorBoard } = await import('@/mock/honor-data.js')
    dailyBoard.value = getHonorBoard('daily')

    const userStore = useUserStore()
    const userIdx = dailyBoard.value.findIndex(e => e.userId === userStore.id)
    userRank.value.daily = userIdx >= 0 ? userIdx + 1 : null
    isDailyStar.value = userIdx >= 0 && userIdx < dailyBoard.value.length * 0.1

    isLoading.value = false
  }

  async function fetchWeeklyBoard() {
    isLoading.value = true
    await mockRequest()
    const { getHonorBoard } = await import('@/mock/honor-data.js')
    weeklyBoard.value = getHonorBoard('weekly')

    const userStore = useUserStore()
    const userIdx = weeklyBoard.value.findIndex(e => e.userId === userStore.id)
    userRank.value.weekly = userIdx >= 0 ? userIdx + 1 : null
    isWeeklyStar.value = userIdx >= 0 && userIdx <= 3

    isLoading.value = false
  }

  function claimProtectionCard() {
    if (!canClaimProtectionCard.value) return false
    const userStore = useUserStore()
    userStore.protectionCards++
    lastProtectionClaim.value = new Date().toISOString()
    return true
  }

  return {
    dailyBoard, weeklyBoard, userRank, isDailyStar, isWeeklyStar,
    lastProtectionClaim, isLoading,
    canClaimProtectionCard,
    fetchDailyBoard, fetchWeeklyBoard, claimProtectionCard
  }
})
