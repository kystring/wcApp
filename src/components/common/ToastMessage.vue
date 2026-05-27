<template>
  <view class="toast-overlay" v-if="visible">
    <view class="toast-card" :class="type">
      <text class="toast-text">{{ message }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'info' },
  duration: { type: Number, default: 2000 },
  show: { type: Boolean, default: false }
})

const visible = ref(false)
let timer = null

watch(() => props.show, (newVal) => {
  if (newVal) {
    visible.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style lang="scss" scoped>
.toast-overlay {
  position: fixed;
  top: 200rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
}

.toast-card {
  padding: 20rpx 40rpx;
  border-radius: 40rpx;
  background: rgba(0, 0, 0, 0.75);

  &.info { background: rgba(0, 0, 0, 0.75); }
  &.success { background: rgba(39, 174, 96, 0.9); }
  &.warning { background: rgba(243, 156, 18, 0.9); }
  &.error { background: rgba(231, 76, 60, 0.9); }
}

.toast-text {
  color: #fff;
  font-size: $font-md;
}
</style>
