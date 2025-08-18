<template>
  <div class="dashboard-container">
    <h2>欢迎来到仪表盘</h2>
    <p>您已成功登录！</p>
    <button @click="handleLogout">退出登录</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('userToken');
  router.push('/login');
};
</script>

<style scoped>
.dashboard-container {
  max-width: 800px;
  margin: 100px auto;
  padding: 20px;
  text-align: center;
}
button {
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>