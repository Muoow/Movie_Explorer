import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path : '/home',
      component : () => import ('@/views/MovieFrontPage.vue')
    },
    {
      path : '/',
      redirect : '/home'
    },
    {
      path : '/about',
      component : () => import('@/views/AboutUsPage.vue')
    },
    {
      path : '/cinema',
      component : () => import('@/views/NearbyCinemaPage.vue')
    },
    {
      path : '/discover',
      component : () => import('@/views/FilterByConditions.vue')
    },
    {
      path : '/search',
      component : () => import('@/views/SearchByKeyword.vue')
    }
  ]
})

export default router
