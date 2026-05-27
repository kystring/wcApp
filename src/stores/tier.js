import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockRequest } from '@/mock/index.js'
import { pickQuestionsForTier } from '@/utils/question-picker.js'
import { findOpponent } from '@/mock/pk-opponents.js'

export const useTierStore = defineStore('tier', () => {
  // --- Quiz Engine State ---
  const currentQuiz = ref(null)
  const quizHistory = ref([])
  const isLoading = ref(false)

  // Tracks onboarding phase (青铜前3次测试)
  const testAttemptCount = ref(0)

  // Wrong question banks: { [examPointId]: [questionId, ...] }
  const wrongQuestionBanks = ref({})
  // Persistent wrong tags
  const persistentWrongTags = ref([])

  // --- PK State ---
  const pkMode = ref(null)
  const pkOpponent = ref(null)
  const pkSession = ref(null)

  // --- Dashboard ---
  const dailyPracticeCount = ref(0)
  const weeklyTierProgress = ref(0)

  // --- Getters ---
  const isOnboardingPhase = computed(() => {
    return testAttemptCount.value < 3
  })

  const onboardingStage = computed(() => {
    return Math.min(testAttemptCount.value + 1, 3)
  })

  const currentQuestion = computed(() => {
    if (!currentQuiz.value || !currentQuiz.value.questions) return null
    return currentQuiz.value.questions[currentQuiz.value.currentIndex] || null
  })

  const quizProgress = computed(() => {
    if (!currentQuiz.value) return { done: 0, total: 0, percent: 0 }
    const done = currentQuiz.value.currentIndex + 1
    const total = currentQuiz.value.questions.length
    return { done, total, percent: Math.round((done / total) * 100) }
  })

  const isRetry = ref(false)

  // --- Actions ---
  async function startQuiz(mode, targetTier) {
    isLoading.value = true
    await mockRequest(300, 600)

    const questions = pickQuestionsForTier({
      tier: targetTier || '青铜',
      mode: mode || 'practice',
      isOnboarding: isOnboardingPhase.value,
      onboardingStage: onboardingStage.value,
      wrongBanks: isRetry.value ? wrongQuestionBanks.value : {},
      isRetry: isRetry.value,
      questionCount: 10
    })

    currentQuiz.value = {
      sessionId: 'quiz_' + Date.now(),
      mode,
      targetTier,
      currentIndex: 0,
      questions,
      answers: [],
      startTime: Date.now()
    }

    isLoading.value = false
  }

  function submitAnswer(questionId, selectedOption) {
    if (!currentQuiz.value) return

    const idx = currentQuiz.value.answers.findIndex(a => a.questionId === questionId)
    if (idx >= 0) {
      currentQuiz.value.answers[idx] = { questionId, selectedOption }
    } else {
      currentQuiz.value.answers.push({ questionId, selectedOption })
    }
  }

  function nextQuestion() {
    if (!currentQuiz.value) return false
    if (currentQuiz.value.currentIndex < currentQuiz.value.questions.length - 1) {
      currentQuiz.value.currentIndex++
      return true
    }
    return false
  }

  function calculateScore() {
    if (!currentQuiz.value) return { score: 0, total: 0, correct: 0 }
    let correct = 0
    const total = currentQuiz.value.questions.length

    currentQuiz.value.answers.forEach(answer => {
      const question = currentQuiz.value.questions.find(q => q.id === answer.questionId)
      if (question && answer.selectedOption === question.correctIndex) {
        correct++
      } else if (question) {
        // Add to wrong bank
        if (!wrongQuestionBanks.value[question.examPoint]) {
          wrongQuestionBanks.value[question.examPoint] = []
        }
        if (!wrongQuestionBanks.value[question.examPoint].includes(question.id)) {
          wrongQuestionBanks.value[question.examPoint].push(question.id)
        }
      }
    })

    const score = Math.round((correct / total) * 100)
    return { score, total, correct }
  }

  function finishQuiz() {
    const result = calculateScore()
    const session = {
      ...currentQuiz.value,
      score: result.score,
      correct: result.correct,
      total: result.total,
      endTime: Date.now()
    }
    quizHistory.value.unshift(session)
    if (quizHistory.value.length > 20) quizHistory.value.pop()

    testAttemptCount.value++
    dailyPracticeCount.value++
    currentQuiz.value = null
    isRetry.value = false

    return session
  }

  function retryQuiz() {
    isRetry.value = true
  }

  // --- PK Actions ---
  async function enterPkLobby(mode) {
    pkMode.value = mode
    pkOpponent.value = null
    pkSession.value = null
  }

  async function findPkOpponent() {
    const opponent = await findOpponent(pkMode.value)
    pkOpponent.value = opponent
    return opponent
  }

  function leavePk() {
    pkMode.value = null
    pkOpponent.value = null
    pkSession.value = null
  }

  // --- Dashboard ---
  async function fetchDashboardData() {
    await mockRequest()
    // Data populated from state
  }

  function getWrongCount(examPoint) {
    return (wrongQuestionBanks.value[examPoint] || []).length
  }

  function getTotalWrongCount() {
    return Object.values(wrongQuestionBanks.value).reduce((sum, arr) => sum + arr.length, 0)
  }

  function clearWrongBankForExamPoint(examPoint) {
    wrongQuestionBanks.value[examPoint] = []
  }

  return {
    currentQuiz, quizHistory, isLoading, testAttemptCount,
    wrongQuestionBanks, persistentWrongTags,
    pkMode, pkOpponent, pkSession,
    dailyPracticeCount, weeklyTierProgress,
    isOnboardingPhase, onboardingStage, currentQuestion, quizProgress, isRetry,
    startQuiz, submitAnswer, nextQuestion, calculateScore, finishQuiz, retryQuiz,
    enterPkLobby, findPkOpponent, leavePk,
    fetchDashboardData, getWrongCount, getTotalWrongCount, clearWrongBankForExamPoint
  }
})
