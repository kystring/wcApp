<template>
  <view class="regular-topic-page">
    <!-- Phase: init - 二选一启动 -->
    <view v-if="session?.phase === 'init'" class="init-section">
      <text class="init-title">开始写作</text>
      <view class="option-card" @tap="selectType('议论文')">
        <text class="option-icon">📝</text><text class="option-text">我想写一篇议论文</text>
      </view>
      <view class="option-card" @tap="selectType('记叙文')">
        <text class="option-icon">📖</text><text class="option-text">我想写一篇记叙文</text>
      </view>
      <view class="option-card" @tap="selectType('散文')">
        <text class="option-icon">🌸</text><text class="option-text">我想写一篇散文</text>
      </view>
      <view class="or-divider"><text>—— 或者 ——</text></view>
      <view class="custom-input">
        <input v-model="customTopic" placeholder="老师布置的题目是..." />
        <button @tap="selectCustomTopic">确定</button>
      </view>
    </view>

    <!-- Phase: topic-analysis - AI对话审题 -->
    <view v-if="session?.phase === 'topic-analysis'" class="chat-section">
      <view class="chat-header">
        <text class="chat-title">🤖 AI审题助手</text>
        <button class="skip-btn" @tap="skipAnalysis">跳过审题 →</button>
      </view>
      <scroll-view class="chat-messages" scroll-y :scroll-top="chatScrollTop">
        <view v-for="(msg, idx) in session?.aiDialogue || []" :key="idx"
          class="chat-bubble" :class="msg.role === 'ai' ? 'ai-bubble' : 'student-bubble'">
          <text class="bubble-text">{{ msg.content }}</text>
        </view>
      </scroll-view>
      <view class="chat-input-area">
        <input class="chat-input" v-model="studentInput" placeholder="输入你的回答..." @confirm="sendMessage" />
        <button class="send-btn" @tap="sendMessage">发送</button>
      </view>
    </view>

    <!-- Core question -->
    <view v-if="session?.phase === 'framework'" class="core-section">
      <text class="core-title">最后一步</text>
      <text class="core-prompt">用一句话说说你最想表达的核心想法</text>
      <textarea class="core-input" v-model="coreIdea" placeholder="例如：坚持努力，平凡的起点也能成就不凡的人生" />
      <button class="generate-btn" :disabled="!coreIdea.trim()" @tap="generateFramework">生成作文框架</button>
    </view>

    <c-loading-overlay :visible="isLoading" text="AI思考中..." />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWritingStore } from '@/stores/writing.js'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const writingStore = useWritingStore()
const session = computed(() => writingStore.regularSession)
const isLoading = ref(false)
const studentInput = ref('')
const customTopic = ref('')
const coreIdea = ref('')
const chatScrollTop = ref(99999)

function selectType(type) {
  writingStore.setTopicType(type)
  // Auto-start AI dialogue
  sendAiMessage(type)
}

function selectCustomTopic() {
  if (customTopic.value.trim()) {
    writingStore.setTopicType('自定义', customTopic.value.trim())
    sendAiMessage(customTopic.value)
  }
}

async function sendAiMessage(text) {
  if (!text?.trim()) return
  isLoading.value = true
  studentInput.value = ''
  await writingStore.sendAiMessage(text)
  isLoading.value = false
  chatScrollTop.value += 500
}

function sendMessage() {
  if (studentInput.value.trim()) {
    sendAiMessage(studentInput.value)
  }
}

function skipAnalysis() {
  writingStore.skipTopicAnalysis()
}

function generateFramework() {
  writingStore.setCoreIdea(coreIdea.value)
  uni.navigateTo({ url: '/pages/writing/regular-framework' })
}
</script>

<style lang="scss" scoped>
.regular-topic-page { min-height: 100vh; background: $bg-page; }
.init-section { padding: $spacing-xl $spacing-lg; }
.init-title { font-size: $font-xxl; font-weight: 800; color: $text-primary; display: block; text-align: center; margin-bottom: $spacing-xl; }
.option-card { background: #fff; border-radius: $border-radius-lg; padding: $spacing-xl; text-align: center; margin-bottom: $spacing-md; box-shadow: $shadow-sm; display: flex; align-items: center; justify-content: center; gap: $spacing-sm; }
.option-icon { font-size: 48rpx; }
.option-text { font-size: $font-lg; color: $text-primary; font-weight: 600; }
.or-divider { text-align: center; padding: $spacing-lg; color: $text-hint; font-size: $font-sm; }
.custom-input { display: flex; gap: $spacing-sm; background: #fff; border-radius: $border-radius-lg; padding: $spacing-md; box-shadow: $shadow-sm; }
.custom-input input { flex: 1; border: 2rpx solid $border-color; border-radius: $border-radius; padding: 18rpx $spacing-md; font-size: $font-md; }
.custom-input button { background: $primary; color: #fff; padding: 18rpx 32rpx; border-radius: $border-radius; font-size: $font-sm; }
.chat-section { display: flex; flex-direction: column; height: 100vh; }
.chat-header { display: flex; justify-content: space-between; align-items: center; padding: $spacing-md $spacing-lg; background: #fff; border-bottom: 1rpx solid $border-color; }
.chat-title { font-size: $font-lg; font-weight: 600; }
.skip-btn { font-size: $font-sm; color: $primary; background: none; }
.chat-messages { flex: 1; padding: $spacing-md; overflow-y: auto; }
.chat-bubble { padding: $spacing-md $spacing-lg; border-radius: $border-radius-lg; margin-bottom: $spacing-md; max-width: 80%; }
.ai-bubble { background: #fff; align-self: flex-start; margin-right: auto; }
.student-bubble { background: $primary; align-self: flex-end; margin-left: auto; .bubble-text { color: #fff; } }
.bubble-text { font-size: $font-md; line-height: 1.6; white-space: pre-wrap; }
.chat-input-area { display: flex; gap: $spacing-sm; padding: $spacing-md; background: #fff; border-top: 1rpx solid $border-color; }
.chat-input { flex: 1; border: 2rpx solid $border-color; border-radius: 40rpx; padding: 18rpx $spacing-md; font-size: $font-md; background: $bg-page; }
.send-btn { background: $primary; color: #fff; padding: 18rpx 32rpx; border-radius: 40rpx; font-size: $font-sm; }
.core-section { padding: $spacing-xl $spacing-lg; }
.core-title { font-size: $font-xxl; font-weight: 800; color: $text-primary; display: block; text-align: center; margin-bottom: $spacing-lg; }
.core-prompt { font-size: $font-lg; color: $text-secondary; display: block; text-align: center; margin-bottom: $spacing-lg; }
.core-input { width: 100%; height: 200rpx; border: 2rpx solid $border-color; border-radius: $border-radius-lg; padding: $spacing-md; font-size: $font-md; box-sizing: border-box; background: #fff; }
.generate-btn { background: $primary; color: #fff; padding: 24rpx 0; border-radius: 40rpx; font-size: $font-md; font-weight: 600; margin-top: $spacing-lg; }
.generate-btn[disabled] { opacity: 0.4; }
</style>
