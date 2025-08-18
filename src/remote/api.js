import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const API_ADMIN_TABLES_URL = `${API_BASE_URL}/admin/tables`;
const API_ADMIN_MENU_URL = `${API_BASE_URL}/admin/menu`;

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
export const deleteTable = async (tableId) => {
  const response = await axios.delete(`${API_ADMIN_TABLES_URL}/${tableId}/`);
  return response.data;
};

// 新增：更新一个餐桌的信息
export const updateTable = async (tableId, tableData) => {
  const response = await axios.put(`${API_ADMIN_TABLES_URL}/${tableId}/`, tableData);
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