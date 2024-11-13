import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    // path: '/:lang',
    path: '/:lang',
    name: 'home',
    component: HomeView
  },
  {
    path: '/',
    redirect: '/en'
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
