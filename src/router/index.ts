import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/home/Page.vue'),
        },
        {
          path: '/test',
          name: 'test',
          component: () => import('@/pages/TestPage.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'not-found',
          component: () => import('@/pages/NotFoundPage.vue'),
        },
      ],
    },
  ],
})

export default router
