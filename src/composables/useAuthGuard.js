import { useUserStore } from '@/stores/user.js'

export function useAuthGuard() {
  const userStore = useUserStore()

  function checkAuth() {
    if (!userStore.isLoggedIn) {
      uni.reLaunch({ url: '/pages/login/index' })
      return false
    }
    return true
  }

  return { checkAuth }
}
