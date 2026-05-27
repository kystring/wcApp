<template>
  <view class="writing-hub-page">
    <view class="hub-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <text class="hub-title">写作训练</text>
      <text class="hub-subtitle">应用文 · 常规文体 · AI智能辅导</text>
    </view>

    <view class="hub-body">
      <view class="hub-card practical-card" @tap="startPractical">
        <text class="card-icon">📋</text>
        <view class="card-info">
          <text class="card-title">应用文写作</text>
          <text class="card-desc">通知 · 启事 · 请假条 · 邀请函</text>
          <text class="card-feature">分步引导 + 格式一键检测</text>
        </view>
        <text class="card-arrow">→</text>
      </view>

      <view class="hub-card regular-card" @tap="startRegular">
        <text class="card-icon">✍️</text>
        <view class="card-info">
          <text class="card-title">常规文体写作</text>
          <text class="card-desc">议论文 · 记叙文 · 散文</text>
          <text class="card-feature">AI审题 + 框架填充 + 聚焦反馈</text>
        </view>
        <text class="card-arrow">→</text>
      </view>

      <!-- 写作记录 -->
      <view class="history-section">
        <text class="section-label">📝 最近写作</text>
        <view v-if="writingStore.practicalHistory.length > 0 || writingStore.regularHistory.length > 0">
          <view v-for="(item, idx) in writingStore.practicalHistory.slice(0, 2)" :key="'p'+idx" class="history-item">
            <text class="history-tag">应用文</text>
            <text class="history-title">{{ getFormatName(item.formatType) }}</text>
          </view>
          <view v-for="(item, idx) in writingStore.regularHistory.slice(0, 2)" :key="'r'+idx" class="history-item">
            <text class="history-tag regular">常规写作</text>
            <text class="history-title">{{ item.topicText || item.topicType }}</text>
          </view>
        </view>
        <c-empty-state v-else icon="📝" title="还没有写作记录" description="开始你的第一次写作练习吧" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useWritingStore } from '@/stores/writing.js'
import { useAuthGuard } from '@/composables/useAuthGuard.js'
import { PRACTICAL_FORMATS } from '@/utils/constants.js'
import EmptyState from '@/components/common/EmptyState.vue'

const writingStore = useWritingStore()
const { checkAuth } = useAuthGuard()

onShow(() => {
  checkAuth()
})
const statusBarHeight = ref(20)

uni.getSystemInfo({ success: res => { statusBarHeight.value = res.statusBarHeight || 20 } })

function getFormatName(formatType) {
  const fmt = PRACTICAL_FORMATS.find(f => f.id === formatType)
  return fmt ? fmt.name : formatType
}

function startPractical() {
  writingStore.startPracticalWriting()
  uni.navigateTo({ url: '/pages/writing/practical-guide' })
}

function startRegular() {
  writingStore.startRegularWriting()
  uni.navigateTo({ url: '/pages/writing/regular-topic' })
}
</script>

<style lang="scss" scoped>
.writing-hub-page { min-height: 100vh; background: $bg-page; }
.hub-header { background: linear-gradient(135deg, #2C3E50, #3498DB); padding: $spacing-xl $spacing-lg; text-align: center; }
.hub-title { font-size: $font-xxl; color: #fff; font-weight: 800; display: block; }
.hub-subtitle { font-size: $font-sm; color: rgba(255,255,255,0.7); display: block; margin-top: $spacing-xs; }
.hub-body { padding: $spacing-lg; }
.hub-card { background: #fff; border-radius: $border-radius-lg; padding: $spacing-xl; margin-bottom: $spacing-md; box-shadow: $shadow-sm; display: flex; align-items: center; }
.card-icon { font-size: 56rpx; margin-right: $spacing-md; }
.card-info { flex: 1; }
.card-title { font-size: $font-xl; font-weight: 700; color: $text-primary; display: block; }
.card-desc { font-size: $font-sm; color: $text-secondary; display: block; margin-top: 4rpx; }
.card-feature { font-size: $font-xs; color: $primary; display: block; margin-top: 8rpx; background: rgba(231,76,60,0.06); padding: 4rpx 16rpx; border-radius: 20rpx; display: inline-block; }
.card-arrow { font-size: $font-xl; color: $text-hint; }
.history-section { margin-top: $spacing-lg; }
.section-label { font-size: $font-lg; font-weight: 600; color: $text-primary; margin-bottom: $spacing-sm; display: block; }
.history-item { display: flex; align-items: center; gap: $spacing-sm; padding: $spacing-md; background: #fff; border-radius: $border-radius; margin-bottom: $spacing-xs; }
.history-tag { font-size: $font-xs; color: $primary; background: rgba(231,76,60,0.08); padding: 4rpx 16rpx; border-radius: 20rpx; }
.history-tag.regular { color: #3498DB; background: rgba(52,152,219,0.08); }
.history-title { font-size: $font-sm; color: $text-primary; }
</style>
