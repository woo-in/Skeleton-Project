import { createRouter, createWebHistory } from 'vue-router'

function hasSession() {
  try {
    return Boolean(JSON.parse(localStorage.getItem('userSession') || 'null')?.id)
  } catch {
    return false
  }
}

import Setup from '@/pages/Setup/ExpenseGoalSetup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => (hasSession() ? '/home' : '/login'),
    },

    {
      path: '/home',
      name: 'home',
      component: () => import('@/pages/homePage/HomePage.vue'),
      meta: { requiresAuth: true, showTopBar: true, showBottomNav: true },
    },

    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/signupPage/SignupPage.vue'),
      meta: { guestOnly: true },
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/loginPage/LoginPage.vue'),
      meta: { guestOnly: true },
    },

    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/pages/settingPage/SettingPage.vue'),
      meta: { requiresAuth: true, showTopBar: true, showBottomNav: true },
    },
    {
      path: '/setup',
      name: 'setup',
      component: Setup,
      meta: { requiresAuth: true },
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('@/pages/reportPage/ReportPage.vue'),
      meta: { requiresAuth: true, showTopBar: true, showBottomNav: true },
    },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = hasSession()

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return '/home'
  }
})

export default router
