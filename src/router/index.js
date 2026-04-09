import { createRouter, createWebHistory } from 'vue-router'
import Setup from '@/pages/Setup/ExpenseGoalSetup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/signupPage/SignupPage.vue'),
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/loginPage/LoginPage.vue'),
    },

    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/pages/settingPage/SettingPage.vue'),
    },
    {
      path: '/setup',
      name: 'setup',
      component: Setup,
    },
  ],
})

export default router
