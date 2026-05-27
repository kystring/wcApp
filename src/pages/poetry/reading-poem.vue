<template>
  <view class="reading-poem-page">
    <view v-if="currentPoem">
      <!-- 诗歌展示 -->
      <view class="poem-display">
        <text class="poem-title">{{ currentPoem.title }}</text>
        <text class="poem-author">{{ currentPoem.author }} · {{ currentPoem.dynasty }}</text>
        <view class="poem-text-box">
          <text class="poem-text">{{ currentPoem.fullText }}</text>
        </view>
      </view>

      <!-- 赏析题 -->
      <view class="questions-section">
        <text class="questions-label">📝 阅读理解</text>
        <view v-for="q in currentPoem.questions" :key="q.id" class="question-card">
          <text class="question-stem">{{ q.stem }}</text>
          <textarea
            class="answer-textarea"
            v-model="answers[q.id]"
            placeholder="在此输入你的理解（或拍照上传手写内容）"
            :maxlength="500"
          />
          <button class="submit-answer-btn" @tap="submitAnswer(q)">提交 → AI批改</button>

          <!-- AI反馈 -->
          <view class="ai-feedback" v-if="feedbacks[q.id]">
            <text class="feedback-direction" :class="getFeedbackClass(feedbacks[q.id].direction)">
              {{ feedbacks[q.id].direction }}
            </text>
            <text class="feedback-msg">{{ feedbacks[q.id].encouragement }}</text>
          </view>
        </view>
      </view>

      <!-- 导航 -->
      <view class="nav-btns">
        <button class="nav-btn" @tap="prevPoem">← 上一首</button>
        <button class="nav-btn" @tap="nextPoem">下一首 →</button>
      </view>
    </view>

    <c-empty-state v-if="!currentPoem" icon="📖" title="加载中..." />
    <c-loading-overlay :visible="isLoading" text="AI批改中..." />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePoetryStore } from '@/stores/poetry.js'
import { onLoad } from '@dcloudio/uni-app'
import { EMOTION_POEMS } from '@/mock/poetry-data.js'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const poetryStore = usePoetryStore()
const currentPoem = ref(null)
const currentCategoryId = ref('')
const poemIndex = ref(0)
const poemList = ref([])
const answers = ref({})
const feedbacks = ref({})
const isLoading = ref(false)

onLoad((options) => {
  currentCategoryId.value = options.category || 'aiguo'
  loadPoems()
})

onMounted(() => {
  if (!currentPoem.value) loadPoems()
})

function loadPoems() {
  poemList.value = EMOTION_POEMS[currentCategoryId.value] || []
  if (poemList.value.length > 0) {
    currentPoem.value = poemList.value[0]
    poemIndex.value = 0
  }
}

async function submitAnswer(question) {
  if (!answers.value[question.id]?.trim()) {
    uni.showToast({ title: '请先输入你的答案', icon: 'none' })
    return
  }
  isLoading.value = true
  const feedback = await poetryStore.submitSubjectiveAnswer(question.id, answers.value[question.id])
  feedbacks.value[question.id] = feedback
  isLoading.value = false
}

function getFeedbackClass(direction) {
  if (direction === '正确方向') return 'correct'
  if (direction === '沾边') return 'partial'
  return 'off'
}

function nextPoem() {
  if (poemIndex.value < poemList.value.length - 1) {
    poemIndex.value++
    currentPoem.value = poemList.value[poemIndex.value]
    answers.value = {}
    feedbacks.value = {}
  } else {
    uni.showToast({ title: '已经是这一类的最后一首了', icon: 'none' })
  }
}

function prevPoem() {
  if (poemIndex.value > 0) {
    poemIndex.value--
    currentPoem.value = poemList.value[poemIndex.value]
    answers.value = {}
    feedbacks.value = {}
  }
}
</script>

<style lang="scss" scoped>
.reading-poem-page { min-height: 100vh; background: $bg-page; padding-bottom: 60rpx; }
.poem-display { background: linear-gradient(135deg, #F5F0E8, #EBE0CC); padding: $spacing-xl $spacing-lg; text-align: center; }
.poem-title { font-size: $font-xxl; font-weight: 800; color: $text-primary; display: block; }
.poem-author { font-size: $font-sm; color: $text-secondary; display: block; margin: $spacing-sm 0 $spacing-lg; }
.poem-text-box { background: rgba(255,255,255,0.6); border-radius: $border-radius; padding: $spacing-lg; }
.poem-text { font-size: $font-lg; color: $text-primary; line-height: 2.2; white-space: pre-wrap; }
.questions-section { padding: $spacing-lg; }
.questions-label { font-size: $font-lg; font-weight: 600; color: $text-primary; display: block; margin-bottom: $spacing-md; }
.question-card { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.question-stem { font-size: $font-md; color: $text-primary; font-weight: 500; display: block; margin-bottom: $spacing-md; }
.answer-textarea { width: 100%; height: 200rpx; border: 2rpx solid $border-color; border-radius: $border-radius; padding: $spacing-sm; font-size: $font-md; box-sizing: border-box; }
.submit-answer-btn { background: $primary; color: #fff; padding: 20rpx 0; border-radius: 32rpx; font-size: $font-sm; margin-top: $spacing-md; }
.ai-feedback { margin-top: $spacing-md; padding: $spacing-md; background: $bg-page; border-radius: $border-radius; }
.feedback-direction { font-size: $font-md; font-weight: 600; display: block; }
.feedback-direction.correct { color: $success; }
.feedback-direction.partial { color: $warning; }
.feedback-direction.off { color: $danger; }
.feedback-msg { font-size: $font-sm; color: $text-secondary; margin-top: 8rpx; display: block; }
.nav-btns { display: flex; gap: $spacing-md; padding: 0 $spacing-lg; margin-top: $spacing-lg; }
.nav-btn { flex: 1; background: #fff; color: $primary; padding: 24rpx 0; border-radius: 40rpx; font-size: $font-md; box-shadow: $shadow-sm; }
</style>
