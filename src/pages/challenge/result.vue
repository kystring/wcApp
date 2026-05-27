<template>
  <view class="result-page">
    <!-- 分数展示 -->
    <view class="score-hero">
      <view class="score-circle" :class="scoreLevel">
        <text class="score-number">{{ score }}</text>
        <text class="score-label">分</text>
      </view>
      <text class="score-message">{{ scoreMessage }}</text>
      <view class="score-detail">
        <text>答对 {{ correct }} / {{ total }} 题</text>
      </view>
    </view>

    <!-- 段位变化 -->
    <view class="tier-change" v-if="promotionResult">
      <view v-if="promotionResult.promoted" class="promoted-section">
        <text class="promoted-emoji">🎉</text>
        <text class="promoted-title">恭喜晋级！</text>
        <view class="tier-transition">
          <t-tier-badge :tier="promotionResult.fromTier" />
          <text class="arrow">→</text>
          <t-tier-badge :tier="promotionResult.newTier" />
        </view>
        <text class="promoted-desc">你的努力得到了回报，继续加油！</text>
      </view>
      <view v-else class="not-promoted-section">
        <text class="not-promoted-emoji">💪</text>
        <text class="not-promoted-title">还差一点！</text>
        <text class="not-promoted-desc">需要 {{ promotionResult.requiredScore }} 分才能晋级，继续练习吧</text>
        <view class="use-protection" v-if="userStore.protectionCards > 0" @tap="useProtection">
          <text>🛡️ 使用段位保护卡（剩余{{ userStore.protectionCards }}张）</text>
        </view>
      </view>
    </view>

    <!-- 错题回顾 -->
    <view class="wrong-review" v-if="wrongResults.length > 0">
      <view class="review-title">
        <text>📋 错题回顾（{{ wrongResults.length }}题）</text>
      </view>
      <view v-for="(item, idx) in wrongResults" :key="item.questionId" class="review-item">
        <text class="review-index">第{{ idx + 1 }}题</text>
        <text class="review-explanation">{{ item.explanation }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="result-actions">
      <button class="action-btn primary" @tap="retryQuiz" v-if="!promotionResult?.promoted">
        <text>🔄 错题重练</text>
      </button>
      <button class="action-btn" @tap="newPractice">
        <text>📝 再来一组</text>
      </button>
      <button class="action-btn" @tap="goDashboard">
        <text>🏠 返回闯关</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTierStore } from '@/stores/tier.js'
import { useUserStore } from '@/stores/user.js'
import { checkPromotion } from '@/utils/scoring.js'
import TierBadge from '@/components/tier/TierBadge.vue'

const tierStore = useTierStore()
const userStore = useUserStore()

const score = ref(0)
const correct = ref(0)
const total = ref(10)
const wrongResults = ref([])
const promotionResult = ref(null)

const scoreLevel = computed(() => {
  if (score.value >= 90) return 'excellent'
  if (score.value >= 75) return 'good'
  if (score.value >= 60) return 'pass'
  return 'fail'
})

const scoreMessage = computed(() => {
  if (score.value >= 95) return '太棒了！你是语文天才！'
  if (score.value >= 90) return '非常优秀，继续保持！'
  if (score.value >= 80) return '表现不错，还有进步空间！'
  if (score.value >= 60) return '及格了，继续加油！'
  return '别灰心，多练几次就好了！'
})

onMounted(() => {
  // 从路由参数获取结果
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const options = page.$page?.options || page.options || {}

  score.value = parseInt(options.score) || 0
  correct.value = parseInt(options.correct) || 0
  total.value = parseInt(options.total) || 10

  // 获取最后一条答题记录
  const lastSession = tierStore.quizHistory[0]
  if (lastSession) {
    wrongResults.value = lastSession.answers
      ?.filter(a => {
        const q = lastSession.questions?.find(q => q.id === a.questionId)
        return q && a.selectedOption !== q.correctIndex
      })
      .map(a => {
        const q = lastSession.questions.find(q => q.id === a.questionId)
        return {
          questionId: a.questionId,
          selected: a.selectedOption,
          correct: q?.correctIndex,
          explanation: q?.explanation || ''
        }
      }) || []
  }

  // 检查晋升
  promotionResult.value = checkPromotion(userStore.currentTier, score.value)
  if (promotionResult.value.promoted) {
    userStore.updateTier(promotionResult.value.newTier)
    userStore.addPoints(score.value >= 90 ? 30 : score.value >= 80 ? 20 : 10)
  } else {
    userStore.addPoints(score.value >= 90 ? 15 : score.value >= 70 ? 8 : 3)
  }
})

