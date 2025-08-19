<template>
  <div class="dashboard-content">
    <h3>订单管理</h3>

    <div class="filter-buttons">
      <button @click="filterByStatus('all')" :class="{ 'active': currentFilter === 'all' }">所有订单</button>
      <button @click="filterByStatus('pending')" :class="{ 'active': currentFilter === 'pending' }">待处理</button>
      <button @click="filterByStatus('preparing')" :class="{ 'active': currentFilter === 'preparing' }">准备中</button>
      <button @click="filterByStatus('served')" :class="{ 'active': currentFilter === 'served' }">已上菜</button>
      <button @click="filterByStatus('completed')" :class="{ 'active': currentFilter === 'completed' }">已完成</button>
      <button @click="filterByStatus('cancelled')" :class="{ 'active': currentFilter === 'cancelled' }">已取消</button>
    </div>

    <div v-if="filteredOrders.length > 0" class="table-container">
      <table>
        <thead>
          <tr>
            <th>桌号</th>
            <th>状态</th>
            <th>总价格</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="order in filteredOrders" :key="order.id">
            <tr class="order-row">
              <td>{{ order.table_number }}</td>
              <td>
                <span :class="['status-badge', 'status-' + order.status]">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td>{{ order.total_price }}</td>
              <td class="table-actions">
                <button v-if="hasPermission('core.change_order')" @click="showStatusModal(order)" class="small-action-button edit-button">修改状态</button>
              </td>
            </tr>
            <tr class="order-items-row">
              <td colspan="4">
                <div class="order-items-list">
                  <div class="list-header">
                    <span>菜单项</span>
                    <span>数量</span>
                    <span>单价</span>
                    <span>操作</span>
                  </div>
                  <div v-for="item in order.items" :key="item.id" class="list-item">
                    <span>{{ item.menu_item.name }}</span>
                    <span>{{ item.quantity }}</span>
                    <span>￥{{ item.price }}</span>
                    <span class="item-actions">
                      <button v-if="hasPermission('core.change_orderitem')" @click="editItemQuantity(item)" class="small-action-button edit-button">修改</button>
                      <button v-if="hasPermission('core.delete_orderitem')" @click="deleteItem(item.id)" class="small-action-button delete-button">删除</button>
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>没有找到任何订单。</p>
    </div>
  </div>
  
  <div v-if="isStatusModalVisible" class="modal-overlay">
    <div class="modal-content">
      <h4>修改订单 {{ selectedOrder.id }} 状态</h4>
      <p>当前状态: 
        <span :class="['status-badge', 'status-' + selectedOrder.status]">
          {{ getStatusText(selectedOrder.status) }}
        </span>
      </p>
      <div class="status-options">
        <label v-for="(text, status) in statusMap" :key="status" class="status-label">
          <input type="radio" v-model="newStatus" :value="status">
          {{ text }}
        </label>
      </div>
      <div class="modal-actions">
        <button @click="handleStatusChange" class="submit-button">保存</button>
        <button @click="isStatusModalVisible = false" class="cancel-button">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getOrders, changeOrderStatus, updateOrderItemQuantity, deleteOrderItem } from '@/remote/api.js';

const orders = ref([]);
const currentFilter = ref('all');
const userPermissions = ref([]);

// 状态管理
const isStatusModalVisible = ref(false);
const selectedOrder = ref({});
const newStatus = ref('');

const statusMap = {
    'pending': '待处理',
    'preparing': '准备中',
    'served': '已上菜',
    'completed': '已完成',
    'cancelled': '已取消'
};

const hasPermission = (permission) => {
  return userPermissions.value.includes(permission);
};

const getStoredPermissions = () => {
  const permissions = localStorage.getItem('userPermissions');
  userPermissions.value = permissions ? JSON.parse(permissions) : [];
};

const filteredOrders = computed(() => {
  if (currentFilter.value === 'all') {
    return orders.value;
  }
  return orders.value.filter(order => order.status === currentFilter.value);
});

const fetchOrders = async () => {
  try {
    const data = await getOrders();
    orders.value = data;
  } catch (error) {
    console.error('获取订单列表失败:', error);
  }
};

const filterByStatus = (status) => {
  currentFilter.value = status;
};

const getStatusText = (status) => {
  return statusMap[status] || status;
};

// 显示修改状态模态框
const showStatusModal = (order) => {
  selectedOrder.value = order;
  newStatus.value = order.status; // 默认选中当前状态
  isStatusModalVisible.value = true;
};

// 处理状态修改
const handleStatusChange = async () => {
  try {
    if (newStatus.value && newStatus.value !== selectedOrder.value.status) {
      await changeOrderStatus(selectedOrder.value.id, newStatus.value);
      alert('订单状态已更新。');
      isStatusModalVisible.value = false;
      fetchOrders(); // 刷新列表
    }
  } catch (error) {
    console.error('修改状态失败:', error);
    alert('修改状态失败，请重试。');
  }
};

// 其他操作函数保持不变
const editItemQuantity = async (item) => {
  const newQuantity = parseInt(prompt(`请输入 ${item.menu_item.name} 的新数量:`));
  if (newQuantity > 0) {
    try {
      await updateOrderItemQuantity(item.id, newQuantity);
      fetchOrders();
      alert('订单项数量已更新。');
    } catch (error) {
      console.error('修改数量失败:', error);
    }
  }
};

const deleteItem = async (itemId) => {
  if (confirm('确定要从订单中删除此项吗？')) {
    try {
      await deleteOrderItem(itemId);
      fetchOrders();
      alert('订单项已删除。');
    } catch (error) {
      console.error('删除订单项失败:', error);
    }
  }
};

onMounted(() => {
  getStoredPermissions();
  fetchOrders();
});
</script>