<template>
  <view class="honor-board-page">
    <view class="tab-bar">
      <view class="tab" :class="{ active: activeTab === 'daily' }" @tap="switchTab('daily')">日榜（勤学之星）</view>
      <view class="tab" :class="{ active: activeTab === 'weekly' }" @tap="switchTab('weekly')">周榜（进步之星）</view>
    </view>

    <view class="board-list">
      <view v-for="(item, idx) in currentBoard" :key="item.userId"
        class="board-item" :class="{ 'is-me': item.isMe, 'top-three': idx < 3 }">
        <view class="rank-badge" :class="'rank-' + (idx + 1)">
          <text>{{ idx < 3 ? ['🥇','🥈','🥉'][idx] : idx + 1 }}</text>
        </view>
        <view class="player-avatar">
          <text class="avatar-text">👤</text>
        </view>
        <view class="player-info">
          <text class="player-name">{{ item.name }}{{ item.isMe ? '（我）' : '' }}</text>
          <t-tier-badge :tier="item.tier" />
        </view>
        <view class="player-score">
          <text class="score-num">{{ activeTab === 'daily' ? item.practiceCount : item.weeklyProgress }}</text>
          <text class="score-unit">{{ activeTab === 'daily' ? '次训练' : '分进步' }}</text>
        </view>
      </view>
    </view>

    <!-- 我的排名 -->
    <view class="my-rank" v-if="userStore.rank">
      <text>我的排名：第{{ activeTab === 'daily' ? honorStore.userRank.daily : honorStore.userRank.weekly }}名</text>
    </view>

    <c-loading-overlay :visible="honorStore.isLoading" text="加载中..." />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHonorStore } from '@/stores/honor.js'
import TierBadge from '@/components/tier/TierBadge.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const honorStore = useHonorStore()

const activeTab = ref('daily')
const currentBoard = computed(() => activeTab.value === 'daily' ? honorStore.dailyBoard : honorStore.weeklyBoard)

function switchTab(tab) { activeTab.value = tab }

onMounted(() => {
  honorStore.fetchDailyBoard()
  honorStore.fetchWeeklyBoard()
})
</script>

<style lang="scss" scoped>
.honor-board-page { min-height: 100vh; background: $bg-page; }
.tab-bar { display: flex; background: #fff; border-bottom: 1rpx solid $border-color; }
.tab { flex: 1; text-align: center; padding: $spacing-lg 0; font-size: $font-md; color: $text-secondary; position: relative; }
.tab.active { color: $primary; font-weight: 600; }
.tab.active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60rpx; height: 4rpx; background: $primary; border-radius: 2rpx; }
.board-list { padding: $spacing-md; }
.board-item { background: #fff; border-radius: $border-radius-lg; padding: $spacing-md $spacing-lg; display: flex; align-items: center; gap: $spacing-md; margin-bottom: $spacing-sm; }
.board-item.is-me { border: 2rpx solid $primary; background: rgba(231,76,60,0.02); }
.board-item.top-three { border-left: 6rpx solid $warning; }
.rank-badge { width: 56rpx; height: 56rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: $font-sm; font-weight: 700; background: $bg-page; color: $text-secondary; }
.rank-badge.rank-1, .rank-badge.rank-2, .rank-badge.rank-3 { font-size: 36rpx; background: none; }
.player-avatar { width: 64rpx; height: 64rpx; border-radius: 50%; background: $bg-page; display: flex; align-items: center; justify-content: center; }
.avatar-text { font-size: 36rpx; }
.player-info { flex: 1; }
.player-name { font-size: $font-md; font-weight: 500; color: $text-primary; display: block; margin-bottom: 4rpx; }
.player-score { text-align: right; }
.score-num { font-size: $font-lg; font-weight: 700; color: $text-primary; display: block; }
.score-unit { font-size: $font-xs; color: $text-secondary; }
.my-rank { text-align: center; padding: $spacing-lg; font-size: $font-md; color: $text-secondary; background: #fff; margin: $spacing-lg; border-radius: $border-radius-lg; }
</style>
