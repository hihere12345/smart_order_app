import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

// 直接从 views 目录导入页面
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
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
      meta: { requiresAuth: true },
      // 嵌套路由保持不变，但组件引用路径需要修改
      children: [
        {
          path: '', 
          name: 'dashboard-home',
          component: HomeView
        },
        {
          path: 'home', 
          name: 'dashboard-home-explicit',
          component: HomeView
        },
        {
          path: 'profile',
          name: 'dashboard-profile',
          component: ProfileView
        }
      ]
    }
  ]
})

// 导航守卫部分保持不变...
router.beforeEach((to, from, next) => {
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