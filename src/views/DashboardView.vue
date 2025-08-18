<template>
  <div class="dashboard-layout">
    <DashboardMenu />
    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import DashboardMenu from '@/components/DashboardMenu.vue';
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.content {
  flex-grow: 1;
  padding: 20px;
  background-color: #ecf0f1;
}
</style>