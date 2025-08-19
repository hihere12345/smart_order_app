<template>
  <div class="dashboard-content">
    <h3>餐桌管理</h3>

    <button v-if="hasPermission('core.add_table')" @click="addTableAction" class="add-button">添加餐桌</button>

    <div v-if="tables.length > 0" class="table-container">
      <table>
        <thead>
          <tr>
            <th>餐桌号</th>
            <th>是否可用</th>
            <th>二维码</th>
            <th class="actions-header">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="table in tables" :key="table.id">
            <td>{{ table.table_number }}</td>
            <td>{{ table.is_available ? '是' : '否' }}</td>
            <td>
              <a :href="table.qr_code" target="_blank">查看二维码</a>
            </td>
            <td class="table-actions">
              <button v-if="hasPermission('core.change_table')" @click="updateTableAction(table)" class="small-action-button edit-button">编辑</button>
              <button v-if="hasPermission('core.delete_table')" @click="deleteTableAction(table.id)" class="small-action-button delete-button">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>没有找到任何餐桌。</p>
    </div>
  </div>

  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content">
      <h4>{{ isEditMode ? '编辑餐桌' : '添加餐桌' }}</h4>
      <form @submit.prevent="handleFormSubmit">
        <div class="form-group">
          <label for="tableNumber">餐桌号:</label>
          <input type="text" id="tableNumber" v-model="form.table_number" required>
        </div>
        <div class="form-group">
          <label for="isAvailable">是否可用:</label>
          <input type="checkbox" id="isAvailable" v-model="form.is_available">
        </div>
        <div class="modal-actions">
          <button type="submit" class="submit-button">{{ isEditMode ? '保存' : '添加' }}</button>
          <button type="button" @click="hideModal" class="cancel-button">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getTables, deleteTable, addTable, updateTable } from '@/remote/api.js';

const tables = ref([]);
const userPermissions = ref([]);
const isModalVisible = ref(false);
const isEditMode = ref(false);
let tableFetchInterval;
const form = ref({
  id: null,
  table_number: '',
  is_available: true,
});

const hasPermission = (permission) => {
  return userPermissions.value.includes(permission);
};

const fetchTables = async () => {
  try {
    tables.value = await getTables();
  } catch (error) {
    console.error('获取餐桌列表失败:', error);
  }
};

onMounted(() => {
  getStoredPermissions();
  fetchTables();
  // 每隔10秒自动刷新一次
  tableFetchInterval = setInterval(fetchTables, 5000);
});

onUnmounted(() => {
  // 组件卸载时清除定时器，防止内存泄漏
  clearInterval(tableFetchInterval);
});

const getStoredPermissions = () => {
  const permissions = localStorage.getItem('userPermissions');
  userPermissions.value = permissions ? JSON.parse(permissions) : [];
};

// 显示添加模态框
const addTableAction = () => {
  isEditMode.value = false;
  // 重置表单
  form.value = {
    id: null,
    table_number: '',
    is_available: true,
  };
  isModalVisible.value = true;
};

// 显示编辑模态框
const updateTableAction = (table) => {
  isEditMode.value = true;
  // 填充表单
  form.value = { ...table };
  isModalVisible.value = true;
};

// 隐藏模态框
const hideModal = () => {
  isModalVisible.value = false;
};

// 处理表单提交
const handleFormSubmit = async () => {
  try {
    if (isEditMode.value) {
      await updateTable(form.value.id, {
        table_number: form.value.table_number,
        is_available: form.value.is_available
      });
    } else {
      await addTable({
        table_number: form.value.table_number,
        is_available: form.value.is_available
      });
    }
    
    // 隐藏模态框并刷新列表
    hideModal();
    fetchTables();
  } catch (error) {
    console.error('操作失败:', error);
    alert('操作失败，请重试。');
  }
};

const deleteTableAction = async (tableId) => {
  if (confirm('确定要删除这个餐桌吗？')) {
    try {
      await deleteTable(tableId);
      console.log('餐桌删除成功');
      fetchTables(); 
    } catch (error) {
      console.error('删除餐桌失败:', error);
      alert('删除失败，请重试。');
    }
  }
};

// onMounted(() => {
//   getStoredPermissions();
//   fetchTables();
// });
</script>