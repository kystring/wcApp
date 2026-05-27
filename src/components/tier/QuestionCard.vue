<template>
  <view class="question-card">
    <!-- 题目标签 -->
    <view class="question-header">
      <view class="exam-tags">
        <text class="tag-chip" v-for="tag in question?.tags || []" :key="tag">{{ getTagName(tag) }}</text>
      </view>
      <text class="difficulty-label" :style="{ color: diffColor }">{{ diffLabel }}</text>
    </view>

    <!-- 题目 -->
    <view class="question-stem">
      <text class="stem-text">{{ question?.stem }}</text>
    </view>

    <!-- 选项 -->
    <view class="options-list">
      <view
        v-for="(option, index) in question?.options || []"
        :key="index"
        class="option-item"
        :class="getOptionClass(index)"
        @tap="handleSelect(index)"
      >
        <view class="option-radio" :class="{ selected: selectedOption === index, correct: showResult && index === question?.correctIndex, wrong: showResult && selectedOption === index && index !== question?.correctIndex }">
          <text class="radio-letter">{{ optionLetters[index] }}</text>
        </view>
        <text class="option-text">{{ option.substring(2) }}</text>
      </view>
    </view>

    <!-- 解析 -->
    <view class="explanation" v-if="showResult && question?.explanation">
      <text class="explanation-icon">{{ isCorrect ? '✅' : '❌' }}</text>
      <text class="explanation-text">{{ question?.explanation }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EXAM_TAGS } from '@/utils/exam-points.js'

const props = defineProps({
  question: { type: Object, default: null },
  selectedOption: { type: Number, default: -1 },
  showResult: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['select'])

const optionLetters = ['A', 'B', 'C', 'D']

const isCorrect = computed(() => {
  return props.selectedOption === props.question?.correctIndex
})

const diffLabel = computed(() => {
  const map = { 1: '基础', 2: '简单', 3: '中等', 4: '较难', 5: '困难' }
  return map[props.question?.difficulty] || '基础'
})

const diffColor = computed(() => {
  const map = { 1: '#27AE60', 2: '#3498DB', 3: '#F39C12', 4: '#E67E22', 5: '#E74C3C' }
  return map[props.question?.difficulty] || '#27AE60'
})

function getTagName(tagId) {
  for (const examPoint of Object.values(EXAM_TAGS)) {
    const tag = examPoint.find(t => t.id === tagId)
    if (tag) return tag.name
  }
  return tagId
}

function getOptionClass(index) {
  if (!props.showResult) return ''
  if (index === props.question?.correctIndex) return 'correct-answer'
  if (index === props.selectedOption && !isCorrect.value) return 'wrong-answer'
  return ''
}

function handleSelect(index) {
  if (props.disabled || props.showResult) return
  emit('select', index)
}
</script>

<style lang="scss" scoped>
.question-card {
  background: #fff;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.exam-tags {
  display: flex;
  gap: $spacing-xs;
}

.tag-chip {
  font-size: $font-xs;
  color: $primary;
  background: rgba(231, 76, 60, 0.08);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.difficulty-label {
  font-size: $font-xs;
  font-weight: 500;
}

.question-stem {
  margin-bottom: $spacing-lg;

  .stem-text {
    font-size: $font-md;
    color: $text-primary;
    line-height: 1.8;
    white-space: pre-wrap;
  }
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.option-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx 24rpx;
  border: 2rpx solid $border-color;
  border-radius: $border-radius;
  background: #fff;
  transition: all 0.2s;

  &.correct-answer {
    background: rgba(39, 174, 96, 0.08);
    border-color: $success;
  }

  &.wrong-answer {
    background: rgba(231, 76, 60, 0.08);
    border-color: $danger;
  }
}

.option-radio {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 2rpx solid $border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $spacing-sm;
  flex-shrink: 0;

  &.selected {
    background: $primary;
    border-color: $primary;

    .radio-letter { color: #fff; }
  }

  &.correct {
    background: $success;
    border-color: $success;

    .radio-letter { color: #fff; }
  }

  &.wrong {
    background: $danger;
    border-color: $danger;

    .radio-letter { color: #fff; }
  }

  .radio-letter {
    font-size: $font-sm;
    color: $text-secondary;
    font-weight: 600;
  }
}

.option-text {
  font-size: $font-md;
  color: $text-primary;
  line-height: 1.6;
  flex: 1;
}

.explanation {
  margin-top: $spacing-md;
  padding: $spacing-md;
  background: $bg-page;
  border-radius: $border-radius;
  display: flex;
  gap: $spacing-sm;

  .explanation-icon { font-size: 28rpx; flex-shrink: 0; }

  .explanation-text {
    font-size: $font-sm;
    color: $text-secondary;
    line-height: 1.6;
  }
}
</style>
