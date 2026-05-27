<template>
  <view class="quiz-page">
    <!-- 顶栏 -->
    <view class="quiz-header">
      <view class="header-top">
        <view class="back-btn" @tap="confirmExit">
          <text class="back-text">✕</text>
        </view>
        <t-quiz-progress :done="progress.done" :total="progress.total" :percent="progress.percent" />
        <view class="timer" v-if="hasTimer">
          <text class="timer-text">{{ formatTime(elapsed) }}</text>
        </view>
      </view>
    </view>

    <!-- 题目区 -->
    <scroll-view class="quiz-body" scroll-y :scroll-top="scrollTop" @scroll="onScroll">
      <t-question-card
        v-if="currentQ"
        :question="currentQ"
        :selectedOption="getSelected(currentQ.id)"
        :showResult="answeredQuestions.includes(currentQ.id)"
        :disabled="false"
        @select="handleAnswer"
      />
    </scroll-view>

    <!-- 底栏 -->
    <view class="quiz-footer">
      <view class="question-dots">
        <view
          v-for="(q, idx) in questions"
          :key="q.id"
          class="dot"
          :class="{ active: idx === currentIndex, answered: answeredQuestions.includes(q.id) }"
          @tap="jumpTo(idx)"
        ></view>
      </view>
      <view class="footer-actions">
        <button class="btn-prev" @tap="prevQuestion" :disabled="currentIndex === 0">上一题</button>
        <button class="btn-next" @tap="nextOrSubmit">
          {{ isLastQuestion ? '提交' : '下一题' }}
        </button>
      </view>
    </view>

    <!-- 提交确认弹窗 -->
    <c-confirm-modal
      :visible="showSubmitModal"
      title="确认提交"
      :content="`已答${answeredQuestions.length}/${questions.length}题，确定提交吗？`"
      @confirm="submitQuiz"
      @cancel="showSubmitModal = false"
    />

    <!-- 退出确认弹窗 -->
    <c-confirm-modal
      :visible="showExitModal"
      title="确定退出？"
      content="退出后当前答题进度将丢失"
      confirmText="退出"
      cancelText="继续答题"
      @confirm="exitQuiz"
      @cancel="showExitModal = false"
    />

    <c-loading-overlay :visible="tierStore.isLoading" text="组卷中..." />
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTierStore } from '@/stores/tier.js'
import QuizProgress from '@/components/tier/QuizProgress.vue'
import QuestionCard from '@/components/tier/QuestionCard.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const tierStore = useTierStore()

const currentIndex = ref(0)
const answeredQuestions = ref([])
const scrollTop = ref(0)
const showSubmitModal = ref(false)
const showExitModal = ref(false)
const elapsed = ref(0)
let timer = null

const questions = computed(() => tierStore.currentQuiz?.questions || [])
const currentQ = computed(() => questions.value[currentIndex.value] || null)
const progress = computed(() => tierStore.quizProgress)
const isLastQuestion = computed(() => currentIndex.value >= questions.value.length - 1)
const hasTimer = computed(() => false) // Default no timer

function getSelected(questionId) {
  const answer = tierStore.currentQuiz?.answers?.find(a => a.questionId === questionId)
  return answer ? answer.selectedOption : -1
}

function handleAnswer(optionIndex) {
  if (!currentQ.value) return
  tierStore.submitAnswer(currentQ.value.id, optionIndex)
  if (!answeredQuestions.value.includes(currentQ.value.id)) {
    answeredQuestions.value.push(currentQ.value.id)
  }
}

function nextOrSubmit() {
  if (isLastQuestion.value) {
    if (answeredQuestions.value.length < questions.value.length) {
      showSubmitModal.value = true
    } else {
      submitQuiz()
    }
    return
  }
  nextQuestion()
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    scrollTop.value = 0
  }
}

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    scrollTop.value = 0
  }
}

function jumpTo(index) {
  currentIndex.value = index
}

function submitQuiz() {
  showSubmitModal.value = false
  if (timer) clearInterval(timer)
  const result = tierStore.finishQuiz()
  uni.redirectTo({
    url: `/pages/challenge/result?score=${result.score}&correct=${result.correct}&total=${result.total}`
  })
}

function confirmExit() {
  if (answeredQuestions.value.length > 0) {
    showExitModal.value = true
  } else {
    exitQuiz()
  }
}

function exitQuiz() {
  showExitModal.value = false
  if (timer) clearInterval(timer)
  tierStore.currentQuiz = null
  uni.navigateBack()
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

onMounted(() => {
  timer = setInterval(() => {
    elapsed.value++
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.quiz-page {
  min-height: 100vh;
  background: #2C3E50;
  display: flex;
  flex-direction: column;
}

.quiz-header {
  padding: 80rpx $spacing-lg $spacing-sm;
}

.header-top {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .back-text { color: #fff; font-size: 36rpx; }
}

.timer {
  margin-left: auto;

  .timer-text { color: rgba(255,255,255,0.7); font-size: $font-sm; }
}

.quiz-body {
  flex: 1;
  padding: $spacing-md $spacing-lg;
  overflow-y: auto;
}

.quiz-footer {
  background: rgba(255,255,255,0.95);
  padding: $spacing-md $spacing-lg;
  padding-bottom: calc(env(safe-area-inset-bottom) + 16rpx);
}

.question-dots {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: $spacing-md;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: $border-color;

  &.active { background: $primary; transform: scale(1.3); }
  &.answered { background: $success; }
}

.footer-actions {
  display: flex;
  gap: $spacing-md;

  .btn-prev, .btn-next {
    flex: 1;
    padding: 24rpx;
    border-radius: 40rpx;
    text-align: center;
    font-size: $font-md;
  }

  .btn-prev {
    background: $bg-page;
    color: $text-secondary;

    &[disabled] { opacity: 0.4; }
  }

  .btn-next {
    background: $primary;
    color: #fff;
    font-weight: 600;
  }
}
</style>
