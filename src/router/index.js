import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/homePage/HomePage.vue'),
    },

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
  ],
})

export default router
