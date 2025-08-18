<template>
  <div class="page-container login-container">
    <h2>登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">登录</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/remote/api.js'; // 导入login函数

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  error.value = '';

  try {
    // 调用封装好的API函数
    const response = await login(username.value, password.value);
    
    // 登录成功，存储 token
    localStorage.setItem('userToken', response.token);
    
    router.push('/dashboard');
  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = '用户名或密码错误。';
    } else {
      error.value = '登录失败，请稍后再试。';
      console.error('Login error:', err);
    }
  }
};
</script>