<template>
  <view class="app-navbar" :style="{ paddingTop: statusBarHeight + 'px', backgroundColor: bgColor }">
    <view class="navbar-content" :style="{ height: navHeight + 'px' }">
      <view class="navbar-left" @tap="handleBack" v-if="showBack">
        <text class="back-icon">←</text>
      </view>
      <view class="navbar-title">
        <text class="title-text">{{ title }}</text>
      </view>
      <view class="navbar-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
  <view class="navbar-placeholder" :style="{ height: (statusBarHeight + navHeight) + 'px' }"></view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  bgColor: { type: String, default: '#FFFFFF' },
  showBack: { type: Boolean, default: false }
})

const emit = defineEmits(['back'])

const statusBarHeight = ref(20)
const navHeight = ref(44)

// 获取系统信息设置导航栏高度
uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 20
    // 胶囊按钮位置适配
    if (res.platform === 'android' || res.platform === 'ios') {
      navHeight.value = 44
    }
  }
})

function handleBack() {
  emit('back')
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 32rpx;
}

.navbar-left {
  position: absolute;
  left: 32rpx;
  width: 80rpx;
  height: 44px;
  display: flex;
  align-items: center;
}

.back-icon {
  font-size: 36rpx;
  color: $text-primary;
  font-weight: bold;
}

.navbar-title {
  .title-text {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
  }
}

.navbar-right {
  position: absolute;
  right: 32rpx;
}
</style>
