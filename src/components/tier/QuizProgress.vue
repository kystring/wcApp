<template>
  <view class="quiz-progress">
    <view class="progress-bar">
      <view class="progress-fill" :style="{ width: percent + '%' }"></view>
    </view>
    <text class="progress-text">{{ done }} / {{ total }}</text>
  </view>
</template>

<script setup>
defineProps({
  done: { type: Number, default: 0 },
  total: { type: Number, default: 10 },
  percent: { type: Number, default: 0 }
})
</script>

<style lang="scss" scoped>
.quiz-progress {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
}

.progress-bar {
  flex: 1;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $primary;
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: $font-sm;
  color: #fff;
  min-width: 80rpx;
  text-align: right;
}
</style>
