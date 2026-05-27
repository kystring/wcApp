<template>
  <view class="login-page">
    <view class="login-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <text class="header-title">语文闯关</text>
      <text class="header-subtitle">中职语文分层学习平台</text>
    </view>

    <view class="login-form">
      <view class="form-group">
        <text class="form-label">学号</text>
        <input
          class="form-input"
          v-model="form.studentId"
          type="text"
          placeholder="请输入学号"
          placeholder-style="color: #bbb"
          maxlength="20"
        />
      </view>

      <view class="form-group">
        <text class="form-label">密码</text>
        <view class="password-wrapper">
          <input
            class="form-input password-input"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            placeholder-style="color: #bbb"
            maxlength="20"
          />
          <text class="password-toggle" @tap="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </text>
        </view>
      </view>

      <button
        class="login-btn"
        :disabled="isLoading"
        @tap="handleLogin"
      >
        {{ isLoading ? '登录中...' : '登 录' }}
      </button>

      <view class="demo-section">
        <text class="demo-divider">——— 或 ———</text>
        <view class="demo-card" @tap="quickLogin">
          <text class="demo-icon">🎓</text>
          <view class="demo-info">
            <text class="demo-title">一键体验</text>
            <text class="demo-desc">学号 2024001，无需密码</text>
          </view>
          <text class="demo-arrow">→</text>
        </view>
      </view>
    </view>

    <view class="register-link" @tap="goRegister">
      <text>还没有账号？</text><text class="link-text">立即注册</text>
    </view>

    <c-loading-overlay :visible="isLoading" text="登录中..." />
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { onLoad } from '@dcloudio/uni-app'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const userStore = useUserStore()
const statusBarHeight = ref(20)
const showPassword = ref(false)
const isLoading = ref(false)

const form = reactive({
  studentId: '',
  password: ''
})

onLoad(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 20
})

async function handleLogin() {
  if (!form.studentId.trim() || !form.password.trim()) {
    uni.showToast({ title: '请输入学号和密码', icon: 'none' })
    return
  }
  isLoading.value = true
  const result = await userStore.login(form.studentId.trim(), form.password)
  isLoading.value = false
  if (result.success) {
    uni.reLaunch({ url: '/pages/index/index' })
  } else {
    uni.showToast({ title: result.message, icon: 'none' })
  }
}

async function quickLogin() {
  isLoading.value = true
  const result = await userStore.login('2024001', '123456')
  isLoading.value = false
  if (result.success) {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

function goRegister() {
  uni.navigateTo({ url: '/pages/register/index' })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: $bg-page;
  display: flex;
  flex-direction: column;
}
.login-header {
  background: linear-gradient(135deg, $primary, $primary-dark);
  padding: 80rpx 0 60rpx;
  text-align: center;
}
.header-title {
  font-size: 56rpx;
  font-weight: 800;
  color: #fff;
  display: block;
  letter-spacing: 8rpx;
}
.header-subtitle {
  font-size: $font-sm;
  color: rgba(255,255,255,0.8);
  display: block;
  margin-top: $spacing-sm;
}
.login-form {
  padding: 80rpx $spacing-xl 0;
}
.form-group {
  margin-bottom: $spacing-lg;
}
.form-label {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-sm;
}
.form-input {
  width: 100%;
  height: 96rpx;
  background: #fff;
  border-radius: $border-radius;
  padding: 0 $spacing-md;
  font-size: $font-md;
  color: $text-primary;
  box-sizing: border-box;
  box-shadow: $shadow-sm;
}
.password-wrapper {
  position: relative;
}
.password-input {
  padding-right: 80rpx;
}
.password-toggle {
  position: absolute;
  right: $spacing-md;
  top: 50%;
  transform: translateY(-50%);
  font-size: 36rpx;
}
.login-btn {
  width: 100%;
  height: 96rpx;
  background: $primary;
  color: #fff;
  font-size: $font-lg;
  font-weight: 600;
  border-radius: 48rpx;
  margin-top: 40rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-btn[disabled] {
  opacity: 0.7;
}
.demo-section {
  margin-top: 48rpx;
}
.demo-divider {
  display: block;
  text-align: center;
  font-size: $font-xs;
  color: $text-hint;
  margin-bottom: $spacing-lg;
}
.demo-card {
  background: rgba(231, 76, 60, 0.06);
  border: 2rpx dashed rgba(231, 76, 60, 0.3);
  border-radius: $border-radius-lg;
  padding: $spacing-md $spacing-lg;
  display: flex;
  align-items: center;
  gap: $spacing-md;
}
.demo-icon {
  font-size: 44rpx;
}
.demo-info {
  flex: 1;
}
.demo-title {
  font-size: $font-md;
  font-weight: 600;
  color: $primary;
  display: block;
}
.demo-desc {
  font-size: $font-xs;
  color: $text-secondary;
  display: block;
  margin-top: 4rpx;
}
.demo-arrow {
  font-size: $font-lg;
  color: $primary;
}
.register-link {
  text-align: center;
  margin-top: $spacing-xl;
  font-size: $font-sm;
  color: $text-secondary;
}
.link-text {
  color: $primary;
  font-weight: 500;
  margin-left: 4rpx;
}
</style>
