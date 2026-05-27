<template>
  <view class="practical-check-page">
    <text class="check-title">📋 格式检测结果</text>
    <view class="check-card" v-for="(item, idx) in checkItems" :key="idx">
      <text class="check-icon">{{ item.status === 'correct' ? '✅' : item.status === 'wrong' ? '❌' : '⚠️' }}</text>
      <view class="check-info">
        <text class="check-part">{{ item.part }}</text>
        <text class="check-msg">{{ item.msg }}</text>
      </view>
    </view>

    <view class="score-section">
      <text class="score-title">内容要素检测</text>
      <view class="element-checks">
        <view class="element-item" v-for="el in elements" :key="el.name">
          <text :class="el.present ? 'el-ok' : 'el-miss'">{{ el.present ? '✅' : '❌' }}</text>
          <text class="el-name">{{ el.name }}</text>
        </view>
      </view>
      <text class="score-msg">四要素齐全，格式完整，得分90+</text>
    </view>

    <view class="action-btns">
      <button class="rewrite-btn" @tap="rewrite">重新写作</button>
      <button class="finish-btn" @tap="finish">完成</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useWritingStore } from '@/stores/writing.js'

const writingStore = useWritingStore()

const checkItems = ref([
  { part: '标题', status: 'correct', msg: '标题位置居中，内容正确' },
  { part: '称呼', status: 'correct', msg: '称呼顶格写，格式正确' },
  { part: '落款', status: 'warning', msg: '落款位置偏右但格式正确' },
  { part: '日期', status: 'correct', msg: '日期格式正确' }
])

const elements = ref([
  { name: '时间', present: true },
  { name: '地点', present: true },
  { name: '人物', present: true },
  { name: '事件', present: true }
])

function rewrite() {
  uni.navigateBack()
}

function finish() {
  writingStore.finishPracticalWriting()
  uni.switchTab({ url: '/pages/writing/index' })
}
</script>

<style lang="scss" scoped>
.practical-check-page { min-height: 100vh; background: $bg-page; padding: $spacing-lg; }
.check-title { font-size: $font-xl; font-weight: 700; color: $text-primary; display: block; margin-bottom: $spacing-lg; }
.check-card { display: flex; gap: $spacing-md; background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-bottom: $spacing-sm; box-shadow: $shadow-sm; }
.check-icon { font-size: 36rpx; flex-shrink: 0; }
.check-part { font-size: $font-md; font-weight: 600; color: $text-primary; display: block; }
.check-msg { font-size: $font-sm; color: $text-secondary; display: block; margin-top: 4rpx; }
.score-section { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-top: $spacing-lg; }
.score-title { font-size: $font-lg; font-weight: 600; color: $text-primary; display: block; margin-bottom: $spacing-md; }
.element-checks { display: flex; gap: $spacing-md; margin-bottom: $spacing-md; }
.element-item { display: flex; align-items: center; gap: 4rpx; }
.el-ok, .el-miss { font-size: 28rpx; }
.el-name { font-size: $font-sm; color: $text-secondary; }
.score-msg { font-size: $font-lg; font-weight: 600; color: $success; text-align: center; display: block; }
.action-btns { display: flex; gap: $spacing-md; margin-top: $spacing-xl; }
.rewrite-btn, .finish-btn { flex: 1; padding: 24rpx 0; border-radius: 40rpx; font-size: $font-md; font-weight: 600; }
.rewrite-btn { background: #fff; color: $primary; border: 2rpx solid $primary; }
.finish-btn { background: $primary; color: #fff; }
</style>
