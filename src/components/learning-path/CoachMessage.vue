<template>
  <view class="coach-message" v-if="message" :style="{ borderLeftColor: message.color }">
    <view class="coach-header">
      <text class="coach-avatar">🧑‍🏫</text>
      <text class="coach-label">AI教练</text>
      <text class="scenario-icon">{{ message.scenario === 'consecutive-error' ? '⚠️' : message.scenario === 'progress' ? '🎉' : '💤' }}</text>
    </view>
    <text class="coach-text">{{ message.message }}</text>
    <view class="coach-action" :style="{ background: message.color }" @tap="handleAction">
      <text>{{ message.actionLabel }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  message: { type: Object, default: null }
})

const emit = defineEmits(['action'])

function handleAction() {
  emit('action')
}
</script>

<style lang="scss" scoped>
.coach-message {
  background: #fff;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin: $spacing-md $spacing-lg;
  border-left: 8rpx solid;
}

.coach-header {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin-bottom: $spacing-sm;

  .coach-avatar { font-size: 36rpx; }
  .coach-label { font-size: $font-sm; color: $text-secondary; font-weight: 500; }
  .scenario-icon { margin-left: auto; font-size: 28rpx; }
}

.coach-text {
  font-size: $font-md;
  color: $text-primary;
  line-height: 1.6;
  margin-bottom: $spacing-md;
  display: block;
}

.coach-action {
  align-self: flex-end;
  padding: 14rpx 32rpx;
  border-radius: 32rpx;
  text-align: center;
  color: #fff;
  font-size: $font-sm;
  font-weight: 500;
  display: inline-block;
}
</style>
