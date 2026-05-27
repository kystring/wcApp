import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const AUTH_WHITELIST = ['/pages/login/index', '/pages/register/index']

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)

  // 全局导航拦截：未登录时只允许访问登录/注册页
  const guardMethods = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']
  guardMethods.forEach(method => {
    uni.addInterceptor(method, {
      invoke(args) {
        const url = (args.url || '').split('?')[0]
        if (AUTH_WHITELIST.includes(url)) return true
        const token = uni.getStorageSync('auth_token')
        if (!token) {
          uni.reLaunch({ url: '/pages/login/index' })
          return false
        }
        return true
      }
    })
  })

  return { app }
}
