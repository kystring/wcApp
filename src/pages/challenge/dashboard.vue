<template>
  <view class="dashboard-page">
    <!-- 顶部段位展示 -->
    <view class="tier-hero" :style="{ background: tierBg }">
      <view class="tier-display">
        <text class="tier-emoji">{{ tierEmoji }}</text>
        <text class="tier-title" :style="{ color: tierColor }">{{ currentTier }}</text>
      </view>
      <view class="tier-stats">
        <view class="stat-item">
          <text class="stat-value">{{ userStore.totalPoints }}</text>
          <text class="stat-label">总积分</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ tierStore.dailyPracticeCount }}</text>
          <text class="stat-label">今日训练</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ tierStore.getTotalWrongCount() }}</text>
          <text class="stat-label">错题数</text>
        </view>
      </view>
      <!-- 下一段位进度 -->
      <view class="tier-progress" v-if="userStore.nextTier">
        <text class="progress-label">距{{ userStore.nextTier }}</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: tierProgress + '%' }"></view>
        </view>
        <text class="progress-percent">{{ tierProgress }}%</text>
      </view>
    </view>

    <!-- 主要操作按钮 -->
    <view class="actions-section">
      <view class="action-card primary" @tap="startPractice">
        <text class="action-icon">📝</text>
        <view class="action-info">
          <text class="action-title">开始练习</text>
          <text class="action-desc">日常训练，巩固知识</text>
        </view>
        <text class="action-arrow">→</text>
      </view>

      <view class="action-card" :class="{ disabled: !canPromote }" @tap="startPromotion">
        <text class="action-icon">🚀</text>
        <view class="action-info">
          <text class="action-title">晋级挑战</text>
          <text class="action-desc">挑战下一段位</text>
        </view>
        <text class="action-arrow">→</text>
      </view>

      <view class="action-card" @tap="startRetry" v-if="tierStore.getTotalWrongCount() > 0">
        <text class="action-icon">🔄</text>
        <view class="action-info">
          <text class="action-title">错题重练</text>
          <text class="action-desc">清空错题本，稳步提升</text>
        </view>
        <view class="action-badge">
          <text>{{ tierStore.getTotalWrongCount() }}题</text>
        </view>
        <text class="action-arrow">→</text>
      </view>

      <!-- 继续答题 -->
      <view class="action-card" @tap="continueQuiz" v-if="tierStore.currentQuiz">
        <text class="action-icon">▶️</text>
        <view class="action-info">
          <text class="action-title">继续答题</text>
          <text class="action-desc">上次答题未完成，点击继续</text>
        </view>
        <text class="action-arrow">→</text>
      </view>
    </view>

    <!-- PK对战区 -->
    <view class="section-title">
      <text>⚔️ 竞技对战</text>
    </view>
    <view class="pk-section">
      <view class="pk-card" @tap="enterPk('1v1')">
        <text class="pk-icon">🤺</text>
        <text class="pk-title">1V1 对战</text>
        <text class="pk-desc">同段位匹配</text>
        <view class="pk-btn">开始匹配</view>
      </view>
      <view class="pk-card" @tap="enterPk('1v4')">
        <text class="pk-icon">⚔️</text>
        <text class="pk-title">1V4 乱斗</text>
        <text class="pk-desc">赢+30积分</text>
        <view class="pk-btn highlight">开始匹配</view>
      </view>
    </view>

    <!-- 荣誉展示 -->
    <view class="honor-section" v-if="honorStore.isDailyStar || honorStore.isWeeklyStar">
      <view class="section-title"><text>🏆 荣誉徽章</text></view>
      <view class="honor-card" v-if="honorStore.isDailyStar">
        <text class="honor-icon">⭐</text>
        <text class="honor-text">勤学之星 - 今日训练排名前10%</text>
      </view>
      <view class="honor-card" v-if="honorStore.isWeeklyStar">
        <text class="honor-icon">🌟</text>
        <text class="honor-text">进步之星 - 本周升段最快</text>
      </view>
    </view>

    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user.js'
import { useTierStore } from '@/stores/tier.js'
import { useHonorStore } from '@/stores/honor.js'
import { useAuthGuard } from '@/composables/useAuthGuard.js'

const userStore = useUserStore()
const tierStore = useTierStore()
const honorStore = useHonorStore()
const { checkAuth } = useAuthGuard()

onShow(() => {
  checkAuth()
})

const TIER_CONFIG = {
  '青铜': { emoji: '🥉', color: '#CD7F32', bg: 'linear-gradient(135deg, #F5E6D3, #E8D5B7)' },
  '白银': { emoji: '🥈', color: '#95A5A6', bg: 'linear-gradient(135deg, #E8ECED, #D5DBDB)' },
  '黄金': { emoji: '🥇', color: '#F1C40F', bg: 'linear-gradient(135deg, #FDF5D6, #F9E79F)' },
  '铂金': { emoji: '💎', color: '#5DADE2', bg: 'linear-gradient(135deg, #E1F0FA, #AED6F1)' },
  '钻石': { emoji: '💠', color: '#48C9B0', bg: 'linear-gradient(135deg, #D5F5E3, #A3E4D7)' },
  '王者': { emoji: '👑', color: '#9B59B6', bg: 'linear-gradient(135deg, #F0E6F6, #D2B4DE)' }
}

