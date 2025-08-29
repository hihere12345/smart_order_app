import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.171:8000/api';
const API_ADMIN_TABLES_URL = `${API_BASE_URL}/admin/tables`;
const API_ADMIN_MENU_URL = `${API_BASE_URL}/admin/menu`;
const API_STAFF_ORDERS_URL = `${API_BASE_URL}/staff/orders`;
const API_STAFF_ORDER_ITEMS_URL = `${API_BASE_URL}/staff/order-items`;
const API_REPORT_URL = `${API_BASE_URL}/reports`;
const API_TABLES_URL = `${API_BASE_URL}/tables`;

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/login/`, {
    username,
    password
  });
  return response.data;
};

export const getPermissions = async () => {
  const response = await axios.get(`${API_BASE_URL}/permissions/`);
  return response.data;
};

export const getTables = async () => {
  const response = await axios.get(`${API_ADMIN_TABLES_URL}/`);
  return response.data;
};

export const addTable = async (tableData) => {
  const response = await axios.post(`${API_ADMIN_TABLES_URL}/`, tableData);
  return response.data;
};

export const deleteTable = async (tableNumber) => {
  const response = await axios.delete(`${API_ADMIN_TABLES_URL}/${tableNumber}/`);
  return response.data;
};

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

export const getOrders = async () => {
  const response = await axios.get(`${API_STAFF_ORDERS_URL}/`);
  return response.data;
};
export const changeOrderStatus = async (orderId, newStatus) => {
  console.info(`${API_STAFF_ORDERS_URL}/${orderId}/status/`)
  console.info(newStatus)
  const response = await axios.patch(`${API_STAFF_ORDERS_URL}/${orderId}/status/`, { status: newStatus });
  return response.data;
};
export const updateOrderItemQuantity = async (itemId, newQuantity) => {
  const response = await axios.patch(`${API_STAFF_ORDER_ITEMS_URL}/${itemId}/`, { quantity: newQuantity });
  return response.data;
};
export const deleteOrderItem = async (itemId) => {
  const response = await axios.delete(`${API_STAFF_ORDER_ITEMS_URL}/${itemId}/`);
  return response.data;
};

export const getTableMenu = async (tableNumber) => {
  const response = await axios.get(`${API_TABLES_URL}/${tableNumber}/menu/`);
  return response.data;
};

export const submitOrder = async (tableNumber, orderData) => {
  const response = await axios.post(`${API_TABLES_URL}/${tableNumber}/order/`, orderData);
  return response.data;
};

export const getTableUnpaidOrder = async (tableNumber) => {
    const response = await axios.get(`${API_TABLES_URL}/${tableNumber}/order/`);
    return response.data;
};

export const payOrder = async (orderId) => {
  const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/pay/`);
  return response.data;
};

export const getReportSummary = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  return await axios.get(`${API_REPORT_URL}`, { params }).then(res => res.data);
};