function retryQuiz() {
  tierStore.retryQuiz()
  tierStore.startQuiz('retry', userStore.currentTier).then(() => {
    uni.redirectTo({ url: '/pages/challenge/quiz?mode=retry' })
  })
}

function newPractice() {
  tierStore.startQuiz('practice', userStore.currentTier).then(() => {
    uni.redirectTo({ url: '/pages/challenge/quiz' })
  })
}

function goDashboard() {
  uni.switchTab({ url: '/pages/challenge/dashboard' })
}

function useProtection() {
  if (userStore.useProtectionCard()) {
    uni.showToast({ title: '已使用保护卡，本次不降分', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.result-page {
  min-height: 100vh;
  background: #2C3E50;
  padding-bottom: 120rpx;
}

.score-hero {
  text-align: center;
  padding: 80rpx $spacing-lg 48rpx;
}

.score-circle {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  margin: 0 auto $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.1);
  border: 6rpx solid rgba(255,255,255,0.2);

  &.excellent { border-color: #27AE60; background: rgba(39,174,96,0.15); }
  &.good { border-color: #3498DB; background: rgba(52,152,219,0.15); }
  &.pass { border-color: #F39C12; background: rgba(243,156,18,0.15); }
  &.fail { border-color: #E74C3C; background: rgba(231,76,60,0.15); }

  .score-number { font-size: 72rpx; font-weight: 800; color: #fff; }
  .score-label { font-size: $font-md; color: rgba(255,255,255,0.7); }
}

.score-message { font-size: $font-xl; color: #fff; font-weight: 600; display: block; margin-bottom: $spacing-sm; }
.score-detail { font-size: $font-sm; color: rgba(255,255,255,0.6); }

.tier-change { padding: $spacing-lg; }

.promoted-section {
  text-align: center;
  background: #fff;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;

  .promoted-emoji { font-size: 80rpx; display: block; }
  .promoted-title { font-size: $font-xxl; font-weight: 800; color: $success; display: block; margin: $spacing-sm 0; }
  .tier-transition { display: flex; align-items: center; justify-content: center; gap: $spacing-md; margin: $spacing-md 0; }
  .arrow { font-size: $font-xl; color: $text-secondary; }
  .promoted-desc { font-size: $font-sm; color: $text-secondary; }
}

.not-promoted-section {
  text-align: center;
  background: #fff;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;

  .not-promoted-emoji { font-size: 80rpx; display: block; }
  .not-promoted-title { font-size: $font-xl; font-weight: 700; color: $text-primary; display: block; margin: $spacing-sm 0; }
  .not-promoted-desc { font-size: $font-sm; color: $text-secondary; }

  .use-protection { margin-top: $spacing-md; padding: $spacing-sm $spacing-md; color: $primary; font-size: $font-sm; background: rgba(231,76,60,0.05); border-radius: $border-radius; }
}

.wrong-review {
  padding: $spacing-lg;

  .review-title { font-size: $font-lg; font-weight: 600; color: #fff; margin-bottom: $spacing-md; }
}

.review-item {
  background: rgba(255,255,255,0.08);
  border-radius: $border-radius;
  padding: $spacing-md;
  margin-bottom: $spacing-sm;

  .review-index { font-size: $font-sm; color: rgba(255,255,255,0.6); display: block; margin-bottom: 8rpx; }
  .review-explanation { font-size: $font-sm; color: rgba(255,255,255,0.8); line-height: 1.6; }
}

.result-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-md $spacing-lg;
  padding-bottom: calc(env(safe-area-inset-bottom) + 16rpx);
  display: flex;
  gap: $spacing-sm;
  background: rgba(44,62,80,0.95);

  .action-btn {
    flex: 1;
    padding: 24rpx 0;
    border-radius: 40rpx;
    background: rgba(255,255,255,0.12);
    color: #fff;
    font-size: $font-sm;
    text-align: center;

    &.primary { background: $primary; font-weight: 600; }
  }
}
</style>
