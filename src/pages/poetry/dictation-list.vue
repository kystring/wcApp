<template>
  <view class="dictation-list-page">
    <view class="page-header">
      <text class="page-title">古诗文默写</text>
      <text class="page-desc">根据题目提示默写诗句，拍照交卷后AI批改</text>
    </view>
    <view class="assignment-list">
      <view v-for="item in assignments" :key="item.id" class="assignment-card" @tap="startDictation(item)">
        <view class="card-top">
          <text class="assignment-title">{{ item.title }}</text>
          <text class="assignment-status">未完成</text>
        </view>
        <text class="assignment-prompt">{{ item.prompt }}</text>
        <view class="card-bottom">
          <view class="error-tags" v-if="item.errorChars.length > 0">
            <text class="tag-label">常见错字：</text>
            <text v-for="ec in item.errorChars.slice(0,3)" :key="ec.char" class="tag-char">{{ ec.char }}</text>
          </view>
          <text class="start-btn">开始默写 →</text>
        </view>
      </view>
    </view>
    <c-empty-state v-if="assignments.length === 0" icon="📭" title="暂无默写作业" description="老师还没有布置新的默写任务" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePoetryStore } from '@/stores/poetry.js'
import { dictationAssignments } from '@/mock/dictation-data.js'
import EmptyState from '@/components/common/EmptyState.vue'

const poetryStore = usePoetryStore()
const assignments = ref(dictationAssignments)

function startDictation(item) {
  poetryStore.startDictation(item)
  uni.navigateTo({ url: '/pages/poetry/dictation-write' })
}

onMounted(() => {
  // Load from store if available
  if (poetryStore.dictationAssignments.length > 0) {
    assignments.value = poetryStore.dictationAssignments
  }
})
</script>

<style lang="scss" scoped>
.dictation-list-page { min-height: 100vh; background: $bg-page; }
.page-header { padding: $spacing-xl $spacing-lg; background: linear-gradient(135deg, #8B5E3C, #A0522D); }
.page-title { font-size: $font-xxl; color: #fff; font-weight: 800; display: block; }
.page-desc { font-size: $font-sm; color: rgba(255,255,255,0.7); display: block; margin-top: $spacing-xs; }
.assignment-list { padding: $spacing-lg; }
.assignment-card { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: $spacing-sm; }
.assignment-title { font-size: $font-lg; font-weight: 700; color: $text-primary; }
.assignment-status { font-size: $font-xs; color: $warning; background: rgba(243,156,18,0.1); padding: 4rpx 16rpx; border-radius: 20rpx; }
.assignment-prompt { font-size: $font-md; color: $text-secondary; display: block; margin-bottom: $spacing-md; letter-spacing: 4rpx; }
.card-bottom { display: flex; align-items: center; justify-content: space-between; }
.error-tags { font-size: $font-xs; color: $text-hint; }
.tag-label { margin-right: 4rpx; }
.tag-char { color: $danger; margin-right: 8rpx; }
.start-btn { font-size: $font-sm; color: $primary; font-weight: 600; }
</style>
