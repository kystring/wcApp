<template>
  <view class="regular-feedback-page">
    <text class="feedback-title">📊 写作反馈</text>

    <!-- 聚焦点反馈 -->
    <view class="focus-feedback">
      <text class="focus-icon">{{ focusInfo?.icon }}</text>
      <text class="focus-name">聚焦：{{ focusInfo?.name }}</text>
      <text class="focus-msg">{{ focusMessage }}</text>
    </view>

    <!-- 规则检查 -->
    <view class="rule-checks">
      <view class="rule-item" v-for="check in ruleResults" :key="check.label">
        <text class="rule-icon">{{ check.pass ? '✅' : '⚠️' }}</text>
        <text class="rule-label">{{ check.label }}</text>
        <text class="rule-value">{{ check.value }}</text>
      </view>
    </view>

    <!-- 重复词检测 -->
    <view class="repeat-section" v-if="repeatedWords.length > 0">
      <text class="repeat-title">🔁 高频重复词</text>
      <view class="repeat-list">
        <text v-for="w in repeatedWords" :key="w.word" class="repeat-chip">
          "{{ w.word }}" × {{ w.count }}
        </text>
      </view>
    </view>

    <!-- 改进建议 -->
    <view class="suggestions">
      <text class="suggest-title">💡 改进建议</text>
      <view v-for="(s, idx) in suggestions" :key="idx" class="suggest-item">
        <text class="suggest-num">{{ idx + 1 }}.</text>
        <text class="suggest-text">{{ s }}</text>
      </view>
    </view>

    <view class="action-btns">
      <button class="edit-btn" @tap="goEdit">修改后再交</button>
      <button class="done-btn" @tap="finish">完成</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWritingStore } from '@/stores/writing.js'
import { FEEDBACK_FOCUS } from '@/utils/constants.js'

const writingStore = useWritingStore()
const session = computed(() => writingStore.regularSession)
const feedback = computed(() => session.value?.feedback || null)

const ruleResults = ref([])
const repeatedWords = ref([])
const suggestions = ref([])

const focusInfo = computed(() => {
  return FEEDBACK_FOCUS.find(f => f.id === session.value?.selectedFocus) || FEEDBACK_FOCUS[0]
})

const focusMessages = {
  structure: '你的文章结构很清晰！段落安排合理，首尾呼应做得不错。',
  detail: '你的论点很明确。如果能在主体段落中加入一个具体的例子，说服力会更强。',
  language: '整体语言流畅。注意减少"然后"的使用（出现了多次），让表达更简练。'
}

const focusMessage = computed(() => {
  return focusMessages[session.value?.selectedFocus] || '整体不错，继续加油！'
})

onMounted(() => {
  // Simulate check results
  const content = session.value?.filledContent || ''
  ruleResults.value = [
    { label: '字数', value: content.length + '字', pass: content.length >= 200 },
    { label: '段落数', value: ((content.match(/\n/g) || []).length + 1) + '段', pass: (content.match(/\n/g) || []).length >= 2 },
    { label: '首尾呼应', value: '良好', pass: true }
  ]

  // Detect repeated words
  if (content.includes('然后')) {
    const count = (content.match(/然后/g) || []).length
    if (count >= 3) {
      repeatedWords.value.push({ word: '然后', count })
    }
  }

  suggestions.value = [
    '这次你的文章结构很清晰（优点）。',
    '我们只改一个小问题：你的例子可以更具体一些，试试加入时间、地点等细节。',
    '下次写作时注意减少"然后"的使用，可以用"接着""随后""之后"来替换。'
  ]
})

function goEdit() {
  uni.navigateBack()
}

function finish() {
  writingStore.finishRegularWriting()
  uni.switchTab({ url: '/pages/writing/index' })
}
</script>

<style lang="scss" scoped>
.regular-feedback-page { min-height: 100vh; background: $bg-page; padding: $spacing-lg; padding-bottom: 160rpx; }
.feedback-title { font-size: $font-xxl; font-weight: 800; color: $text-primary; text-align: center; display: block; margin-bottom: $spacing-xl; }
.focus-feedback { background: linear-gradient(135deg, #EBF5FB, #D6EAF8); border-radius: $border-radius-lg; padding: $spacing-xl; text-align: center; margin-bottom: $spacing-lg; }
.focus-icon { font-size: 56rpx; display: block; }
.focus-name { font-size: $font-lg; font-weight: 700; color: $info; display: block; margin: $spacing-sm 0; }
.focus-msg { font-size: $font-md; color: $text-primary; line-height: 1.6; display: block; }
.rule-checks { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-bottom: $spacing-md; }
.rule-item { display: flex; align-items: center; gap: $spacing-sm; padding: $spacing-sm 0; border-bottom: 1rpx solid $border-color; }
.rule-item:last-child { border-bottom: none; }
.rule-icon { font-size: 28rpx; }
.rule-label { font-size: $font-md; color: $text-primary; flex: 1; }
.rule-value { font-size: $font-sm; color: $text-secondary; }
.repeat-section { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-bottom: $spacing-md; }
.repeat-title { font-size: $font-md; font-weight: 600; color: $text-primary; display: block; margin-bottom: $spacing-sm; }
.repeat-list { display: flex; flex-wrap: wrap; gap: $spacing-sm; }
.repeat-chip { background: rgba(231,76,60,0.08); color: $danger; font-size: $font-xs; padding: 6rpx 20rpx; border-radius: 20rpx; }
.suggestions { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-bottom: $spacing-lg; }
.suggest-title { font-size: $font-md; font-weight: 600; color: $text-primary; display: block; margin-bottom: $spacing-sm; }
.suggest-item { display: flex; gap: 8rpx; margin-bottom: $spacing-sm; }
.suggest-num { font-size: $font-sm; color: $primary; font-weight: 600; }
.suggest-text { font-size: $font-sm; color: $text-secondary; line-height: 1.6; flex: 1; }
.action-btns { position: fixed; bottom: 0; left: 0; right: 0; display: flex; gap: $spacing-md; padding: $spacing-lg; background: #fff; box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.08); }
.edit-btn { flex: 1; padding: 24rpx 0; border-radius: 40rpx; font-size: $font-md; background: #fff; color: $primary; border: 2rpx solid $primary; font-weight: 600; }
.done-btn { flex: 1; padding: 24rpx 0; border-radius: 40rpx; font-size: $font-md; background: $primary; color: #fff; font-weight: 600; }
</style>
