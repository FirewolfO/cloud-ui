import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
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
        { path: 'profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { title: '个人资料' } },
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
