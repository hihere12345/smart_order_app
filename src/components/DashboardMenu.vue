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
        <li v-if="hasGroup('managers')">
          <router-link to="/dashboard/reports">报表管理</router-link>
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
const userGroup = ref([]);

const hasPermission = (permission) => {
  return userPermissions.value.includes(permission);
};

const hasGroup = (group) => {
  return userGroup.value.includes(group);
};

const getStoredPermissions = () => {
  const permissions = localStorage.getItem('userPermissions');
  userPermissions.value = permissions ? JSON.parse(permissions) : [];
};

const getStoredGroups = () => {
  const groups = localStorage.getItem('userGroups');
  userGroup.value = groups ? JSON.parse(groups) : [];
};

watch(() => router.currentRoute.value, () => {
  getStoredPermissions();
  getStoredGroups();
}, { immediate: true });

const handleLogout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userPermissions');
  localStorage.removeItem('userGroups');
  router.push('/login');
};
</script>
