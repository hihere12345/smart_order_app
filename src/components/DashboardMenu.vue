<template>
  <aside class="sidebar">
    <nav>
        <ul>
            <li><router-link to="/dashboard/home">主页</router-link></li>
            <li><router-link to="/dashboard/profile">个人资料</router-link></li>
        </ul>
    </nav>
    <button @click="handleLogout" class="logout-btn">退出登录</button>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('userToken');
  router.push('/login');
};
</script>
