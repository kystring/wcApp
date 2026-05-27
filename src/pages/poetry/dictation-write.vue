<template>
  <view class="dictation-write-page">
    <!-- 题目区 -->
    <view class="prompt-section">
      <text class="poem-title">{{ dictation?.poemTitle }}</text>
      <text class="prompt-text">{{ dictation?.promptText }}</text>
    </view>

    <!-- 拍照/作答区 -->
    <view class="write-section" v-if="!dictation?.photoUrl">
      <view class="photo-upload-area" @tap="takePhoto">
        <text class="upload-icon">📸</text>
        <text class="upload-text">点击拍照上传默写内容</text>
        <text class="upload-hint">在纸上完成默写后拍照提交</text>
      </view>
      <view class="ocr-notes">
        <text>💡 提示：光线充足、字迹清晰可提高识别准确率</text>
      </view>
    </view>

    <!-- OCR处理中 -->
    <view class="ocr-section" v-if="dictation?.ocrStatus === 'processing'">
      <p-step-reveal-area
        :step="0"
        :ocrStatus="'processing'"
      />
    </view>

    <!-- OCR识别失败 -->
    <view class="ocr-section" v-if="dictation?.ocrStatus === 'failed'">
      <view class="failed-card">
        <text class="failed-icon">📷</text>
        <text class="failed-text">识别置信度较低，建议重拍</text>
        <text class="failed-hint">换个角度或光线，确保字迹清晰</text>
        <button class="retry-btn" @tap="retryPhoto">重新拍照</button>
      </view>
    </view>

    <!-- 批改结果 -->
    <view class="ocr-section" v-if="dictation?.ocrStatus === 'success'">
      <p-step-reveal-area
        :step="dictation?.correctionStep || 1"
        :correctAnswer="dictation?.correctAnswer || ''"
        :wrongChars="dictation?.wrongCharacters || []"
        :displayText="dictation?.ocrResult?.recognizedText || ''"
        @advance-step="advanceStep"
        @finish="finishDictation"
      />
    </view>

    <c-loading-overlay :visible="isLoading" text="识别中..." />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePoetryStore } from '@/stores/poetry.js'
import StepRevealArea from '@/components/poetry/StepRevealArea.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'

const poetryStore = usePoetryStore()
const dictation = computed(() => poetryStore.currentDictation)
const isLoading = ref(false)

function takePhoto() {
  // 在真机上使用uni.chooseImage，这里模拟选择图片
  uni.chooseImage({
    count: 1,
    sourceType: ['camera', 'album'],
    success: (res) => {
      isLoading.value = true
      poetryStore.submitDictationPhoto(res.tempFilePaths[0]).then(() => {
        isLoading.value = false
      })
    },
    fail: () => {
      // 开发环境模拟
      isLoading.value = true
      const mockPhotoPath = '/static/images/mock-dictation.jpg'
      poetryStore.submitDictationPhoto(mockPhotoPath).then(() => {
        isLoading.value = false
      })
    }
  })
}

function retryPhoto() {
  poetryStore.retryPhoto()
}

function advanceStep() {
  poetryStore.advanceCorrectionStep()
}

function finishDictation() {
  poetryStore.finishDictation()
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.dictation-write-page { min-height: 100vh; background: #F5F0E8; padding-bottom: 120rpx; }
.prompt-section { background: #fff; padding: $spacing-xl $spacing-lg; margin: $spacing-md; border-radius: $border-radius-lg; box-shadow: $shadow-sm; }
.poem-title { font-size: $font-xl; font-weight: 700; color: $text-primary; text-align: center; display: block; margin-bottom: $spacing-md; }
.prompt-text { font-size: $font-lg; color: $text-primary; text-align: center; display: block; line-height: 2; letter-spacing: 6rpx; }
.write-section { padding: $spacing-lg; }
.photo-upload-area { background: #fff; border: 4rpx dashed $border-color; border-radius: $border-radius-lg; padding: $spacing-xl; text-align: center; }
.upload-icon { font-size: 80rpx; display: block; margin-bottom: $spacing-md; }
.upload-text { font-size: $font-lg; color: $text-primary; font-weight: 600; display: block; }
.upload-hint { font-size: $font-sm; color: $text-hint; display: block; margin-top: $spacing-xs; }
.ocr-notes { margin-top: $spacing-md; padding: $spacing-md; background: rgba(52,152,219,0.08); border-radius: $border-radius; font-size: $font-xs; color: $info; }
.ocr-section { padding: $spacing-lg; }
.failed-card { background: #fff; border-radius: $border-radius-lg; padding: $spacing-xl; text-align: center; box-shadow: $shadow-sm; }
.failed-icon { font-size: 80rpx; display: block; margin-bottom: $spacing-md; }
.failed-text { font-size: $font-lg; color: $warning; font-weight: 600; display: block; }
.failed-hint { font-size: $font-sm; color: $text-secondary; display: block; margin: $spacing-sm 0 $spacing-lg; }
.retry-btn { background: $primary; color: #fff; padding: 20rpx 48rpx; border-radius: 40rpx; font-size: $font-md; }
</style>
