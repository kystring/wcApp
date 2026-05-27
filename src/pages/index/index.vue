<template>
  <view class="home-page">
    <!-- 顶栏 -->
    <view class="home-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="user-greeting">
          <text class="greeting-text">👋 你好，{{ userStore.nickname }}</text>
          <t-tier-badge :tier="userStore.currentTier" />
        </view>
        <view class="header-stats">
          <view class="stat-item">
            <text class="stat-num">{{ userStore.consecutiveLoginDays }}</text>
            <text class="stat-unit">连续打卡</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ userStore.totalPoints }}</text>
            <text class="stat-unit">总积分</text>
          </view>
          <view class="stat-item">
            <text class="stat-num">{{ tierStore.dailyPracticeCount }}</text>
            <text class="stat-unit">今日训练</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="home-body" @scrolltolower="loadMore">
      <!-- AI教练消息 -->
      <lp-coach-message
        :message="lpStore.aiSuggestion"
        @action="handleCoachAction"
      />

      <!-- 知识热力图 -->
      <lp-knowledge-heatmap
        :data="lpStore.heatmapData"
        @select="handleHeatmapSelect"
      />

      <!-- 同伴动态 -->
      <lp-peer-anchor
        :highestTier="lpStore.peerData.highestTier"
        :friends="lpStore.peerData.friends"
      />

      <!-- 快捷入口 -->
      <view class="quick-actions">
        <text class="section-label">⚡ 快捷入口</text>
        <view class="actions-grid">
          <view class="quick-card" @tap="goPage('/pages/challenge/quiz')">
            <text class="quick-icon">📝</text>
            <text class="quick-text">每日练习</text>
          </view>
          <view class="quick-card" @tap="goPage('/pages/poetry/dictation-list')">
            <text class="quick-icon">✍️</text>
            <text class="quick-text">古诗默写</text>
          </view>
          <view class="quick-card" @tap="goPage('/pages/writing/practical-guide')">
            <text class="quick-icon">📋</text>
            <text class="quick-text">应用文</text>
          </view>
          <view class="quick-card" @tap="goPage('/pages/profile/wrong-book')">
            <text class="quick-icon">📕</text>
            <text class="quick-text">错题本</text>
          </view>
        </view>
      </view>

      <view class="safe-area-bottom"></view>
    </scroll-view>

    <c-loading-overlay :visible="lpStore.isLoading" text="加载中..." />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user.js'
import { useTierStore } from '@/stores/tier.js'
import { useLearningPathStore } from '@/stores/learning-path.js'
import { useAuthGuard } from '@/composables/useAuthGuard.js'
import TierBadge from '@/components/tier/TierBadge.vue'
import KnowledgeHeatmap from '@/components/learning-path/KnowledgeHeatmap.vue'
import CoachMessage from '@/components/learning-path/CoachMessage.vue'
import PeerAnchor from '@/components/learning-path/PeerAnchor.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const userStore = useUserStore()
const tierStore = useTierStore()
const lpStore = useLearningPathStore()

const statusBarHeight = ref(20)

uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 20
  }
})

function handleCoachAction() {
  const route = lpStore.aiSuggestion?.actionRoute
  if (route) uni.navigateTo({ url: route })
}

function handleHeatmapSelect(point) {
  if (point.wrongCount > 0) {
    uni.navigateTo({ url: `/pages/challenge/quiz?examPoint=${point.id}` })
  }
}

function goPage(url) {
  uni.navigateTo({ url })
}

function loadMore() {
  // Placeholder for pagination
}

onShow(() => {
  useAuthGuard().checkAuth()
})

onMounted(() => {
  lpStore.fetchHeatmapData()
  lpStore.fetchAiSuggestion()
  lpStore.fetchPeerData()
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: $bg-page;
}

.home-header {
  background: linear-gradient(135deg, $primary, $primary-dark);
  padding-bottom: 48rpx;
}

.header-content {
  padding: $spacing-lg;
}

.user-greeting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.greeting-text {
  font-size: $font-xl;
  color: #fff;
  font-weight: 600;
}

.header-stats {
  display: flex;
  gap: 48rpx;
}

.stat-item {
  .stat-num { font-size: $font-xl; color: #fff; font-weight: 700; display: block; }
  .stat-unit { font-size: $font-xs; color: rgba(255,255,255,0.7); display: block; margin-top: 4rpx; }
}

.home-body {
  margin-top: -16rpx;
  border-radius: $border-radius-lg $border-radius-lg 0 0;
  background: $bg-page;
}

.quick-actions {
  padding: $spacing-lg;
}

.section-label {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: $spacing-md;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-sm;
}

.quick-card {
  background: #fff;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  text-align: center;
  box-shadow: $shadow-sm;

  .quick-icon { font-size: 44rpx; display: block; margin-bottom: $spacing-xs; }
  .quick-text { font-size: $font-sm; color: $text-primary; font-weight: 500; }
}
</style>
