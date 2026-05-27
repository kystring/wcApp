<template>
  <view class="pk-lobby-page">
    <view class="lobby-header">
      <text class="lobby-title">{{ modeLabel }}</text>
      <text class="lobby-desc">{{ modeDesc }}</text>
    </view>

    <!-- 对手卡片 -->
    <view class="opponents-section">
      <view v-for="(opp, idx) in opponents" :key="opp?.id || idx">
        <t-pk-match-card :opponent="opp" />
      </view>
      <t-pk-match-card v-if="opponents.length === 0" :opponent="null" />
    </view>

    <!-- 匹配状态 -->
    <view class="match-status-section" v-if="matchState === 'searching'">
      <text class="searching-title">正在匹配中...</text>
      <text class="searching-time">已等待 {{ matchSeconds }}s</text>
      <view class="match-tip" v-if="matchSeconds >= 10">
        <text>超过15秒将自动匹配AI对手</text>
      </view>
    </view>

    <view class="match-status-section" v-if="matchState === 'found'">
      <text class="found-title">🎯 找到对手！</text>
      <button class="start-battle-btn" @tap="startBattle">开始对战</button>
    </view>

    <!-- 取消按钮 -->
    <view class="cancel-section" v-if="matchState === 'searching'">
      <button class="cancel-btn" @tap="cancelMatch">取消匹配</button>
    </view>

    <c-loading-overlay :visible="isLoading" text="匹配中..." />
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTierStore } from '@/stores/tier.js'
import PkMatchCard from '@/components/tier/PkMatchCard.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const tierStore = useTierStore()
const matchState = ref('searching')
const matchSeconds = ref(0)
const opponents = ref([])
const isLoading = ref(false)
let matchTimer = null
let countTimer = null

const mode = computed(() => tierStore.pkMode || '1v1')
const modeLabel = computed(() => mode.value === '1v1' ? '🤺 1V1 对战' : '⚔️ 1V4 乱斗')
const modeDesc = computed(() => mode.value === '1v1' ? '同段位匹配，赢+10积分' : '多人混战，第一名+30积分')

function startMatch() {
  matchState.value = 'searching'
  matchSeconds.value = 0

  countTimer = setInterval(() => {
    matchSeconds.value++
    if (matchSeconds.value >= 15 && matchState.value === 'searching') {
      // Auto AI match
      performMatch(true)
    }
  }, 1000)

  // Start matching with variable delay
  const delay = 1500 + Math.random() * 5000
  matchTimer = setTimeout(() => {
    performMatch(false)
  }, delay)
}

async function performMatch(forceAI) {
  if (matchState.value !== 'searching') return
  clearInterval(countTimer)
  isLoading.value = true

  const opponent = await tierStore.findPkOpponent()
  opponents.value = Array.isArray(opponent) ? opponent : [opponent]
  matchState.value = 'found'
  isLoading.value = false
}

function startBattle() {
  uni.redirectTo({ url: '/pages/challenge/pk-battle' })
}

function cancelMatch() {
  clearInterval(countTimer)
  clearTimeout(matchTimer)
  tierStore.leavePk()
  uni.navigateBack()
}

onMounted(() => {
  startMatch()
})

onUnmounted(() => {
  clearInterval(countTimer)
  clearTimeout(matchTimer)
})
</script>

<style lang="scss" scoped>
.pk-lobby-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #2C3E50 0%, #34495E 100%);
  padding: 120rpx $spacing-lg 0;
}

.lobby-header {
  text-align: center;
  margin-bottom: 64rpx;

  .lobby-title { font-size: $font-xxl; font-weight: 800; color: #fff; display: block; margin-bottom: $spacing-sm; }
  .lobby-desc { font-size: $font-sm; color: rgba(255,255,255,0.6); display: block; }
}

.opponents-section {
  margin-bottom: 64rpx;
}

.match-status-section {
  text-align: center;
  padding: $spacing-xl;
}

.searching-title { font-size: $font-lg; color: #fff; display: block; margin-bottom: $spacing-sm; }
.searching-time { font-size: $font-xl; color: $primary; font-weight: 700; display: block; margin-bottom: $spacing-md; }
.match-tip { font-size: $font-xs; color: rgba(255,255,255,0.5); }

.found-title { font-size: $font-xl; color: $success; font-weight: 700; display: block; margin-bottom: $spacing-lg; }

.start-battle-btn {
  background: $primary;
  color: #fff;
  font-size: $font-lg;
  font-weight: 600;
  padding: 28rpx 0;
  border-radius: 48rpx;
  width: 400rpx;
  margin: 0 auto;
}

.cancel-section {
  text-align: center;
  margin-top: 64rpx;

  .cancel-btn {
    color: rgba(255,255,255,0.6);
    font-size: $font-sm;
    padding: 20rpx 48rpx;
    border: 2rpx solid rgba(255,255,255,0.2);
    border-radius: 40rpx;
    display: inline-block;
  }
}
</style>
