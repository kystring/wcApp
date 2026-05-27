<template>
  <view class="reading-categories-page">
    <view class="page-header">
      <text class="page-title">古诗文阅读</text>
      <text class="page-desc">选择你感兴趣的情感主题，开始诗词赏析之旅</text>
    </view>

    <!-- 情感分类 -->
    <view class="categories-section">
      <text class="section-label">🎭 按情感分类</text>
      <p-emotion-card
        v-for="cat in categories"
        :key="cat.id"
        :emoji="cat.emoji"
        :name="cat.name"
        :color="cat.color"
        :preview="getPreviewForCategory(cat.id)"
        :categoryId="cat.id"
        @tap="selectCategory"
      />
    </view>

    <!-- 文言文区 -->
    <view class="classical-section">
      <text class="section-label">📜 文言文阅读</text>
      <view
        v-for="text in classicalList"
        :key="text.title"
        class="classical-card"
        @tap="openClassical(text)"
      >
        <view class="classical-info">
          <text class="classical-title">{{ text.title }}</text>
          <text class="classical-source">{{ text.source }}</text>
        </view>
        <text class="classical-arrow">→</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { EMOTION_CATEGORIES } from '@/utils/constants.js'
import { EMOTION_POEMS, CLASSICAL_TEXTS } from '@/mock/poetry-data.js'
import EmotionCard from '@/components/poetry/EmotionCard.vue'

const categories = ref(EMOTION_CATEGORIES)
const classicalList = ref(CLASSICAL_TEXTS)

function getPreviewForCategory(categoryId) {
  const poems = EMOTION_POEMS[categoryId]
  return poems && poems[0] ? poems[0].preview : ''
}

function selectCategory(categoryId) {
  uni.navigateTo({ url: `/pages/poetry/reading-poem?category=${categoryId}` })
}

function openClassical(text) {
  uni.navigateTo({ url: `/pages/poetry/reading-classical?id=${text.id}` })
}
</script>

<style lang="scss" scoped>
.reading-categories-page { min-height: 100vh; background: $bg-page; padding-bottom: 60rpx; }
.page-header { padding: $spacing-xl $spacing-lg; background: linear-gradient(135deg, #8B5E3C, #A0522D); }
.page-title { font-size: $font-xxl; color: #fff; font-weight: 800; display: block; }
.page-desc { font-size: $font-sm; color: rgba(255,255,255,0.7); display: block; margin-top: $spacing-xs; }
.categories-section { padding: $spacing-lg; }
.section-label { font-size: $font-lg; font-weight: 600; color: $text-primary; margin-bottom: $spacing-md; display: block; }
.classical-section { padding: 0 $spacing-lg $spacing-lg; }
.classical-card { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; display: flex; align-items: center; justify-content: space-between; margin-bottom: $spacing-sm; box-shadow: $shadow-sm; }
.classical-info { flex: 1; }
.classical-title { font-size: $font-lg; font-weight: 600; color: $text-primary; display: block; }
.classical-source { font-size: $font-xs; color: $text-hint; display: block; margin-top: 4rpx; }
.classical-arrow { font-size: $font-lg; color: $text-hint; }
</style>
