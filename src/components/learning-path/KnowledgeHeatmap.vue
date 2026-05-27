<template>
  <view class="knowledge-heatmap">
    <text class="heatmap-title">📊 知识掌握热力图</text>
    <text class="heatmap-desc">错题越多，圆圈越大越红</text>
    <view class="heatmap-grid">
      <view
        v-for="point in data"
        :key="point.id"
        class="heatmap-point"
        :style="{
          width: point.radius * 2 + 'rpx',
          height: point.radius * 2 + 'rpx',
          backgroundColor: point.color,
          opacity: point.cleared ? 0.8 : 1
        }"
        @tap="handleTap(point)"
      >
        <text class="point-icon">{{ point.icon }}</text>
        <text class="point-name">{{ point.name }}</text>
        <text class="point-count" v-if="point.wrongCount > 0">{{ point.wrongCount }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] }
})

const emit = defineEmits(['select'])

function handleTap(point) {
  emit('select', point)
}
</script>

<style lang="scss" scoped>
.knowledge-heatmap {
  background: #fff;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin: $spacing-md $spacing-lg;
}

.heatmap-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: 4rpx;
}

.heatmap-desc {
  font-size: $font-xs;
  color: $text-hint;
  display: block;
  margin-bottom: $spacing-lg;
}

.heatmap-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20rpx;
  padding: $spacing-sm 0;
}

.heatmap-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: relative;
  min-width: 100rpx;
  min-height: 100rpx;
}

.point-icon {
  font-size: 32rpx;
}

.point-name {
  font-size: 20rpx;
  color: #fff;
  font-weight: 500;
  margin-top: 4rpx;
}

.point-count {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  background: #fff;
  color: $danger;
  font-size: 18rpx;
  font-weight: 700;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid $danger;
}
</style>
