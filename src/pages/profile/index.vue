<template>
  <view class="profile-page">
    <!-- 头部 -->
    <view class="profile-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="user-info">
        <view class="avatar">
          <text class="avatar-emoji">👤</text>
        </view>
        <view class="user-detail">
          <text class="nickname">{{ userStore.nickname }}</text>
          <t-tier-badge :tier="userStore.currentTier" />
        </view>
      </view>
      <view class="user-stats">
        <view class="stat-item">
          <text class="stat-value">{{ userStore.totalPoints }}</text>
          <text class="stat-label">总积分</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ userStore.consecutiveLoginDays }}天</text>
          <text class="stat-label">连续打卡</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ tierStore.getTotalWrongCount() }}</text>
          <text class="stat-label">待清错题</text>
        </view>
      </view>
    </view>

    <!-- 卡片区域 -->
    <view class="cards-section">
      <!-- 段位保护卡 -->
      <view class="card-item" @tap="claimProtection">
        <text class="card-icon">🛡️</text>
        <view class="card-info">
          <text class="card-title">段位保护卡</text>
          <text class="card-desc">剩余 {{ userStore.protectionCards }} 张 · 每周可领1张</text>
        </view>
        <text class="card-action" v-if="honorStore.canClaimProtectionCard">领取</text>
        <text class="card-action disabled" v-else>已领</text>
      </view>

      <!-- 免做卡 -->
      <view class="card-item">
        <text class="card-icon">🎫</text>
        <view class="card-info">
          <text class="card-title">免做卡</text>
          <text class="card-desc">剩余 {{ userStore.skipCards }} 张 · 清空一个考点错题即可兑换</text>
        </view>
      </view>
    </view>

    <!-- 菜单 -->
    <view class="menu-section">
      <view class="menu-item" @tap="goPage('/pages/profile/honor-board')">
        <text class="menu-icon">🏆</text>
        <text class="menu-text">荣誉榜</text>
        <text class="menu-badge" v-if="honorStore.isDailyStar || honorStore.isWeeklyStar">⭐</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item" @tap="goPage('/pages/profile/wrong-book')">
        <text class="menu-icon">📕</text>
        <text class="menu-text">错题本</text>
        <text class="menu-count">{{ tierStore.getTotalWrongCount() }}题</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">📊</text>
        <text class="menu-text">学习报告</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">→</text>
      </view>
      <view class="menu-item logout-item" @tap="showLogoutModal = true">
        <text class="menu-icon">🚪</text>
        <text class="menu-text logout-text">退出登录</text>
        <text class="menu-arrow">→</text>
      </view>
    </view>

    <c-confirm-modal
      :visible="showLogoutModal"
      title="退出登录"
      content="确定要退出当前账号吗？"
      confirm-text="确定"
      cancel-text="取消"
      @confirm="confirmLogout"
      @cancel="showLogoutModal = false"
    />

    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user.js'
import { useTierStore } from '@/stores/tier.js'
import { useHonorStore } from '@/stores/honor.js'
import TierBadge from '@/components/tier/TierBadge.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { useAuthGuard } from '@/composables/useAuthGuard.js'

const userStore = useUserStore()
const tierStore = useTierStore()
const honorStore = useHonorStore()
const { checkAuth } = useAuthGuard()

const statusBarHeight = ref(20)
const showLogoutModal = ref(false)
uni.getSystemInfo({ success: res => { statusBarHeight.value = res.statusBarHeight || 20 } })

onShow(() => {
  checkAuth()
})

function goPage(url) { uni.navigateTo({ url }) }

function claimProtection() {
  if (honorStore.canClaimProtectionCard) {
    if (honorStore.claimProtectionCard()) {
      uni.showToast({ title: '领取成功！', icon: 'success' })
    }
  }
}

function confirmLogout() {
  showLogoutModal.value = false
  userStore.logout()
  uni.reLaunch({ url: '/pages/login/index' })
}
</script>

<style lang="scss" scoped>
.profile-page { min-height: 100vh; background: $bg-page; }
.profile-header { background: linear-gradient(135deg, $primary, $primary-dark); padding: $spacing-xl $spacing-lg; }
.user-info { display: flex; align-items: center; gap: $spacing-md; margin-bottom: $spacing-lg; }
.avatar { width: 96rpx; height: 96rpx; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; }
.avatar-emoji { font-size: 52rpx; }
.nickname { font-size: $font-xl; color: #fff; font-weight: 700; display: block; margin-bottom: $spacing-xs; }
.user-stats { display: flex; gap: 48rpx; }
.stat-item { .stat-value { font-size: $font-xl; color: #fff; font-weight: 700; display: block; } .stat-label { font-size: $font-xs; color: rgba(255,255,255,0.7); } }
.cards-section { padding: $spacing-lg; }
.card-item { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; display: flex; align-items: center; gap: $spacing-md; margin-bottom: $spacing-sm; box-shadow: $shadow-sm; }
.card-icon { font-size: 44rpx; }
.card-info { flex: 1; }
.card-title { font-size: $font-md; font-weight: 600; color: $text-primary; display: block; }
.card-desc { font-size: $font-xs; color: $text-secondary; display: block; margin-top: 4rpx; }
.card-action { font-size: $font-sm; color: $primary; font-weight: 600; padding: 8rpx 24rpx; border-radius: 24rpx; background: rgba(231,76,60,0.08); }
.card-action.disabled { color: $text-hint; background: $bg-page; }
.menu-section { margin: 0 $spacing-lg; background: #fff; border-radius: $border-radius-lg; overflow: hidden; }
.menu-item { display: flex; align-items: center; gap: $spacing-md; padding: $spacing-lg; border-bottom: 1rpx solid $border-color; }
.menu-item:last-child { border-bottom: none; }
.menu-icon { font-size: 36rpx; }
.menu-text { flex: 1; font-size: $font-md; color: $text-primary; }
.menu-count { font-size: $font-xs; color: $danger; background: rgba(231,76,60,0.08); padding: 4rpx 16rpx; border-radius: 20rpx; }
.menu-badge { font-size: 28rpx; }
.menu-arrow { font-size: $font-lg; color: $text-hint; }
.logout-item { margin-top: 0; }
.logout-text { color: $danger; }
</style>
