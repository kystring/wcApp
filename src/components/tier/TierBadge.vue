<template>
  <view class="tier-badge" :style="{ background: tierBg }">
    <text class="tier-icon">{{ tierIcon }}</text>
    <text class="tier-name" :style="{ color: tierColor }">{{ tierName }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tier: { type: String, default: '青铜' },
  size: { type: String, default: 'normal' }
})

const TIER_CONFIG = {
  '青铜': { icon: '🥉', color: '#CD7F32', bg: '#F5E6D3' },
  '白银': { icon: '🥈', color: '#95A5A6', bg: '#E8ECED' },
  '黄金': { icon: '🥇', color: '#F1C40F', bg: '#FDF5D6' },
  '铂金': { icon: '💎', color: '#5DADE2', bg: '#E1F0FA' },
  '钻石': { icon: '💠', color: '#48C9B0', bg: '#D5F5E3' },
  '王者': { icon: '👑', color: '#9B59B6', bg: '#F0E6F6' }
}

const tierIcon = computed(() => TIER_CONFIG[props.tier]?.icon || '📚')
const tierColor = computed(() => TIER_CONFIG[props.tier]?.color || '#999')
const tierBg = computed(() => TIER_CONFIG[props.tier]?.bg || '#EEE')
const tierName = computed(() => props.tier)
</script>

<style lang="scss" scoped>
.tier-badge {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 24rpx;
  border-radius: 40rpx;
}

.tier-icon {
  font-size: 28rpx;
}

.tier-name {
  font-size: 24rpx;
  font-weight: 600;
}
</style>
