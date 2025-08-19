import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import OrdersView from '../views/OrdersView.vue'
import MenuView from '../views/MenuView.vue'
import TablesView from '../views/TablesView.vue'
import CustomerView from '../views/CustomerView.vue'
import { getPermissions, setAuthToken } from '@/remote/api.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   redirect: '/login'
    // },
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
          path: 'orders', 
          name: 'dashboard-orders', 
          component: OrdersView,
          meta: { requiresPermission: 'core.view_order' } // 新增权限元数据
        },
        { 
          path: 'menu', 
          name: 'dashboard-menu', 
          component: MenuView,
          meta: { requiresPermission: 'core.view_menuitem' } 
        },
        { 
          path: 'tables', 
          name: 'dashboard-tables', 
          component: TablesView,
          meta: { requiresPermission: 'core.view_table' } 
        },
      ]
    },
    {
      path: '/:tableNumber',
      name: 'customer',
      component: CustomerView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const userToken = localStorage.getItem('userToken');

  if (to.meta.requiresAuth) {
    // 1. 检查是否已登录 (是否有 token)
    if (!userToken) {
      return next('/login');
    }

    // 2. 设置认证头，以便发送请求
    setAuthToken(userToken);

    // 3. 检查是否有已缓存的权限信息
    const userPermissions = localStorage.getItem('userPermissions');
    
    // 如果没有缓存，或者这是从登录页跳转过来的 (初次加载仪表盘)，则重新获取权限
    if (!userPermissions || from.name === 'login') {
      try {
        console.log('Fetching permissions for dashboard...');
        const permissions = await getPermissions();
        localStorage.setItem('userPermissions', JSON.stringify(permissions));
      } catch (err) {
        // 如果获取权限失败，可能是 token 过期或无效
        console.error('Failed to get permissions:', err);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userPermissions');
        return next('/login');
      }
    }

    if (to.meta.requiresPermission) {
      const requiredPermission = to.meta.requiresPermission;
      const parsedPermissions = JSON.parse(userPermissions);
      if (!parsedPermissions.includes(requiredPermission)) {
        console.warn(`Access denied. Missing permission: ${requiredPermission}`);
        return next('/dashboard/home'); 
      }
    }
  } 
  else if (to.name === 'login' && userToken) {
    // 如果已登录但试图访问登录页，则重定向到仪表盘
    return next('/dashboard');
  }

  // 继续导航
  next();
});

export default router