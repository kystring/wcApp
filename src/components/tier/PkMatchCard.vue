<template>
  <view class="pk-match-card" :class="{ 'is-ai': opponent?.isAI }">
    <image class="opponent-avatar" :src="opponent?.avatar || defaultAvatar" mode="aspectFill" />
    <view class="opponent-info">
      <text class="opponent-name">{{ opponent?.name || '匹配中...' }}</text>
      <view class="opponent-tier">
        <t-tier-badge :tier="opponent?.tier || '青铜'" v-if="opponent" />
        <text class="searching-text" v-else>正在寻找对手...</text>
      </view>
    </view>
    <view class="match-status" v-if="opponent">
      <text class="status-label" v-if="opponent.isAI">AI对手</text>
      <text class="status-label real" v-else>真实玩家</text>
    </view>
    <view class="searching-indicator" v-else>
      <view class="dot-pulse"></view>
    </view>
  </view>
</template>

<script setup>
import TierBadge from './TierBadge.vue'

defineProps({
  opponent: { type: Object, default: null }
})

const defaultAvatar = '/static/images/icons/default-avatar.png'
</script>

<style lang="scss" scoped>
.pk-match-card {
  background: #fff;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-md;

  &.is-ai {
    border: 2rpx dashed $border-color;
  }
}

.opponent-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: $bg-page;
}

.opponent-info {
  flex: 1;

  .opponent-name {
    font-size: $font-lg;
    font-weight: 600;
    color: $text-primary;
    display: block;
    margin-bottom: 8rpx;
  }
}

.status-label {
  font-size: $font-xs;
  color: $warning;
  background: rgba(243, 156, 18, 0.1);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;

  &.real { color: $success; background: rgba(39, 174, 96, 0.1); }
}

.searching-text {
  font-size: $font-sm;
  color: $text-hint;
}

.searching-indicator {
  .dot-pulse {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: $primary;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.6); }
}
</style>
