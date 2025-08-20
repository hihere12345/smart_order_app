<template>
  <div class="dashboard-content">
    <h3>订单管理</h3>

    <div class="filter-checkboxes">
      <label v-for="(text, status) in statusMap" :key="status" class="filter-label">
        <input type="checkbox" :value="status" v-model="selectedStatuses">
        {{ text }}
      </label>
    </div>

    <div v-if="showNewOrUpdatedAlert" class="new-order-alert">
      有新的订单或订单已更新！
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
                    <span :class="{'highlight-change': item.highlightQuantity}">{{ item.quantity }}</span>
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { getOrders, changeOrderStatus, updateOrderItemQuantity, deleteOrderItem } from '@/remote/api.js';

const orders = ref([]);
const userPermissions = ref([]);
const isStatusModalVisible = ref(false);
const selectedOrder = ref({});
const newStatus = ref('');
const showNewOrUpdatedAlert = ref(false);
const selectedStatuses = ref([]);
let orderFetchInterval;

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

const getStatusText = (status) => {
  return statusMap[status] || status;
};

const fetchOrders = async () => {
  try {
    const newData = await getOrders();
    const oldOrders = orders.value;

    if (oldOrders.length === 0) {
      orders.value = newData;
      return;
    }

    let hasUpdated = false;
    const oldOrdersMap = new Map(oldOrders.map(o => [o.id, o]));
    const updatedOrders = [];

    for (const newOrder of newData) {
      const oldOrder = oldOrdersMap.get(newOrder.id);

      if (!oldOrder) {
        // 新订单
        newOrder.isNew = true;
        hasUpdated = true;
      } else {
        // 现有订单，检查具体变化
        const oldOrderString = JSON.stringify(oldOrder);
        const newOrderString = JSON.stringify(newOrder);

        if (oldOrderString !== newOrderString) {
          hasUpdated = true;
          // 检查状态变化
          if (newOrder.status !== oldOrder.status) {
            newOrder.highlightStatus = true;
          }
          // 检查订单项数量变化
          const oldItemsMap = new Map(oldOrder.items.map(i => [i.id, i]));
          for (const newItem of newOrder.items) {
            const oldItem = oldItemsMap.get(newItem.id);
            if (!oldItem || newItem.quantity !== oldItem.quantity) {
              newItem.highlightQuantity = true;
            }
          }
        }
      }
      updatedOrders.push(newOrder);
    }

    if (newData.length !== oldOrders.length) {
        hasUpdated = true;
    }

    orders.value = updatedOrders;

    if (hasUpdated) {
      showNewOrUpdatedAlert.value = true;
      setTimeout(() => {
        showNewOrUpdatedAlert.value = false;
      }, 5000);
    }
  } catch (error) {
    console.error('获取订单列表失败:', error);
  }
};

onMounted(() => {
  getStoredPermissions();
  fetchOrders();
  orderFetchInterval = setInterval(fetchOrders, 5000); // 每10秒获取一次
});

onUnmounted(() => {
  clearInterval(orderFetchInterval);
});

const filteredOrders = computed(() => {
  if (selectedStatuses.value.length === 0) {
    return orders.value;
  }
  return orders.value.filter(order => selectedStatuses.value.includes(order.status));
});

watch(selectedStatuses, (newVal) => {
  if (newVal.length === 0) {
    selectedStatuses.value = ['pending'];
  }
}, { immediate: true });

const showStatusModal = (order) => {
  selectedOrder.value = order;
  newStatus.value = order.status;
  isStatusModalVisible.value = true;
};

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