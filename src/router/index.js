import Vue from 'vue'
import VueRouter from 'vue-router'
import BalanceChecker from '../views/BalanceChecker.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'BalanceChecker',
    component: BalanceChecker
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router