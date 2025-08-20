<template>
  <div class="page-container">
    <div class="card">
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/remote/api.js';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  error.value = '';

  try {
    const response = await login(username.value, password.value);
    localStorage.setItem('userToken', response.access);

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