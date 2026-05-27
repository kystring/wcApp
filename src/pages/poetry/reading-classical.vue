<template>
  <view class="classical-page">
    <!-- 必背实词面板 -->
    <view class="word-panel" v-if="classicalData">
      <view class="panel-header" @tap="togglePanel">
        <text class="panel-title">📌 本课必背实词（{{ classicalData.keyWords.length }}个）</text>
        <text class="panel-toggle">{{ panelExpanded ? '收起' : '展开' }}</text>
      </view>
      <view class="panel-body" v-if="panelExpanded">
        <view v-for="kw in classicalData.keyWords" :key="kw.word" class="word-item">
          <text class="word-char">{{ kw.word }}</text>
          <text class="word-meaning">{{ kw.meaning }}</text>
          <view class="word-examples">
            <text class="example correct">✅ {{ kw.correctExample }}</text>
            <text class="example wrong">❌ {{ kw.wrongExample }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 正文 -->
    <view class="text-section" v-if="classicalData">
      <text class="text-title">{{ classicalData.title }}</text>
      <text class="text-source">—— {{ classicalData.source }}</text>
      <view class="text-body">
        <text class="classical-text">{{ classicalData.text }}</text>
      </view>
    </view>

    <!-- 翻译题 -->
    <view class="translation-section" v-if="classicalData">
      <text class="section-label">📝 翻译练习</text>
      <view v-for="tq in classicalData.translationQuestions" :key="tq.id" class="translation-card">
        <view class="score-points-sidebar">
          <text class="sp-label">采分点：</text>
          <view v-for="spId in tq.scorePoints" :key="spId" class="sp-item">
            <text class="sp-check">{{ checkResult[spId] ? '✅' : '⬜' }}</text>
            <text class="sp-desc">{{ getScorePointLabel(spId) }}</text>
          </view>
        </view>

        <text class="translation-stem">{{ tq.stem }}</text>
        <textarea
          class="translation-input"
          v-model="translations[tq.id]"
          placeholder="请输入你的翻译..."
          :maxlength="300"
        />
        <button class="check-btn" @tap="checkTranslation(tq)">提交检查</button>

        <view class="reference-answer" v-if="showReference[tq.id]">
          <text class="ref-label">📖 参考译文：</text>
          <text class="ref-text">{{ tq.referenceAnswer }}</text>
        </view>
      </view>
    </view>

    <c-empty-state v-if="!classicalData" icon="📜" title="加载中..." />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getClassicalText } from '@/mock/poetry-data.js'
import EmptyState from '@/components/common/EmptyState.vue'

const classicalData = ref(null)
const panelExpanded = ref(false)
const translations = ref({})
const checkResult = ref({})
const showReference = ref({})

onLoad((options) => {
  const textId = options.id || 'cl01'
  classicalData.value = getClassicalText(textId)
})

function togglePanel() {
  panelExpanded.value = !panelExpanded.value
}

function getScorePointLabel(spId) {
  const sp = classicalData.value?.scorePoints?.find(s => s.id === spId)
  return sp ? sp.label : spId
}

function checkTranslation(tq) {
  const answer = translations.value[tq.id] || ''
  if (!answer.trim()) {
    uni.showToast({ title: '请先输入翻译', icon: 'none' })
    return
  }

  // Simulate score point matching
  const sps = classicalData.value.scorePoints || []
  tq.scorePoints.forEach(spId => {
    const sp = sps.find(s => s.id === spId)
    if (sp) {
      // Simple keyword matching
      const keywords = sp.expected.split('/')
      const matched = keywords.some(kw => answer.includes(kw))
      checkResult.value[spId] = matched
    }
  })

  showReference.value[tq.id] = true
}
</script>

<style lang="scss" scoped>
.classical-page { min-height: 100vh; background: $bg-page; padding-bottom: 60rpx; }
.word-panel { background: #fff; margin: $spacing-md $spacing-lg; border-radius: $border-radius-lg; overflow: hidden; box-shadow: $shadow-sm; }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: $spacing-md $spacing-lg; background: linear-gradient(135deg, #FDF5D6, #FFF3CD); }
.panel-title { font-size: $font-md; font-weight: 600; color: #856404; }
.panel-toggle { font-size: $font-sm; color: $warning; }
.panel-body { padding: $spacing-md $spacing-lg; }
.word-item { padding: $spacing-sm 0; border-bottom: 1rpx solid $border-color; }
.word-item:last-child { border-bottom: none; }
.word-char { font-size: $font-xl; font-weight: 800; color: $primary; margin-right: $spacing-sm; }
.word-meaning { font-size: $font-sm; color: $text-secondary; }
.word-examples { margin-top: 8rpx; padding-left: $spacing-md; }
.example { font-size: $font-xs; display: block; margin-top: 4rpx; }
.example.correct { color: $success; }
.example.wrong { color: $danger; text-decoration: line-through; }
.text-section { background: linear-gradient(135deg, #F5F0E8, #EBE0CC); padding: $spacing-xl $spacing-lg; margin: 0 $spacing-lg; border-radius: $border-radius-lg; }
.text-title { font-size: $font-xl; font-weight: 800; color: $text-primary; display: block; text-align: center; }
.text-source { font-size: $font-sm; color: $text-secondary; display: block; text-align: center; margin: $spacing-xs 0 $spacing-lg; }
.classical-text { font-size: $font-md; color: $text-primary; line-height: 2.4; }
.translation-section { padding: $spacing-lg; }
.section-label { font-size: $font-lg; font-weight: 600; color: $text-primary; display: block; margin-bottom: $spacing-md; }
.translation-card { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.score-points-sidebar { display: flex; align-items: center; gap: $spacing-sm; margin-bottom: $spacing-md; padding: $spacing-sm $spacing-md; background: $bg-page; border-radius: $border-radius; flex-wrap: wrap; }
.sp-label { font-size: $font-xs; color: $text-secondary; font-weight: 600; }
.sp-item { display: flex; align-items: center; gap: 4rpx; }
.sp-check { font-size: 24rpx; }
.sp-desc { font-size: $font-xs; color: $text-secondary; }
.translation-stem { font-size: $font-md; color: $text-primary; font-weight: 500; display: block; margin-bottom: $spacing-md; }
.translation-input { width: 100%; height: 160rpx; border: 2rpx solid $border-color; border-radius: $border-radius; padding: $spacing-sm; font-size: $font-md; box-sizing: border-box; }
.check-btn { background: $primary; color: #fff; padding: 18rpx 0; border-radius: 32rpx; font-size: $font-sm; margin-top: $spacing-md; }
.reference-answer { margin-top: $spacing-md; padding: $spacing-md; background: rgba(39,174,96,0.05); border-radius: $border-radius; border-left: 4rpx solid $success; }
.ref-label { font-size: $font-sm; color: $success; font-weight: 600; display: block; }
.ref-text { font-size: $font-sm; color: $text-primary; margin-top: 8rpx; line-height: 1.8; display: block; }
</style>