const config = computed(() => TIER_CONFIG[userStore.currentTier] || TIER_CONFIG['青铜'])
const tierEmoji = computed(() => config.value.emoji)
const tierColor = computed(() => config.value.color)
const tierBg = computed(() => config.value.bg)
const currentTier = computed(() => userStore.currentTier)
const canPromote = computed(() => userStore.nextTier !== null)
const tierProgress = computed(() => {
  const points = userStore.totalPoints
  const base = Math.floor(points / 100) * 100
  return Math.min(100, ((points - base) / 100) * 100)
})

function startPractice() {
  tierStore.startQuiz('practice', userStore.currentTier).then(() => {
    uni.navigateTo({ url: '/pages/challenge/quiz' })
  })
}

function startPromotion() {
  if (!canPromote.value) return
  tierStore.startQuiz('promotion', userStore.nextTier).then(() => {
    uni.navigateTo({ url: '/pages/challenge/quiz?mode=promotion' })
  })
}

function startRetry() {
  tierStore.retryQuiz()
  tierStore.startQuiz('retry', userStore.currentTier).then(() => {
    uni.navigateTo({ url: '/pages/challenge/quiz?mode=retry' })
  })
}

function continueQuiz() {
  uni.navigateTo({ url: '/pages/challenge/quiz' })
}

function enterPk(mode) {
  tierStore.enterPkLobby(mode)
  uni.navigateTo({ url: `/pages/challenge/pk-lobby?mode=${mode}` })
}

// 加载数据
honorStore.fetchDailyBoard()
tierStore.fetchDashboardData()
</script>

<style lang="scss" scoped>
.dashboard-page {
  min-height: 100vh;
  background: $bg-page;
}

.tier-hero {
  padding: 60rpx $spacing-lg 40rpx;
  text-align: center;
}

.tier-display {
  margin-bottom: $spacing-lg;

  .tier-emoji { font-size: 96rpx; display: block; margin-bottom: $spacing-sm; }
  .tier-title { font-size: $font-xxl; font-weight: 800; }
}

.tier-stats {
  display: flex;
  justify-content: center;
  gap: 64rpx;
  margin-bottom: $spacing-lg;
}

.stat-item {
  .stat-value { font-size: $font-xl; font-weight: 700; color: $text-primary; display: block; text-align: center; }
  .stat-label { font-size: $font-xs; color: $text-secondary; margin-top: 4rpx; display: block; }
}

.tier-progress {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: 0 32rpx;

  .progress-label { font-size: $font-xs; color: $text-secondary; white-space: nowrap; }
  .progress-bar { flex: 1; height: 8rpx; background: rgba(0,0,0,0.1); border-radius: 4rpx; overflow: hidden; }
  .progress-fill { height: 100%; background: $primary; border-radius: 4rpx; transition: width 0.3s; }
  .progress-percent { font-size: $font-xs; color: $primary; font-weight: 600; min-width: 56rpx; }
}

.actions-section {
  padding: $spacing-md $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.action-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  gap: $spacing-md;
  box-shadow: $shadow-sm;

  &.primary { border-left: 6rpx solid $primary; }
  &.disabled { opacity: 0.5; }

  .action-icon { font-size: 44rpx; }
  .action-info { flex: 1; }
  .action-title { font-size: $font-lg; font-weight: 600; color: $text-primary; display: block; }
  .action-desc { font-size: $font-sm; color: $text-secondary; margin-top: 4rpx; display: block; }
  .action-arrow { font-size: $font-lg; color: $text-hint; }
  .action-badge { background: $danger; color: #fff; font-size: $font-xs; padding: 4rpx 16rpx; border-radius: 20rpx; }
}

.section-title {
  padding: $spacing-lg $spacing-lg $spacing-sm;
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
}

.pk-section {
  display: flex;
  gap: $spacing-md;
  padding: 0 $spacing-lg;
}

.pk-card {
  flex: 1;
  background: #fff;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  text-align: center;
  box-shadow: $shadow-sm;

  .pk-icon { font-size: 48rpx; display: block; margin-bottom: $spacing-sm; }
  .pk-title { font-size: $font-lg; font-weight: 600; color: $text-primary; display: block; }
  .pk-desc { font-size: $font-xs; color: $text-secondary; display: block; margin-bottom: $spacing-md; }

  .pk-btn {
    background: $bg-page;
    padding: 14rpx 0;
    border-radius: 32rpx;
    font-size: $font-sm;
    color: $primary;
    font-weight: 500;

    &.highlight { background: $primary; color: #fff; }
  }
}

.honor-section {
  padding: $spacing-lg;
}

.honor-card {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  background: linear-gradient(135deg, #FFF9E6, #FFF3CD);
  padding: $spacing-md $spacing-lg;
  border-radius: $border-radius;
  margin-bottom: $spacing-sm;

  .honor-icon { font-size: 36rpx; }
  .honor-text { font-size: $font-sm; color: #856404; font-weight: 500; }
}
</style>
