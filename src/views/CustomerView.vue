<template>
  <div class="customer-main-container">
    <div class="card customer-view-card">
      
      <div v-if="currentPage === 'menu'">
        <h2>欢迎！请浏览菜单</h2>
        <div class="menu-list">
          <div v-for="item in menuItems" :key="item.id" class="menu-item">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">￥{{ item.price }}</span>
            <div class="quantity-control">
              <button @click="decreaseQuantity(item.id)">-</button>
              <span>{{ selectedItems[item.id] || 0 }}</span>
              <button @click="increaseQuantity(item.id)">+</button>
            </div>
          </div>
        </div>

        <button 
          @click="submitOrder" 
          :disabled="orderItems.length === 0" 
          class="submit-order-btn"
        >
          {{ pendingOrder ? '加单' : '下单' }} (总计: ￥{{ total }})
        </button>

        <button 
          v-if="pendingOrder" 
          @click="showOrderView" 
          class="view-order-btn"
        >
          查看订单
        </button>
      </div>

      <div v-if="currentPage === 'order'">
        <h2>我的订单</h2>
        <div v-if="order && order.status !== 'completed' && order.status !== 'cancelled'">
          <div class="order-details">
            <p>订单号: <strong>{{ order.id }}</strong></p>
            <p>状态: 
              <span :class="['status-badge', 'status-' + order.status]">
                {{ getStatusText(order.status) }}
              </span>
            </p>
            <p>总计: <strong>￥{{ totalOrderAmount }}</strong></p>
          </div>

          <div class="order-items-list">
            <h4>订单详情</h4>
            <div class="list-header">
              <span>菜单项</span>
              <span>数量</span>
              <span>单价</span>
            </div>
            <div v-for="item in order.items" :key="item.id" class="list-item">
              <span>{{ item.menu_item.name }}</span>
              <span>{{ item.quantity }}</span>
              <span>￥{{ item.price }}</span>
            </div>
          </div>
          
          <button @click="pay" class="pay-button">去支付</button>
          <button @click="showMenuView" class="go-to-menu-btn">继续加单</button>
        </div>
        <div v-else>
          <p>您的订单已完成或已取消。</p>
          <button @click="showMenuView" class="go-to-menu-btn">返回菜单</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  getTableMenu, 
  submitOrder as submitNewOrder, 
  getTableUnpaidOrder, 
  payOrder
} from '@/remote/api.js';

const route = useRoute();

const currentPage = ref('menu'); // 'menu' 或 'order'
const tableNumber = route.params.tableNumber;
const menuItems = ref([]);
const selectedItems = ref({});
const pendingOrder = ref(null);
const order = ref(null); // 用于订单视图的订单数据

// ==================== 菜单视图逻辑 ====================
const orderItems = computed(() => {
  const items = [];
  for (const id in selectedItems.value) {
    if (selectedItems.value[id] > 0) {
      items.push({
        menu_item_id: id,
        quantity: selectedItems.value[id]
      });
    }
  }
  return items;
});

const total = computed(() => {
  let sum = 0;
  for (const id in selectedItems.value) {
    const item = menuItems.value.find(i => i.id == id);
    if (item) {
      sum += item.price * selectedItems.value[id];
    }
  }
  return sum;
});

const increaseQuantity = (itemId) => {
  selectedItems.value[itemId] = (selectedItems.value[itemId] || 0) + 1;
};

const decreaseQuantity = (itemId) => {
  if (selectedItems.value[itemId] > 0) {
    selectedItems.value[itemId]--;
  }
};

const submitOrder = async () => {
  if (orderItems.value.length === 0) {
    alert('请选择菜单项再下单！');
    return;
  }
  try {
    const items = orderItems.value;
    const orderData = { items: items };
    await submitNewOrder(tableNumber, orderData);
    alert('下单成功！');
    showOrderView(); // 下单或加单成功后跳转到订单页面
  } catch (error) {
    console.error('下单或加单失败:', error);
    alert('操作失败，请重试。');
  }
};

// ==================== 订单视图逻辑 ====================
const totalOrderAmount = computed(() => {
  if (!order.value || !order.value.items) return 0;
  return order.value.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const getStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'preparing': '准备中',
    'served': '已上菜',
    'completed': '已完成',
    'cancelled': '已取消'
  };
  return statusMap[status] || status;
};

const fetchPendingOrder = async () => {
  try {
    order.value = await getTableUnpaidOrder(tableNumber);
    pendingOrder.value = order.value;
  } catch (error) {
      console.error('获取未支付订单失败:', error);
      order.value = null;
      pendingOrder.value = null;
  }
};

const pay = async () => {
  if (order.value) {
    try {
      await payOrder(order.value.id);
      alert('支付成功！');
      await fetchPendingOrder(); // 重新获取订单，状态应该变为“已完成”
      if (!pendingOrder.value) {
        showMenuView();
      }
    } catch (error) {
      console.error('支付失败:', error);
      alert('支付失败，请重试。');
    }
  }
};

// ==================== 页面切换逻辑 ====================
const showMenuView = async () => {
  currentPage.value = 'menu';
  selectedItems.value = {}; // 切换回菜单时清空选中项
  await fetchPendingOrder(); // 重新检查是否有待支付订单
};

const showOrderView = async () => {
  currentPage.value = 'order';
  await fetchPendingOrder(); // 确保订单数据是最新的
};

// ==================== 页面加载 ====================
onMounted(async () => {
  try {
    menuItems.value = await getTableMenu(tableNumber);
    await fetchPendingOrder();
  } catch (error) {
    console.error('获取数据失败:', error);
    alert('获取数据失败，请稍后再试。');
  }
});
</script>