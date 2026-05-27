<template>
  <view class="peer-anchor">
    <text class="peer-title">👥 同伴动态</text>
    <scroll-view scroll-x class="peer-scroll">
      <view class="peer-card highlight" v-if="highestTier">
        <text class="peer-avatar">🏆</text>
        <text class="peer-name">全班最高</text>
        <text class="peer-tier-text">{{ highestTier }}</text>
      </view>
      <view
        v-for="friend in friends"
        :key="friend.id"
        class="peer-card"
      >
        <text class="peer-avatar">👤</text>
        <text class="peer-name">{{ friend.name }}</text>
        <t-tier-badge :tier="friend.tier" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import TierBadge from '@/components/tier/TierBadge.vue'

defineProps({
  highestTier: { type: String, default: '' },
  friends: { type: Array, default: () => [] }
})
</script>

<style lang="scss" scoped>
.peer-anchor {
  background: #fff;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin: $spacing-md $spacing-lg;
}

.peer-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-md;
}

.peer-scroll {
  display: flex;
  white-space: nowrap;
}

.peer-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-sm $spacing-md;
  margin-right: $spacing-md;
  background: $bg-page;
  border-radius: $border-radius;
  min-width: 140rpx;

  &.highlight {
    background: linear-gradient(135deg, #FDF5D6, #FFF3CD);
    border: 2rpx solid $warning;
  }

  .peer-avatar { font-size: 40rpx; margin-bottom: 8rpx; }
  .peer-name { font-size: $font-xs; color: $text-secondary; margin-bottom: 8rpx; }
  .peer-tier-text { font-size: $font-xs; color: $warning; font-weight: 600; }
}
</style>
