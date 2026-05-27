<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user.js'

onLaunch(() => {
  console.log('语文闯关 App Launch')
  const userStore = useUserStore()
  const restored = userStore._restoreSession()
  if (!restored) {
    uni.reLaunch({ url: '/pages/login/index' })
  }
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import '@/uni.scss';
</style>
