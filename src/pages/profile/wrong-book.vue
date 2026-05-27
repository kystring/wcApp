<template>
  <view class="wrong-book-page">
    <view class="page-header">
      <text class="header-title">错题本</text>
      <text class="header-desc">共 {{ tierStore.getTotalWrongCount() }} 道待清错题</text>
    </view>

    <view class="exam-points-list">
      <view v-for="ep in examPoints" :key="ep.id" class="ep-card" @tap="drillExamPoint(ep)">
        <view class="ep-header">
          <text class="ep-icon">{{ ep.icon }}</text>
          <view class="ep-info">
            <text class="ep-name">{{ ep.name }}</text>
            <text class="ep-wrong-count">{{ ep.wrongCount }} 道错题</text>
          </view>
          <view class="ep-status" :class="{ cleared: ep.wrongCount === 0 }">
            <text>{{ ep.wrongCount === 0 ? '✅ 已清空' : '📝 待清理' }}</text>
          </view>
        </view>
        <!-- 进度条 -->
        <view class="ep-progress">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: ep.wrongCount === 0 ? '100%' : Math.max(5, (1 - ep.wrongCount / 20) * 100) + '%', background: ep.wrongCount === 0 ? '#27AE60' : '#E74C3C' }"></view>
          </view>
        </view>
        <!-- 清空兑换 -->
        <view class="ep-action" v-if="ep.wrongCount === 0 && !lpStore.skipCardStatus.examPointsCleared.includes(ep.id)">
          <button class="exchange-btn" @tap.stop="exchangeSkipCard(ep)">🎫 兑换免做卡</button>
        </view>
        <view class="ep-action" v-if="lpStore.skipCardStatus.examPointsCleared.includes(ep.id)">
          <text class="exchanged-text">✅ 已兑换免做卡</text>
        </view>
      </view>
    </view>

    <!-- 免做卡说明 -->
    <view class="skip-card-info">
      <text class="info-title">💡 免做卡规则</text>
      <text class="info-text">清空一个考点的所有错题即可兑换1张免做卡。免做卡可免一次低频作业（抄写、基础知识填空等），不能用于写作、阅读等核心练习。</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTierStore } from '@/stores/tier.js'
import { useLearningPathStore } from '@/stores/learning-path.js'
import { EXAM_POINTS } from '@/utils/constants.js'

const tierStore = useTierStore()
const lpStore = useLearningPathStore()

const examPoints = computed(() => {
  return EXAM_POINTS.map(ep => ({
    ...ep,
    wrongCount: tierStore.getWrongCount(ep.id)
  }))
})

function drillExamPoint(ep) {
  if (ep.wrongCount > 0) {
    tierStore.retryQuiz()
    tierStore.startQuiz('retry', '青铜').then(() => {
      uni.navigateTo({ url: '/pages/challenge/quiz?mode=retry' })
    })
  }
}

function exchangeSkipCard(ep) {
  lpStore.earnSkipCard(ep.id)
  uni.showToast({ title: '兑换成功！', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.wrong-book-page { min-height: 100vh; background: $bg-page; padding-bottom: 60rpx; }
.page-header { padding: $spacing-xl $spacing-lg; background: linear-gradient(135deg, #E74C3C, #C0392B); }
.header-title { font-size: $font-xxl; color: #fff; font-weight: 800; display: block; }
.header-desc { font-size: $font-sm; color: rgba(255,255,255,0.8); display: block; margin-top: $spacing-xs; }
.exam-points-list { padding: $spacing-lg; }
.ep-card { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.ep-header { display: flex; align-items: center; gap: $spacing-md; margin-bottom: $spacing-sm; }
.ep-icon { font-size: 40rpx; }
.ep-info { flex: 1; }
.ep-name { font-size: $font-md; font-weight: 600; color: $text-primary; display: block; }
.ep-wrong-count { font-size: $font-xs; color: $text-secondary; display: block; }
.ep-status { font-size: $font-xs; }
.ep-status.cleared { color: $success; }
.ep-progress { margin: $spacing-sm 0; }
.progress-bar { height: 8rpx; background: $bg-page; border-radius: 4rpx; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 4rpx; transition: width 0.5s; }
.ep-action { text-align: right; }
.exchange-btn { background: rgba(39,174,96,0.1); color: $success; font-size: $font-sm; padding: 8rpx 24rpx; border-radius: 24rpx; display: inline-block; }
.exchanged-text { font-size: $font-xs; color: $success; }
.skip-card-info { margin: $spacing-lg; padding: $spacing-lg; background: rgba(52,152,219,0.06); border-radius: $border-radius-lg; }
.info-title { font-size: $font-md; font-weight: 600; color: $info; display: block; margin-bottom: $spacing-sm; }
.info-text { font-size: $font-sm; color: $text-secondary; line-height: 1.8; }
</style>
