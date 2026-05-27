<template>
  <view class="poetry-hub-page">
    <view class="hub-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <text class="hub-title">古诗文</text>
      <text class="hub-subtitle">背诵 · 默写 · 赏析 · 阅读</text>
    </view>

    <view class="hub-body">
      <!-- 古诗文默写入场 -->
      <view class="hub-card dictation-card" @tap="goPage('/pages/poetry/dictation-list')">
        <view class="card-left">
          <text class="card-icon">✍️</text>
          <view class="card-info">
            <text class="card-title">古诗文默写</text>
            <text class="card-desc">拍照交卷 · AI批改 · 逐字纠错</text>
          </view>
        </view>
        <text class="card-arrow">→</text>
      </view>

      <!-- 古诗文阅读入场 -->
      <view class="hub-card reading-card" @tap="goPage('/pages/poetry/reading-categories')">
        <view class="card-left">
          <text class="card-icon">📖</text>
          <view class="card-info">
            <text class="card-title">古诗文阅读</text>
            <text class="card-desc">情感分类 · 诗词赏析 · 文言文</text>
          </view>
        </view>
        <text class="card-arrow">→</text>
      </view>

      <!-- 最近记录 -->
      <view class="recent-section" v-if="dictationHistory.length > 0">
        <text class="section-label">📋 最近默写</text>
        <view v-for="item in dictationHistory.slice(0, 3)" :key="item.assignmentId" class="recent-item">
          <text class="recent-title">{{ item.poemTitle }}</text>
          <text class="recent-status">{{ item.wrongCharacters.length === 0 ? '✅ 全对' : '❌ 错' + item.wrongCharacters.length + '字' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { usePoetryStore } from '@/stores/poetry.js'
import { useAuthGuard } from '@/composables/useAuthGuard.js'

const poetryStore = usePoetryStore()
const { checkAuth } = useAuthGuard()

onShow(() => {
  checkAuth()
})
const statusBarHeight = ref(20)

const dictationHistory = computed(() => poetryStore.dictationHistory)

uni.getSystemInfo({ success: res => { statusBarHeight.value = res.statusBarHeight || 20 } })

function goPage(url) { uni.navigateTo({ url }) }
</script>

<style lang="scss" scoped>
.poetry-hub-page { min-height: 100vh; background: $bg-page; }
.hub-header { background: linear-gradient(135deg, #8B5E3C, #A0522D); padding: $spacing-xl $spacing-lg; text-align: center; }
.hub-title { font-size: $font-xxl; color: #fff; font-weight: 800; display: block; }
.hub-subtitle { font-size: $font-sm; color: rgba(255,255,255,0.7); display: block; margin-top: $spacing-xs; }
.hub-body { padding: $spacing-lg; }
.hub-card { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; display: flex; align-items: center; justify-content: space-between; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.card-left { display: flex; align-items: center; gap: $spacing-md; }
.card-icon { font-size: 52rpx; }
.card-title { font-size: $font-lg; font-weight: 600; color: $text-primary; display: block; }
.card-desc { font-size: $font-sm; color: $text-secondary; display: block; margin-top: 4rpx; }
.card-arrow { font-size: $font-lg; color: $text-hint; }
.recent-section { margin-top: $spacing-lg; }
.section-label { font-size: $font-lg; font-weight: 600; color: $text-primary; margin-bottom: $spacing-sm; display: block; }
.recent-item { background: #fff; border-radius: $border-radius; padding: $spacing-md; display: flex; justify-content: space-between; margin-bottom: $spacing-xs; }
.recent-title { font-size: $font-md; color: $text-primary; }
.recent-status { font-size: $font-sm; }
</style>
