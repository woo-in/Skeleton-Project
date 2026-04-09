import { createRouter, createWebHistory } from 'vue-router'
import Setup from '@/pages/Setup/ExpenseGoalSetup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/setup',
      name: 'setup',
      component: Setup,
    },
  ],
})

export default router
