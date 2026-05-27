<template>
  <view class="modal-overlay" v-if="visible" @tap="handleCancel">
    <view class="modal-card" @tap.stop>
      <text class="modal-title">{{ title }}</text>
      <text class="modal-content" v-if="content">{{ content }}</text>
      <view class="modal-actions">
        <view class="modal-btn cancel-btn" @tap="handleCancel">
          <text>{{ cancelText }}</text>
        </view>
        <view class="modal-btn confirm-btn" @tap="handleConfirm">
          <text>{{ confirmText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '提示' },
  content: { type: String, default: '' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' }
})

const emit = defineEmits(['confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-card {
  background: #fff;
  border-radius: $border-radius-lg;
  padding: 48rpx 40rpx 32rpx;
  width: 560rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.modal-content {
  font-size: $font-md;
  color: $text-secondary;
  text-align: center;
  margin-bottom: $spacing-lg;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  width: 100%;
  gap: $spacing-md;
}

.modal-btn {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  border-radius: 40rpx;
  font-size: $font-md;
}

.cancel-btn {
  background: $bg-page;
  color: $text-secondary;
}

.confirm-btn {
  background: $primary;
  color: #fff;
}
</style>
