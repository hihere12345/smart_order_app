import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import OrdersView from '../views/OrdersView.vue'
import MenuView from '../views/MenuView.vue'
import TablesView from '../views/TablesView.vue'
import CustomerView from '../views/CustomerView.vue'
import ReportsView from '../views/ReportsView.vue'
import { getPermissions, setAuthToken } from '@/remote/api.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      children: [
        {
          path: 'orders',
          name: 'dashboard-orders',
          component: OrdersView,
          meta: { requiresPermission: 'core.view_order' }
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
        {
          path: 'reports',
          name: 'reports',
          component: ReportsView,
          meta: { requiresGroup: 'managers' }
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
    if (!userToken) {
      return next('/login');
    }

    setAuthToken(userToken);
    const userPermissions = localStorage.getItem('userPermissions');
    const userGroups = localStorage.getItem('userGroups');

    if (!userPermissions || from.name === 'login') {
      try {
        console.log('Fetching permissions for dashboard...');
        const permissions = await getPermissions();
        localStorage.setItem('userPermissions', JSON.stringify(permissions.permissions));
        localStorage.setItem('userGroups', JSON.stringify(permissions.groups)); // Assuming groups are not implemented yet
      } catch (err) {
        console.error('Failed to get permissions:', err);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userPermissions');
        localStorage.removeItem('userGroups');
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

    if (to.meta.requiresGroup) {
      const requiresGroup = to.meta.requiresGroup;
      const parsedGroup = JSON.parse(userGroups);
      if (!parsedGroup.includes(requiresGroup)) {
        console.warn(`Access denied. Missing group: ${requiresGroup}`);
        return next('/dashboard/home');
      }
    }
  }
  else if (to.name === 'login' && userToken) {
    return next('/dashboard');
  }

  next();
});

export default router