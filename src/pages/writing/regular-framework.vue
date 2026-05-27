<template>
  <view class="regular-framework-page">
    <text class="page-title">📋 作文框架</text>

    <!-- 三档选择 -->
    <view class="tier-tabs">
      <view v-for="tier in tiers" :key="tier.value"
        class="tier-tab" :class="{ active: session?.fillTier === tier.value }"
        @tap="selectTier(tier.value)">
        <text class="tier-tab-text">{{ tier.label }}</text>
      </view>
    </view>

    <!-- 框架填充 -->
    <scroll-view scroll-y class="framework-content">
      <view v-for="node in session?.framework" :key="node.id" class="framework-node">
        <view class="node-header">
          <text class="node-title">{{ node.title }}</text>
          <text class="node-hint">{{ node.hint }}</text>
        </view>
        <!-- 支架式模板 -->
        <view v-if="session?.fillTier === 'simple'" class="fill-template">
          <text class="template-text">{{ getSimpleTemplate(node.type) }}</text>
          <textarea class="fill-input" v-model="fillContent[node.id]" placeholder="按模板填写你的内容..." />
        </view>
        <!-- 中等档 -->
        <view v-if="session?.fillTier === 'medium'" class="fill-template">
          <text class="template-hint">{{ getMediumTemplate(node.type) }}</text>
          <textarea class="fill-input medium" v-model="fillContent[node.id]" placeholder="根据提示自由写作..." />
        </view>
        <!-- 挑战档 -->
        <view v-if="session?.fillTier === 'challenge'" class="fill-template">
          <text class="template-hint challenge">{{ getChallengeTemplate(node.type) }}</text>
          <textarea class="fill-input" v-model="fillContent[node.id]" placeholder="完全自主写作..." />
        </view>
      </view>
    </scroll-view>

    <!-- 选择聚焦点 -->
    <view class="focus-section">
      <text class="focus-label">选择批改聚焦点：</text>
      <view class="focus-options">
        <view v-for="f in focuses" :key="f.id" class="focus-chip"
          :class="{ selected: selectedFocus === f.id }" @tap="selectFocus(f.id)">
          <text>{{ f.icon }} {{ f.name }}</text>
        </view>
      </view>
      <button class="submit-btn" @tap="submitWriting">提交作文</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWritingStore } from '@/stores/writing.js'
import { FEEDBACK_FOCUS } from '@/utils/constants.js'
import { FILL_TEMPLATES } from '@/mock/ai-dialogue.js'

const writingStore = useWritingStore()
const session = computed(() => writingStore.regularSession)
const fillContent = ref({})
const selectedFocus = ref('structure')

const tiers = [
  { value: 'simple', label: '简单档' },
  { value: 'medium', label: '中等档' },
  { value: 'challenge', label: '挑战档' }
]
const focuses = ref(FEEDBACK_FOCUS)

function selectTier(tier) { writingStore.selectFillTier(tier) }
function selectFocus(focus) { selectedFocus.value = focus; writingStore.selectFeedbackFocus(focus) }

function getSimpleTemplate(type) {
  const templates = FILL_TEMPLATES.simple
  return templates[type] || templates.body1
}
function getMediumTemplate(type) {
  const templates = FILL_TEMPLATES.medium
  return templates[type] || templates.body1
}
function getChallengeTemplate(type) {
  const templates = FILL_TEMPLATES.challenge
  return templates[type] || templates.body1
}

function submitWriting() {
  const allContent = Object.values(fillContent.value).join('\n\n')
  writingStore.fillContent(allContent)
  writingStore.submitForFeedback().then(() => {
    uni.navigateTo({ url: '/pages/writing/regular-feedback' })
  })
}
</script>

<style lang="scss" scoped>
.regular-framework-page { min-height: 100vh; background: $bg-page; padding-bottom: 200rpx; }
.page-title { font-size: $font-xxl; font-weight: 800; color: $text-primary; text-align: center; display: block; padding: $spacing-lg; }
.tier-tabs { display: flex; justify-content: center; gap: $spacing-sm; padding: 0 $spacing-lg $spacing-md; }
.tier-tab { padding: 14rpx 40rpx; border-radius: 32rpx; background: #fff; font-size: $font-sm; color: $text-secondary; }
.tier-tab.active { background: $primary; color: #fff; font-weight: 600; }
.framework-content { padding: 0 $spacing-lg; max-height: 60vh; }
.framework-node { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-bottom: $spacing-md; box-shadow: $shadow-sm; }
.node-header { margin-bottom: $spacing-md; }
.node-title { font-size: $font-lg; font-weight: 700; color: $text-primary; display: block; }
.node-hint { font-size: $font-xs; color: $text-hint; display: block; margin-top: 4rpx; }
.fill-template { margin-top: $spacing-sm; }
.template-text { font-size: $font-md; color: $primary; line-height: 1.8; display: block; background: rgba(231,76,60,0.05); padding: $spacing-sm; border-radius: $border-radius; }
.template-hint { font-size: $font-sm; color: $text-secondary; line-height: 1.8; display: block; }
.fill-input { width: 100%; min-height: 160rpx; border: 2rpx solid $border-color; border-radius: $border-radius; padding: $spacing-sm; font-size: $font-md; margin-top: $spacing-sm; box-sizing: border-box; }
.fill-input.medium { min-height: 120rpx; }
.focus-section { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: $spacing-lg; box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.08); }
.focus-label { font-size: $font-md; font-weight: 600; color: $text-primary; display: block; margin-bottom: $spacing-sm; }
.focus-options { display: flex; gap: $spacing-sm; margin-bottom: $spacing-md; }
.focus-chip { padding: 12rpx 24rpx; border-radius: 24rpx; background: $bg-page; font-size: $font-sm; color: $text-secondary; }
.focus-chip.selected { background: rgba(52,152,219,0.1); color: $info; border: 2rpx solid $info; font-weight: 600; }
.submit-btn { background: $primary; color: #fff; padding: 24rpx 0; border-radius: 40rpx; font-size: $font-md; font-weight: 600; width: 100%; }
</style>
