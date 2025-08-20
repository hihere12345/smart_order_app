import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const API_ADMIN_TABLES_URL = `${API_BASE_URL}/admin/tables`;
const API_ADMIN_MENU_URL = `${API_BASE_URL}/admin/menu`;
const API_STAFF_ORDERS_URL = `${API_BASE_URL}/staff/orders`;
const API_STAFF_ORDER_ITEMS_URL = `${API_BASE_URL}/staff/order-items`;
const API_TABLES_URL = `${API_BASE_URL}/tables`;

/**
 * 设置Axios的默认配置，例如Bearer Token
 * @param {string} token
 */
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

/**
 * 处理用户登录请求
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<object>} - 登录成功时返回包含 token 的 Promise
 */
export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/login/`, {
    username,
    password
  });
  return response.data;
};

/**
 * 获取当前登录用户的权限
 * @returns {Promise<string[]>} - 权限列表
 */
export const getPermissions = async () => {
  const response = await axios.get(`${API_BASE_URL}/permissions/`);
  return response.data.permissions; // 假设后端返回 { "permissions": ["permission1", "permission2"] }
};

// 新增：获取所有餐桌的列表
export const getTables = async () => {
  const response = await axios.get(`${API_ADMIN_TABLES_URL}/`);
  return response.data; // 假设返回一个餐桌对象的数组
};

// 新增：添加一个新餐桌
export const addTable = async (tableData) => {
  const response = await axios.post(`${API_ADMIN_TABLES_URL}/`, tableData);
  return response.data;
};

// 新增：删除一个餐桌
export const deleteTable = async (tableNumber) => {
  const response = await axios.delete(`${API_ADMIN_TABLES_URL}/${tableNumber}/`);
  return response.data;
};

// 新增：更新一个餐桌的信息
export const updateTable = async (tableNumber, tableData) => {
  const response = await axios.put(`${API_ADMIN_TABLES_URL}/${tableNumber}/`, tableData);
  return response.data;
};

export const getMenu = async () => {
  const response = await axios.get(`${API_ADMIN_MENU_URL}/`);
  return response.data;
};

export const addMenu = async (menuData) => {
  const response = await axios.post(`${API_ADMIN_MENU_URL}/`, menuData);
  return response.data;
};

export const deleteMenu = async (menuId) => {
  const response = await axios.delete(`${API_ADMIN_MENU_URL}/${menuId}/`);
  return response.data;
};

export const updateMenu = async (menuId, menuData) => {
  const response = await axios.put(`${API_ADMIN_MENU_URL}/${menuId}/`, menuData);
  return response.data;
};

// 订单管理 API (新增)
export const getOrders = async () => {
  // 假设后端返回一个包含订单列表的数组
  const response = await axios.get(`${API_STAFF_ORDERS_URL}/`);
  return response.data;
};
export const changeOrderStatus = async (orderId, newStatus) => {
  // 假设后端有一个用于更新状态的 API
  console.info(`${API_STAFF_ORDERS_URL}/${orderId}/status/`)
  console.info(newStatus)
  const response = await axios.patch(`${API_STAFF_ORDERS_URL}/${orderId}/status/`, { status: newStatus });
  return response.data;
};
export const updateOrderItemQuantity = async (itemId, newQuantity) => {
  // 假设后端有一个用于更新订单项数量的 API
  const response = await axios.patch(`${API_STAFF_ORDER_ITEMS_URL}/${itemId}/`, { quantity: newQuantity });
  return response.data;
};
export const deleteOrderItem = async (itemId) => {
  // 假设后端有一个用于删除订单项的 API
  const response = await axios.delete(`${API_STAFF_ORDER_ITEMS_URL}/${itemId}/`);
  return response.data;
};

export const getTableMenu = async (tableNumber) => {
  const response = await axios.get(`${API_TABLES_URL}/${tableNumber}/menu/`);
  return response.data;
};

// 新增：提交新订单
export const submitOrder = async (tableNumber, orderData) => {
  const response = await axios.post(`${API_TABLES_URL}/${tableNumber}/order/`, orderData);
  return response.data;
};

// 新增：获取当前餐桌的待支付订单
export const getTableUnpaidOrder = async (tableNumber) => {
    const response = await axios.get(`${API_TABLES_URL}/${tableNumber}/order/`);
    return response.data;
};

// 新增：支付订单
export const payOrder = async (orderId) => {
  const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/pay/`);
  return response.data;
};