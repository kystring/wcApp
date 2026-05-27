<template>
  <view class="register-page">
    <view class="register-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <text class="header-back" @tap="goLogin">← 返回</text>
      <text class="header-title">注册账号</text>
    </view>

    <view class="register-form">
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
        <text class="form-label">昵称</text>
        <input
          class="form-input"
          v-model="form.nickname"
          type="text"
          placeholder="给自己起个名字吧"
          placeholder-style="color: #bbb"
          maxlength="12"
        />
      </view>

      <view class="form-group">
        <text class="form-label">密码</text>
        <input
          class="form-input"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请设置密码（至少6位）"
          placeholder-style="color: #bbb"
          maxlength="20"
        />
      </view>

      <view class="form-group">
        <text class="form-label">确认密码</text>
        <input
          class="form-input"
          v-model="form.confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请再次输入密码"
          placeholder-style="color: #bbb"
          maxlength="20"
        />
        <text class="password-toggle" @tap="showPassword = !showPassword">
          {{ showPassword ? '🙈' : '👁️' }}
        </text>
      </view>

      <button
        class="register-btn"
        :disabled="isLoading"
        @tap="handleRegister"
      >
        {{ isLoading ? '注册中...' : '注 册' }}
      </button>
    </view>

    <view class="login-link" @tap="goLogin">
      <text>已有账号？</text><text class="link-text">去登录</text>
    </view>

    <c-loading-overlay :visible="isLoading" text="注册中..." />
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
  nickname: '',
  password: '',
  confirmPassword: ''
})

onLoad(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 20
})

async function handleRegister() {
  if (!form.studentId.trim() || !form.nickname.trim() || !form.password || !form.confirmPassword) {
    uni.showToast({ title: '请填写所有字段', icon: 'none' })
    return
  }
  if (form.password.length < 6) {
    uni.showToast({ title: '密码至少6位', icon: 'none' })
    return
  }
  if (form.password !== form.confirmPassword) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }
  isLoading.value = true
  const result = await userStore.register(form.studentId.trim(), form.password, form.nickname.trim())
  isLoading.value = false
  if (result.success) {
    uni.showToast({ title: '注册成功！', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 800)
  } else {
    uni.showToast({ title: result.message, icon: 'none' })
  }
}

function goLogin() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: $bg-page;
  display: flex;
  flex-direction: column;
}
.register-header {
  background: linear-gradient(135deg, $primary, $primary-dark);
  padding: 40rpx $spacing-lg 40rpx;
  display: flex;
  align-items: center;
  gap: $spacing-md;
}
.header-back {
  font-size: $font-md;
  color: rgba(255,255,255,0.9);
}
.header-title {
  font-size: $font-xl;
  font-weight: 700;
  color: #fff;
}
.register-form {
  padding: 60rpx $spacing-xl 0;
}
.form-group {
  margin-bottom: $spacing-lg;
  position: relative;
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
.password-toggle {
  position: absolute;
  right: $spacing-md;
  bottom: 24rpx;
  font-size: 36rpx;
}
.register-btn {
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
.register-btn[disabled] {
  opacity: 0.7;
}
.login-link {
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
