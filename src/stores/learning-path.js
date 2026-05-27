import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockRequest } from '@/mock/index.js'
import { useTierStore } from './tier.js'
import { useUserStore } from './user.js'

export const useLearningPathStore = defineStore('learning-path', () => {
  // --- Heatmap ---
  const heatmapData = ref([])
  const isLoading = ref(false)

  // --- AI Coach ---
  const aiSuggestion = ref(null)

  // --- Peer Data ---
  const peerData = ref({
    classmates: [],
    highestTier: '钻石',
    friends: []
  })

  // --- Skip Cards ---
  const skipCardStatus = ref({
    totalEarned: 0,
    available: 0,
    examPointsCleared: []
  })

  // --- Getters ---
  const heatmapReady = computed(() => heatmapData.value.length > 0)
  const hasNewSuggestion = computed(() => aiSuggestion.value !== null)

  const gapToHighestTier = computed(() => {
    const tierStore = useTierStore()
    const userStore = useUserStore()
    return `${userStore.currentTier} · 距${peerData.value.highestTier}还差一步`
  })

  // --- Actions ---
  async function fetchHeatmapData() {
    isLoading.value = true
    await mockRequest()
    const tierStore = useTierStore()

    const { EXAM_POINTS } = await import('@/utils/constants.js')
    const points = EXAM_POINTS.map(ep => {
      const wrongCount = tierStore.getWrongCount(ep.id)
      return {
        id: ep.id,
        name: ep.name,
        icon: ep.icon,
        wrongCount,
        cleared: wrongCount === 0,
        // Bubble chart sizing
        radius: Math.max(30, Math.min(80, 30 + wrongCount * 8)),
        color: wrongCount === 0 ? '#27AE60' :
               wrongCount <= 3 ? '#F39C12' :
               wrongCount <= 7 ? '#E67E22' : '#E74C3C'
      }
    })
    heatmapData.value = points
    isLoading.value = false
  }

  async function fetchAiSuggestion() {
    await mockRequest()
    const tierStore = useTierStore()

    // Determine scenario based on state
    const totalWrong = tierStore.getTotalWrongCount()
    let scenario, messageData

    if (totalWrong > 10) {
      scenario = 'consecutive-error'
      messageData = {
        scenario,
        message: "注意！'而'字顺承和转折你又混了，3道题5分钟搞掉它 →",
        actionLabel: '开始',
        actionRoute: '/pages/challenge/quiz',
        color: '#E74C3C'
      }
    } else if (totalWrong > 0 && totalWrong <= 5) {
      scenario = 'progress'
      messageData = {
        scenario,
        message: '字形正确率60%→85%，稳住了！明天主攻应用文 →',
        actionLabel: '设置目标',
        actionRoute: '/pages/writing/practical-guide',
        color: '#27AE60'
      }
    } else {
      scenario = 'inactive'
      messageData = {
        scenario,
        message: '兄弟3天没来了，错题快溢出啦，花3分钟清2题就行 →',
        actionLabel: '快速清题',
        actionRoute: '/pages/challenge/quiz',
        color: '#F39C12'
      }
    }

    aiSuggestion.value = messageData
  }

  async function fetchPeerData() {
    await mockRequest()
    const { getPeerData } = await import('@/mock/peer-data.js')
    peerData.value = getPeerData()
  }

  function earnSkipCard(examPointId) {
    if (!skipCardStatus.value.examPointsCleared.includes(examPointId)) {
      skipCardStatus.value.examPointsCleared.push(examPointId)
      skipCardStatus.value.totalEarned++
      skipCardStatus.value.available++

      const userStore = useUserStore()
      userStore.addSkipCard()
    }
  }

  function useSkipCard() {
    const userStore = useUserStore()
    if (userStore.useSkipCard()) {
      skipCardStatus.value.available--
      return true
    }
    return false
  }

  return {
    heatmapData, isLoading, aiSuggestion, peerData, skipCardStatus,
    heatmapReady, hasNewSuggestion, gapToHighestTier,
    fetchHeatmapData, fetchAiSuggestion, fetchPeerData,
    earnSkipCard, useSkipCard
  }
})
