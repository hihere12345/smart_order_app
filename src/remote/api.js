import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

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