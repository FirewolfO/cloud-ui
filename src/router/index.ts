import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AccountLayout from '@/layouts/AccountLayout.vue'
import { pinia } from '@/stores'
import { useAuthStore } from '@/stores/auth'
import { authenticationRedirect } from './authGuard'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/auth', name: 'auth', component: () => import('@/views/AuthView.vue'), meta: { title: '登录' } },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Cloud Console' } },
        {
          path: 'account',
          component: AccountLayout,
          children: [
            { path: '', redirect: { name: 'account-profile' } },
            { path: 'profile', name: 'account-profile', component: () => import('@/views/ProfileView.vue'), meta: { title: '基本资料' } },
            { path: 'api-credentials', name: 'api-credentials', component: () => import('@/views/ApiCredentialsView.vue'), meta: { title: 'API 访问密钥' } },
          ],
        },
        { path: 'profile', redirect: { name: 'account-profile' } },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore(pinia)
  try {
    await auth.restore()
  } catch {
    auth.user = null
    auth.checked = true
  }
  return authenticationRedirect(to, Boolean(auth.user))
})

router.afterEach((to) => {
  document.title = String(to.meta.title || 'Cloud Console')
})

export default router
