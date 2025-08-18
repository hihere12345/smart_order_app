import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login' // 访问根路径时重定向到 /login
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true } // 添加元数据，表示该路由需要认证
    }
  ]
})

// 全局前置守卫 (Global Before Guards)
router.beforeEach((to, from, next) => {
  // 检查 token 是否存在，以判断用户是否已登录
  const userToken = localStorage.getItem('userToken');

  if (to.meta.requiresAuth && !userToken) {
    next('/login');
  } else if (to.name === 'login' && userToken) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router