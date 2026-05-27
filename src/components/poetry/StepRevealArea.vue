<template>
  <view class="step-reveal-area">
    <!-- Step 0: Processing -->
    <view v-if="step === 0" class="step-processing">
      <view class="processing-animation">
        <text class="processing-icon">🔍</text>
      </view>
      <text class="processing-text">{{ ocrStatus === 'processing' ? '正在识别中...' : '等待上传' }}</text>
    </view>

    <!-- Step 1: Show error count -->
    <view v-if="step === 1" class="step-errors">
      <text class="error-count-text">错字 ×{{ wrongChars.length }}个，位置已标黄</text>
      <view class="answer-preview">
        <text
          v-for="(char, idx) in displayChars"
          :key="idx"
          class="answer-char"
          :class="{ highlighted: isWrong(idx) }"
          @tap="handleCharTap(idx)"
        >{{ char }}</text>
      </view>
      <button class="reveal-next-btn" @tap="handleAdvance">查看正确答案</button>
    </view>

    <!-- Step 2: Tap to correct -->
    <view v-if="step === 2" class="step-correct">
      <text class="correct-prompt">点击黄色位置，填写正确汉字</text>
      <view class="answer-preview">
        <text
          v-for="(char, idx) in displayChars"
          :key="idx"
          class="answer-char"
          :class="{ highlighted: isWrong(idx), corrected: isCorrected(idx) }"
          @tap="handleCharTap(idx)"
        >{{ getDisplayChar(idx) }}</text>
      </view>
      <!-- Correction input -->
      <view class="correction-input" v-if="activeCorrection !== null">
        <text class="correction-label">{{ wrongChars[activeCorrection] ? '正确答案是"' + wrongChars[activeCorrection].correct + '"' : '' }}</text>
        <view class="input-row">
          <input class="char-input" v-model="correctionValue" maxlength="1" placeholder="写一写" />
          <button class="submit-correction" @tap="submitCorrection">确认</button>
        </view>
      </view>
      <button class="reveal-full-btn" @tap="handleAdvance">帮我一下，看完整答案</button>
    </view>

    <!-- Step 3: Full answer revealed -->
    <view v-if="step === 3" class="step-full">
      <text class="full-answer-label">完整答案：</text>
      <view class="full-answer">
        <text
          v-for="(char, idx) in correctAnswerChars"
          :key="idx"
          class="full-char"
          :class="{ 'was-wrong': isWrong(idx) }"
        >{{ char }}</text>
      </view>
      <button class="finish-btn" @tap="handleFinish">完成</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  step: { type: Number, default: 0 },
  ocrStatus: { type: String, default: 'idle' },
  correctAnswer: { type: String, default: '' },
  wrongChars: { type: Array, default: () => [] },
  displayText: { type: String, default: '' }
})

const emit = defineEmits(['advance-step', 'submit-correction', 'finish'])

const activeCorrection = ref(null)
const correctionValue = ref('')
const correctedChars = ref({})

const correctAnswerChars = computed(() => [...props.correctAnswer])
const displayChars = computed(() => [...(props.displayText || props.correctAnswer)])

function isWrong(idx) {
  return props.wrongChars.some(w => w.position === idx)
}

function isCorrected(idx) {
  return correctedChars.value[idx] !== undefined
}

function getDisplayChar(idx) {
  return correctedChars.value[idx] || displayChars.value[idx] || '?'
}

function handleCharTap(idx) {
  if (props.step === 2 && isWrong(idx) && !isCorrected(idx)) {
    activeCorrection.value = idx
    correctionValue.value = ''
  }
}

function submitCorrection() {
  if (activeCorrection.value !== null && correctionValue.value) {
    correctedChars.value[activeCorrection.value] = correctionValue.value
    activeCorrection.value = null
    emit('submit-correction', { index: activeCorrection.value, value: correctionValue.value })
  }
}

function handleAdvance() { emit('advance-step') }
function handleFinish() { emit('finish') }
</script>

<style lang="scss" scoped>
.step-reveal-area { background: #fff; border-radius: $border-radius-lg; padding: $spacing-xl; text-align: center; min-height: 400rpx; }
.step-processing { padding: 80rpx 0; }
.processing-animation { animation: pulse 1.5s infinite; .processing-icon { font-size: 80rpx; } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
.processing-text { font-size: $font-lg; color: $text-secondary; display: block; margin-top: $spacing-lg; }
.step-errors { .error-count-text { font-size: $font-xl; color: $warning; font-weight: 700; display: block; margin-bottom: $spacing-lg; } }
.answer-preview { display: flex; flex-wrap: wrap; justify-content: center; gap: 8rpx; margin-bottom: $spacing-lg; }
.answer-char { font-size: 40rpx; padding: 8rpx 12rpx; border-radius: 8rpx; background: $bg-page; }
.answer-char.highlighted { background: #FFF3CD; border: 2rpx solid $warning; }
.answer-char.corrected { background: #D5F5E3; border-color: $success; }
.reveal-next-btn, .reveal-full-btn { background: $primary; color: #fff; padding: 20rpx 48rpx; border-radius: 40rpx; font-size: $font-md; margin-top: $spacing-md; }
.correction-input { margin-top: $spacing-lg; .correction-label { font-size: $font-md; color: $primary; } }
.input-row { display: flex; gap: $spacing-sm; justify-content: center; margin-top: $spacing-sm; }
.char-input { width: 120rpx; height: 80rpx; border: 2rpx solid $primary; border-radius: $border-radius; text-align: center; font-size: 44rpx; }
.submit-correction { background: $success; color: #fff; padding: 16rpx 32rpx; border-radius: 32rpx; font-size: $font-sm; }
.step-full { .full-answer-label { font-size: $font-lg; color: $text-primary; display: block; margin-bottom: $spacing-md; } }
.full-answer { display: flex; flex-wrap: wrap; justify-content: center; gap: 8rpx; }
.full-char { font-size: 40rpx; padding: 8rpx 12rpx; border-radius: 8rpx; background: $bg-page; }
.full-char.was-wrong { background: rgba(231,76,60,0.1); color: $danger; }
.finish-btn { background: $success; color: #fff; padding: 20rpx 48rpx; border-radius: 40rpx; font-size: $font-md; margin-top: $spacing-lg; }
</style>
