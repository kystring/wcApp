<template>
  <view class="practical-guide-page">
    <!-- Step indicator -->
    <view class="steps-bar">
      <view class="step" :class="{ active: session?.step === 1, done: session?.step > 1 }">
        <text class="step-num">1</text><text class="step-label">选文体</text>
      </view>
      <view class="step-line" :class="{ active: session?.step > 1 }"></view>
      <view class="step" :class="{ active: session?.step === 2, done: session?.step > 2 }">
        <text class="step-num">2</text><text class="step-label">填信息</text>
      </view>
      <view class="step-line" :class="{ active: session?.step > 2 }"></view>
      <view class="step" :class="{ active: session?.step === 3, done: session?.step > 3 }">
        <text class="step-num">3</text><text class="step-label">写作</text>
      </view>
    </view>

    <!-- Step 1: 选文体 -->
    <view class="step-content" v-if="session?.step === 1">
      <text class="step-title">选择应用文类型</text>
      <view v-for="fmt in formats" :key="fmt.id" class="format-card" @tap="selectFormat(fmt.id)">
        <text class="format-name">{{ fmt.name }}</text>
        <text class="format-example">例：{{ fmt.example }}</text>
      </view>
    </view>

    <!-- Step 2: 填信息表 -->
    <view class="step-content" v-if="session?.step === 2">
      <text class="step-title">填写关键信息</text>
      <view class="info-form">
        <view class="form-item">
          <text class="form-label">时间</text>
          <input class="form-input" v-model="infoTable.time" placeholder="如：明天下午2点" />
        </view>
        <view class="form-item">
          <text class="form-label">地点</text>
          <input class="form-input" v-model="infoTable.place" placeholder="如：学校操场" />
        </view>
        <view class="form-item">
          <text class="form-label">人物</text>
          <input class="form-input" v-model="infoTable.people" placeholder="如：全班同学" />
        </view>
        <view class="form-item">
          <text class="form-label">事件</text>
          <input class="form-input" v-model="infoTable.event" placeholder="如：参加运动会" />
        </view>
      </view>
      <button class="generate-btn" :disabled="!canGenerate" @tap="generateFrame">生成写作框架</button>
    </view>

    <!-- Step 3: 写作 -->
    <view class="step-content" v-if="session?.step === 3">
      <text class="step-title">在框架中书写</text>
      <view class="writing-frame">
        <text class="frame-text">{{ session?.generatedFrame }}</text>
      </view>
      <button class="photo-btn" @tap="submitPhoto">📸 拍照提交</button>
      <button class="check-btn" @tap="goCheck">✅ 提交格式检测</button>
    </view>

    <c-confirm-modal :visible="showExitModal" title="确定离开？" content="已填写的内容将丢失" confirmText="离开" @confirm="exitWriting" @cancel="showExitModal = false" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useWritingStore } from '@/stores/writing.js'
import { PRACTICAL_FORMATS } from '@/utils/constants.js'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const writingStore = useWritingStore()
const session = computed(() => writingStore.practicalSession)
const formats = ref(PRACTICAL_FORMATS)
const showExitModal = ref(false)

const infoTable = ref({ time: '', place: '', people: '', event: '' })
const canGenerate = computed(() => {
  const t = infoTable.value
  return t.time && t.place && t.people && t.event
})

function selectFormat(formatId) {
  writingStore.selectFormat(formatId)
}

function generateFrame() {
  writingStore.saveInfoTable(infoTable.value)
}

function submitPhoto() {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera', 'album'],
    success: (res) => {
      writingStore.submitPracticalWriting(res.tempFilePaths[0])
    }
  })
}

function goCheck() {
  writingStore.runFormatCheck().then(result => {
    uni.navigateTo({ url: '/pages/writing/practical-check' })
  })
}

function exitWriting() {
  writingStore.practicalSession = null
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.practical-guide-page { min-height: 100vh; background: $bg-page; padding-bottom: 60rpx; }
.steps-bar { display: flex; align-items: center; justify-content: center; padding: $spacing-lg; background: #fff; }
.step { display: flex; flex-direction: column; align-items: center; }
.step-num { width: 56rpx; height: 56rpx; border-radius: 50%; background: $bg-page; color: $text-hint; display: flex; align-items: center; justify-content: center; font-size: $font-md; font-weight: 600; }
.step.active .step-num { background: $primary; color: #fff; }
.step.done .step-num { background: $success; color: #fff; }
.step-label { font-size: $font-xs; color: $text-secondary; margin-top: 4rpx; }
.step.active .step-label { color: $primary; font-weight: 600; }
.step-line { width: 80rpx; height: 4rpx; background: $border-color; margin: 0 $spacing-sm; }
.step-line.active { background: $success; }
.step-content { padding: $spacing-lg; }
.step-title { font-size: $font-xl; font-weight: 700; color: $text-primary; display: block; margin-bottom: $spacing-lg; }
.format-card { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; margin-bottom: $spacing-sm; box-shadow: $shadow-sm; }
.format-name { font-size: $font-lg; font-weight: 600; color: $text-primary; display: block; }
.format-example { font-size: $font-sm; color: $text-secondary; display: block; margin-top: 4rpx; }
.info-form { background: #fff; border-radius: $border-radius-lg; padding: $spacing-lg; }
.form-item { margin-bottom: $spacing-md; }
.form-label { font-size: $font-md; color: $text-primary; font-weight: 500; display: block; margin-bottom: $spacing-xs; }
.form-input { border: 2rpx solid $border-color; border-radius: $border-radius; padding: 18rpx $spacing-md; font-size: $font-md; width: 100%; box-sizing: border-box; }
.generate-btn { background: $primary; color: #fff; padding: 24rpx 0; border-radius: 40rpx; font-size: $font-md; font-weight: 600; margin-top: $spacing-lg; }
.generate-btn[disabled] { opacity: 0.4; }
.writing-frame { background: linear-gradient(135deg, #FFFEF5, #FFF9E6); border: 2rpx dashed $warning; border-radius: $border-radius-lg; padding: $spacing-xl; white-space: pre-wrap; }
.frame-text { font-size: $font-md; color: $text-primary; line-height: 2.2; }
.photo-btn, .check-btn { width: 100%; padding: 24rpx 0; border-radius: 40rpx; font-size: $font-md; font-weight: 600; margin-top: $spacing-md; }
.photo-btn { background: #fff; color: $primary; border: 2rpx solid $primary; }
.check-btn { background: $primary; color: #fff; }
</style>
