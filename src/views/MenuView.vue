<template>
  <div class="dashboard-content">
    <h3>菜单管理</h3>
    <button v-if="hasPermission('core.add_menuitem')" @click="addMenuAction" class="add-button">添加菜单项</button>
    <div v-if="menuList.length > 0" class="table-container">
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>描述</th>
            <th>价格</th>
            <th>是否可用</th>
            <th class="actions-header">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="menu in menuList" :key="menu.id">
            <td>{{ menu.name }}</td>
            <td>{{ menu.description }}</td>
            <td>{{ menu.price }}</td>
            <td>{{ menu.is_available ? '是' : '否' }}</td>
            <td class="table-actions">
              <button v-if="hasPermission('core.change_menuitem')" @click="updateMenuAction(menu)" class="small-action-button edit-button">编辑</button>
              <button v-if="hasPermission('core.delete_menuitem')" @click="deleteMenuAction(menu.id)" class="small-action-button delete-button">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>没有找到任何菜单。</p>
    </div>
  </div>

  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content">
      <h4>{{ isEditMode ? '编辑菜单' : '添加菜单' }}</h4>
      <form @submit.prevent="handleFormSubmit">
        <div class="form-group">
          <label for="name">菜品名:</label>
          <input type="text" id="name" v-model="form.name" required>
        </div>
        <div class="form-group">
          <label for="description">描述:</label>
          <input type="text" id="description" v-model="form.description" required>
        </div>
        <div class="form-group">
          <label for="price">价格:</label>
          <input type="text" id="price" v-model="form.price" required>
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
import { ref, onMounted } from 'vue';
import { getMenu, addMenu, updateMenu, deleteMenu } from '@/remote/api.js';

const menuList = ref([]);
const userPermissions = ref([]);
const isModalVisible = ref(false);
const isEditMode = ref(false);
const form = ref({
  id: null,
  name: '',
  description: '',
  price: '',
  is_available: true,
});

const hasPermission = (permission) => {
  return userPermissions.value.includes(permission);
};

const fetchMenuList = async () => {
  try {
    const data = await getMenu();
    menuList.value = data;
  } catch (error) {
    console.error('获取菜单失败:', error);
  }
};

const getStoredPermissions = () => {
  const permissions = localStorage.getItem('userPermissions');
  userPermissions.value = permissions ? JSON.parse(permissions) : [];
};

const addMenuAction = () => {
  isEditMode.value = false;
  form.value = {
    id: null,
    name: '',
    description: '',
    price: '',
    is_available: true,
  };
  isModalVisible.value = true;
};

const updateMenuAction = (menu) => {
  isEditMode.value = true;
  form.value = { ...menu };
  isModalVisible.value = true;
};

const hideModal = () => {
  isModalVisible.value = false;
};

const handleFormSubmit = async () => {
  try {
    if (isEditMode.value) {
      await updateMenu(form.value.id, {
        name: form.value.name,
        description: form.value.description,
        price: form.value.price,
        is_available: form.value.is_available
      });
    } else {
      await addMenu({
        name: form.value.name,
        description: form.value.description,
        price: form.value.price,
        is_available: form.value.is_available
      });
    }

    hideModal();
    fetchMenuList();
  } catch (error) {
    console.error('操作失败:', error);
    alert('操作失败，请重试。');
  }
};

const deleteMenuAction = async (menuId) => {
  if (confirm('确定要删除这个菜单项吗？')) {
    try {
      await deleteMenu(menuId);
      console.log('菜单项删除成功');
      fetchMenuList();
    } catch (error) {
      console.error('删除菜单项失败:', error);
      alert('删除失败，请重试。');
    }
  }
};

onMounted(() => {
  getStoredPermissions();
  fetchMenuList();
});
</script>