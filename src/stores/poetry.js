import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockRequest } from '@/mock/index.js'
import { EMOTION_CATEGORIES } from '@/utils/constants.js'

export const usePoetryStore = defineStore('poetry', () => {
  // --- Dictation State ---
  const dictationAssignments = ref([])
  const currentDictation = ref(null)
  const dictationHistory = ref([])

  // --- Reading State ---
  const poemCategories = ref(EMOTION_CATEGORIES)
  const selectedCategory = ref(null)
  const currentPoem = ref(null)
  const currentClassical = ref(null)
  const readingHistory = ref([])

  // --- Word Panel ---
  const activeWordPanel = ref(null)

  // --- Loading ---
  const isLoading = ref(false)

  // --- Getters ---
  const totalWrongChars = computed(() => {
    if (!dictationHistory.value.length) return []
    return dictationHistory.value.flatMap(h => h.wrongChars || [])
  })

  // --- Dictation Actions ---
  async function fetchDictationAssignments() {
    isLoading.value = true
    await mockRequest()
    const { dictationAssignments: data } = await import('@/mock/dictation-data.js')
    dictationAssignments.value = data
    isLoading.value = false
  }

  function startDictation(assignment) {
    currentDictation.value = {
      assignmentId: assignment.id,
      poemTitle: assignment.title,
      promptText: assignment.prompt,
      correctAnswer: assignment.answer,
      photoUrl: null,
      ocrStatus: 'idle',
      ocrResult: null,
      correctionStep: 0,
      wrongCharacters: []
    }
  }

  async function submitDictationPhoto(photoPath) {
    if (!currentDictation.value) return
    currentDictation.value.photoUrl = photoPath
    currentDictation.value.ocrStatus = 'processing'

    const { simulateOcr } = await import('@/mock/ocr-simulator.js')
    await mockRequest(800, 1500)

    const result = simulateOcr(currentDictation.value.correctAnswer)
    currentDictation.value.ocrResult = result
    currentDictation.value.ocrStatus = result.confidence > 0.7 ? 'success' : 'failed'

    if (result.confidence < 0.7) {
      currentDictation.value.ocrStatus = 'failed'
    } else {
      currentDictation.value.wrongCharacters = result.wrongPositions.map(pos => ({
        position: pos,
        correct: currentDictation.value.correctAnswer[pos],
        recognized: result.recognizedText[pos] || ''
      }))
      currentDictation.value.correctionStep = 1
    }
  }

  function advanceCorrectionStep() {
    if (currentDictation.value && currentDictation.value.correctionStep < 3) {
      currentDictation.value.correctionStep++
    }
  }

  function retryPhoto() {
    if (currentDictation.value) {
      currentDictation.value.ocrStatus = 'idle'
      currentDictation.value.photoUrl = null
      currentDictation.value.ocrResult = null
    }
  }

  function finishDictation() {
    if (currentDictation.value) {
      dictationHistory.value.unshift({ ...currentDictation.value })
      currentDictation.value = null
    }
  }

  // --- Reading Actions ---
  function selectCategory(categoryId) {
    selectedCategory.value = categoryId
  }

  async function fetchPoemsByCategory(categoryId) {
    isLoading.value = true
    await mockRequest()
    const { getPoemsByCategory } = await import('@/mock/poetry-data.js')
    const poems = getPoemsByCategory(categoryId)
    isLoading.value = false
    return poems
  }

  function setCurrentPoem(poem) {
    currentPoem.value = poem
  }

  async function submitSubjectiveAnswer(questionId, answer) {
    await mockRequest(500, 1000)
    // Returns AI direction feedback
    const directions = ['正确方向', '沾边', '再想想']
    const weights = [0.5, 0.35, 0.15]
    const random = Math.random()
    let direction
    if (random < weights[0]) direction = directions[0]
    else if (random < weights[0] + weights[1]) direction = directions[1]
    else direction = directions[2]

    return {
      questionId,
      direction,
      encouragement: getEncouragement(direction)
    }
  }

  function getEncouragement(direction) {
    const map = {
      '正确方向': '你的理解方向是对的！继续保持这样的思考方式。',
      '沾边': '你的思路大体正确，但可以再想想更准确的表达。',
      '再想想': '这个方向偏了，试着从另一个角度思考，你可以的！'
    }
    return map[direction] || ''
  }

  // --- Classical Chinese Actions ---
  async function fetchClassicalText(textId) {
    isLoading.value = true
    await mockRequest()
    const { getClassicalText } = await import('@/mock/poetry-data.js')
    currentClassical.value = getClassicalText(textId)
    isLoading.value = false
  }

  function setActiveWordPanel(words) {
    activeWordPanel.value = { words, expanded: false }
  }

  function toggleWordPanel() {
    if (activeWordPanel.value) {
      activeWordPanel.value.expanded = !activeWordPanel.value.expanded
    }
  }

  return {
    dictationAssignments, currentDictation, dictationHistory,
    poemCategories, selectedCategory, currentPoem, currentClassical,
    readingHistory, activeWordPanel, isLoading,
    totalWrongChars,
    fetchDictationAssignments, startDictation, submitDictationPhoto,
    advanceCorrectionStep, retryPhoto, finishDictation,
    selectCategory, fetchPoemsByCategory, setCurrentPoem,
    submitSubjectiveAnswer,
    fetchClassicalText, setActiveWordPanel, toggleWordPanel
  }
})
