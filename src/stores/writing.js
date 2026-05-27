import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockRequest } from '@/mock/index.js'

export const useWritingStore = defineStore('writing', () => {
  // --- Practical Writing (Module 4) ---
  const practicalSession = ref(null)
  const practicalHistory = ref([])

  // --- Regular Writing (Module 5) ---
  const regularSession = ref(null)
  const regularHistory = ref([])

  // --- Loading ---
  const isLoading = ref(false)

  // --- Getters ---
  const currentPracticalStep = computed(() => {
    return practicalSession.value?.step || 1
  })

  const currentRegularPhase = computed(() => {
    return regularSession.value?.phase || 'init'
  })

  // --- Practical Writing Actions ---
  function startPracticalWriting() {
    practicalSession.value = {
      step: 1,
      formatType: null,
      infoTable: { time: '', place: '', people: '', event: '' },
      generatedFrame: '',
      studentWriting: null,
      photoUrl: null,
      formatCheckResult: null,
      contentCheckResult: null
    }
  }

  function selectFormat(formatType) {
    if (practicalSession.value) {
      practicalSession.value.formatType = formatType
      practicalSession.value.step = 2
    }
  }

  function saveInfoTable(infoTable) {
    if (practicalSession.value) {
      practicalSession.value.infoTable = infoTable
      practicalSession.value.step = 3
      // Generate frame
      generateWritingFrame()
    }
  }

  function generateWritingFrame() {
    if (!practicalSession.value) return
    const fmt = practicalSession.value.formatType
    const info = practicalSession.value.infoTable

    const frames = {
      tongzhi: `标题：关于${info.event}的通知\n称呼：${info.people}：\n正文：${info.time}，将在${info.place}举行${info.event}，请准时参加。\n落款：________\n日期：____年____月____日`,
      qishi: `标题：${info.event}\n正文：${info.time}，在${info.place}${info.event}，请${info.people}。\n落款：________\n日期：____年____月____日`,
      qingjia: `标题：请假条\n称呼：${info.people}：\n正文：因${info.event}，需于${info.time}请假，请批准。\n落款：________\n日期：____年____月____日`
    }

    practicalSession.value.generatedFrame = frames[fmt] || frames.tongzhi
  }

  async function submitPracticalWriting(photoPath) {
    if (!practicalSession.value) return
    practicalSession.value.photoUrl = photoPath
    isLoading.value = true
    await mockRequest(500, 1000)
    isLoading.value = false
  }

  async function runFormatCheck() {
    await mockRequest(300, 500)
    // Simulate format checking
    return {
      titleCorrect: Math.random() > 0.2,
      salutationCorrect: Math.random() > 0.15,
      signaturePositionCorrect: Math.random() > 0.3,
      dateCorrect: Math.random() > 0.25,
      details: [
        { part: '标题', status: Math.random() > 0.2 ? 'correct' : 'wrong', msg: '标题位置居中正确' },
        { part: '称呼', status: Math.random() > 0.15 ? 'correct' : 'wrong', msg: '称呼需要顶格写' },
        { part: '落款', status: Math.random() > 0.3 ? 'correct' : 'warning', msg: '落款位置偏右但格式对' },
        { part: '日期', status: Math.random() > 0.25 ? 'correct' : 'wrong', msg: '日期格式正确' }
      ]
    }
  }

  async function runContentCheck() {
    await mockRequest(300, 500)
    return {
      timePresent: Math.random() > 0.15,
      placePresent: Math.random() > 0.1,
      peoplePresent: Math.random() > 0.2,
      eventPresent: Math.random() > 0.1,
      message: '四要素齐全，格式完整，得分90+'
    }
  }

  function finishPracticalWriting() {
    if (practicalSession.value) {
      practicalHistory.value.unshift({ ...practicalSession.value })
      practicalSession.value = null
    }
  }

  // --- Regular Writing Actions ---
  function startRegularWriting() {
    regularSession.value = {
      phase: 'init',
      topicType: null,
      topicText: '',
      aiDialogue: [],
      dialogueRound: 0,
      coreIdea: '',
      framework: [],
      fillTier: 'medium',
      filledContent: '',
      feedback: null,
      selectedFocus: null
    }
  }

  function setTopicType(type, text = '') {
    if (regularSession.value) {
      regularSession.value.topicType = type
      regularSession.value.topicText = text
      regularSession.value.phase = 'topic-analysis'
    }
  }

  async function sendAiMessage(text) {
    if (!regularSession.value) return null
    regularSession.value.aiDialogue.push({ role: 'student', content: text, time: Date.now() })
    regularSession.value.dialogueRound++

    await mockRequest(600, 1200)
    const response = getAiResponseForRound(regularSession.value.dialogueRound, text)
    regularSession.value.aiDialogue.push({ role: 'ai', content: response, time: Date.now() })
    return response
  }

  // Predefined AI responses based on the 3-step analysis flow
  function getAiResponseForRound(round, studentInput) {
    const responses = {
      1: "好的！我们先来拆解题目。请你告诉我，这段材料里提到了谁？他们的起点是什么？终点又是什么？",
      2: "很好！你抓住了关键人物。再想一想，他们俩有什么共同点？坚持了多少年才成功的？",
      3: '题目结尾说“每一朵花都会有春天”，你觉得这里的“春天”指的是什么？\n\nA. 运气好\nB. 时机+努力\nC. 父母帮助',
      4: '对！这篇作文的主题就是——即使起点平凡，坚持努力也能迎来自己的高光时刻。\n\n现在我给你几个素材，请判断哪些适合用在这篇作文里：\n① 戴栋晨从迷茫职校生到博士，用了12年\n② 郑志明从钳工到大国工匠，用了26年\n③ 李白是唐代著名诗人\n④ 某中职学生每天练技能2小时，三年后获得省赛冠军\n⑤ 小明考试作弊及格了\n\n哪些适合？哪些不适合？为什么？',
      5: '正确！①和②是题目里给的例子，④是类似的正面例子。③和主题无关，⑤是错误示范。\n\n审题到此结束！现在进行下一步：请用一句话说说你最想表达的核心观点是什么？'
    }
    return responses[round] || "说得不错！我们继续下一步。"
  }

  function skipTopicAnalysis() {
    if (regularSession.value) {
      regularSession.value.phase = 'framework'
    }
  }

  function setCoreIdea(idea) {
    if (regularSession.value) {
      regularSession.value.coreIdea = idea
      regularSession.value.phase = 'framework'
      generateFramework()
    }
  }

  function generateFramework() {
    if (!regularSession.value) return
    regularSession.value.framework = [
      { id: 1, type: 'intro', title: '开头引入', hint: '用一个故事或现象引出主题，点明核心观点' },
      { id: 2, type: 'body1', title: '主体段落1', hint: '列举第一个论据或例子，支持你的观点' },
      { id: 3, type: 'body2', title: '主体段落2', hint: '列举第二个论据或例子，可结合实际生活' },
      { id: 4, type: 'conclusion', title: '结尾总结', hint: '回扣主题，升华观点，给读者启发' }
    ]
  }

  function selectFillTier(tier) {
    if (regularSession.value) {
      regularSession.value.fillTier = tier
    }
  }

  function fillContent(contentText) {
    if (regularSession.value) {
      regularSession.value.filledContent = contentText
    }
  }

  function selectFeedbackFocus(focus) {
    if (regularSession.value) {
      regularSession.value.selectedFocus = focus
    }
  }

  async function runWritingChecks() {
    await mockRequest(400, 800)
    const content = regularSession.value?.filledContent || ''
    return {
      wordCount: content.length,
      paragraphCount: (content.match(/\n/g) || []).length + 1,
      repeatedWords: detectRepeatedWords(content),
      suggestions: getSuggestions(content)
    }
  }

  function detectRepeatedWords(text) {
    // Simple repeated word detection
    const words = text.split('')
    const freq = {}
    words.forEach(w => {
      if (w.trim()) {
        freq[w] = (freq[w] || 0) + 1
      }
    })
    return Object.entries(freq)
      .filter(([_, count]) => count > 5)
      .map(([word, count]) => ({ word, count }))
  }

  function getSuggestions(text) {
    const suggestions = []
    if (text.length < 200) suggestions.push('字数偏少，建议加入更多例子充实内容')
    if ((text.match(/\n/g) || []).length < 2) suggestions.push('段落较少，建议分成开头、主体、结尾三段')
    return suggestions
  }

  async function submitForFeedback() {
    isLoading.value = true
    await mockRequest(800, 1500)
    const checks = await runWritingChecks()
    isLoading.value = false

    if (regularSession.value) {
      regularSession.value.phase = 'feedback'
      regularSession.value.feedback = checks
    }
    return checks
  }

  function finishRegularWriting() {
    if (regularSession.value) {
      regularHistory.value.unshift({ ...regularSession.value })
      regularSession.value = null
    }
  }

  return {
    practicalSession, practicalHistory,
    regularSession, regularHistory,
    isLoading,
    currentPracticalStep, currentRegularPhase,
    startPracticalWriting, selectFormat, saveInfoTable, generateWritingFrame,
    submitPracticalWriting, runFormatCheck, runContentCheck, finishPracticalWriting,
    startRegularWriting, setTopicType, sendAiMessage, skipTopicAnalysis,
    setCoreIdea, generateFramework, selectFillTier, fillContent,
    selectFeedbackFocus, runWritingChecks, submitForFeedback, finishRegularWriting
  }
})
