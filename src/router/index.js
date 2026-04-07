import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' // 곧 만들 파일입니다

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // 이 부분은 나중에 필요할 때 파일을 만들면 됩니다.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
