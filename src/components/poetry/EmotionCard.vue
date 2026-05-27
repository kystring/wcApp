<template>
  <view class="emotion-card" :style="{ borderColor: color }" @tap="handleTap">
    <text class="emotion-emoji">{{ emoji }}</text>
    <text class="emotion-name" :style="{ color }">{{ name }}</text>
    <text class="emotion-preview">{{ preview }}</text>
  </view>
</template>

<script setup>
const props = defineProps({
  emoji: String,
  name: String,
  color: String,
  preview: String,
  categoryId: String
})
const emit = defineEmits(['tap'])
function handleTap() { emit('tap', props.categoryId) }
</script>

<style lang="scss" scoped>
.emotion-card {
  background: #fff;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  border-left: 8rpx solid;
  margin-bottom: $spacing-md;
  box-shadow: $shadow-sm;
}
.emotion-emoji { font-size: 48rpx; display: block; margin-bottom: 8rpx; }
.emotion-name { font-size: $font-lg; font-weight: 700; display: block; margin-bottom: 8rpx; }
.emotion-preview { font-size: $font-sm; color: $text-secondary; display: block; font-style: italic; }
</style>
