<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li v-if="hasPermission('core.view_order')">
          <router-link to="/dashboard/orders">订单管理</router-link>
        </li>
        <li v-if="hasPermission('core.view_menuitem')">
          <router-link to="/dashboard/menu">菜单管理</router-link>
        </li>
        <li v-if="hasPermission('core.view_table')">
          <router-link to="/dashboard/tables">餐桌管理</router-link>
        </li>
      </ul>
    </nav>
    <button @click="handleLogout" class="logout-btn">退出登录</button>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';

const router = useRouter();
const userPermissions = ref([]);

// 辅助函数：检查用户是否拥有特定权限
const hasPermission = (permission) => {
  return userPermissions.value.includes(permission);
};

// 从 localStorage 获取权限并同步到 userPermissions 响应式变量
const getStoredPermissions = () => {
  const permissions = localStorage.getItem('userPermissions');
  userPermissions.value = permissions ? JSON.parse(permissions) : [];
};

// 监听路由变化，以确保在权限更新后菜单能同步
watch(() => router.currentRoute.value, () => {
  getStoredPermissions();
}, { immediate: true });

// 退出登录函数
const handleLogout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userPermissions');
  router.push('/login');
};
</script>
