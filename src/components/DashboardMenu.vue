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

const hasPermission = (permission) => {
  return userPermissions.value.includes(permission);
};

const getStoredPermissions = () => {
  const permissions = localStorage.getItem('userPermissions');
  userPermissions.value = permissions ? JSON.parse(permissions) : [];
};

watch(() => router.currentRoute.value, () => {
  getStoredPermissions();
}, { immediate: true });

const handleLogout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userPermissions');
  router.push('/login');
};
</script>
