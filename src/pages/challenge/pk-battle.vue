<template>
  <view class="pk-battle-page">
    <!-- 对战状态栏 -->
    <view class="battle-header">
      <view class="player-info">
        <text class="player-name">我</text>
        <t-tier-badge :tier="userStore.currentTier" />
        <text class="player-score">{{ myScore }}</text>
      </view>
      <view class="battle-vs">
        <text class="vs-text">VS</text>
        <text class="round-text">第{{ currentRound }}/{{ totalRounds }}题</text>
      </view>
      <view class="player-info opponent">
        <text class="player-score">{{ oppScore }}</text>
        <t-tier-badge :tier="opponent?.tier || '青铜'" />
        <text class="player-name">{{ opponent?.name || '对手' }}</text>
      </view>
    </view>

    <!-- 进度条 -->
    <view class="score-bar">
      <view class="my-bar" :style="{ width: myPercent + '%' }"></view>
      <view class="opp-bar" :style="{ width: oppPercent + '%' }"></view>
    </view>

    <!-- 题目 -->
    <scroll-view class="battle-body" scroll-y>
      <t-question-card
        v-if="currentQ"
        :question="currentQ"
        :selectedOption="selectedOption"
        :showResult="showResult"
        :disabled="roundEnded"
        @select="handleAnswer"
      />
    </scroll-view>

    <!-- 回合结果 -->
    <view class="round-result" v-if="showResult">
      <text class="result-text" :style="{ color: roundWon ? '#27AE60' : '#E74C3C' }">
        {{ roundWon ? '✅ 这题答对了！' : '❌ 这题答错了' }}
      </text>
      <button class="next-round-btn" @tap="nextRound" v-if="currentRound < totalRounds">
        下一题
      </button>
      <button class="finish-btn" @tap="finishBattle" v-else>
        查看结果
      </button>
    </view>

    <c-loading-overlay :visible="isLoading" text="对手答题中..." />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTierStore } from '@/stores/tier.js'
import { useUserStore } from '@/stores/user.js'
import { simulateAiAnswer, aiAnswerDelay } from '@/mock/pk-opponents.js'
import { pickQuestionsForTier } from '@/utils/question-picker.js'
import TierBadge from '@/components/tier/TierBadge.vue'
import QuestionCard from '@/components/tier/QuestionCard.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const tierStore = useTierStore()
const userStore = useUserStore()

const currentRound = ref(1)
const totalRounds = ref(5)
const myScore = ref(0)
const oppScore = ref(0)
const selectedOption = ref(-1)
const showResult = ref(false)
const roundEnded = ref(false)
const roundWon = ref(false)
const isLoading = ref(false)
const questions = ref([])
const currentQ = ref(null)

const opponent = computed(() => tierStore.pkOpponent || { name: 'AI对手', tier: '青铜' })

const myPercent = computed(() => ((myScore.value + (roundWon.value && showResult.value ? 1 : 0)) / totalRounds.value) * 100)
const oppPercent = computed(() => (oppScore.value / totalRounds.value) * 100)

onMounted(() => {
  // Generate PK questions
  questions.value = pickQuestionsForTier({
    tier: userStore.currentTier,
    mode: 'practice',
    isOnboarding: false,
    onboardingStage: 0,
    wrongBanks: {},
    isRetry: false,
    questionCount: totalRounds.value
  })
  currentQ.value = questions.value[0]
})

function handleAnswer(optionIndex) {
  if (roundEnded.value) return
  selectedOption.value = optionIndex
  roundEnded.value = true

  // Check answer
  const correct = optionIndex === currentQ.value.correctIndex
  roundWon.value = correct
  if (correct) myScore.value++

  // Simulate opponent answer
  isLoading.value = true
  const oppSkill = opponent.value.skill || 0.5
  const oppCorrect = simulateAiAnswer(currentQ.value, oppSkill)

  aiAnswerDelay().then(() => {
    if (oppCorrect) oppScore.value++
    isLoading.value = false
    showResult.value = true
  })
}

function nextRound() {
  currentRound.value++
  if (currentRound.value <= totalRounds.value) {
    currentQ.value = questions.value[currentRound.value - 1]
    selectedOption.value = -1
    showResult.value = false
    roundEnded.value = false
    roundWon.value = false
  }
}

function finishBattle() {
  const won = myScore.value > oppScore.value
  const points = won ? (tierStore.pkMode === '1v4' ? 30 : 10) : 2
  userStore.addPoints(points)

  uni.redirectTo({
    url: `/pages/challenge/result?score=${Math.round((myScore.value/totalRounds.value)*100)}&correct=${myScore.value}&total=${totalRounds.value}&mode=pk`
  })
}
</script>

<style lang="scss" scoped>
.pk-battle-page {
  min-height: 100vh;
  background: #2C3E50;
  display: flex;
  flex-direction: column;
}

.battle-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx $spacing-lg $spacing-md;
}

.player-info {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  flex-direction: column;
  min-width: 160rpx;

  &.opponent { align-items: center; }

  .player-name { font-size: $font-md; color: #fff; font-weight: 600; }
  .player-score { font-size: $font-xl; color: #fff; font-weight: 800; }
}

.battle-vs {
  text-align: center;

  .vs-text { font-size: 48rpx; font-weight: 800; color: rgba(255,255,255,0.3); display: block; }
  .round-text { font-size: $font-xs; color: rgba(255,255,255,0.5); }
}

.score-bar {
  display: flex;
  height: 8rpx;
  margin: 0 $spacing-lg $spacing-md;
  border-radius: 4rpx;
  overflow: hidden;

  .my-bar { background: $primary; transition: width 0.5s; }
  .opp-bar { background: $info; transition: width 0.5s; }
}

.battle-body {
  flex: 1;
  padding: $spacing-md $spacing-lg;
}

.round-result {
  padding: $spacing-lg;
  text-align: center;
  background: rgba(255,255,255,0.95);
  border-radius: $border-radius-lg $border-radius-lg 0 0;

  .result-text { font-size: $font-lg; font-weight: 600; display: block; margin-bottom: $spacing-md; }

  .next-round-btn, .finish-btn {
    background: $primary;
    color: #fff;
    padding: 24rpx 0;
    border-radius: 40rpx;
    font-size: $font-md;
    font-weight: 600;
  }
}
</style>
