<template>
  <view class="empty-state">
    <text class="empty-icon">{{ icon }}</text>
    <text class="empty-title">{{ title }}</text>
    <text class="empty-desc" v-if="description">{{ description }}</text>
    <view class="empty-action" v-if="actionText" @tap="handleAction">
      <text class="action-text">{{ actionText }}</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  icon: { type: String, default: '📭' },
  title: { type: String, default: '暂无数据' },
  description: { type: String, default: '' },
  actionText: { type: String, default: '' }
})

const emit = defineEmits(['action'])

function handleAction() {
  emit('action')
}
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 64rpx;
}

.empty-icon {
  font-size: 96rpx;
  margin-bottom: $spacing-md;
}

.empty-title {
  font-size: $font-lg;
  color: $text-primary;
  font-weight: 600;
  margin-bottom: $spacing-xs;
}

.empty-desc {
  font-size: $font-sm;
  color: $text-secondary;
  text-align: center;
  margin-bottom: $spacing-lg;
}

.empty-action {
  background: $primary;
  border-radius: 40rpx;
  padding: 18rpx 48rpx;

  .action-text {
    color: #fff;
    font-size: $font-md;
  }
}
</style>
