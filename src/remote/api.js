import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * 处理用户登录请求
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<object>} - 登录成功时返回包含 token 的 Promise
 */
export const login = async (username, password) => {
  // 移除 try...catch 块，让错误自然抛出
  const response = await axios.post(`${API_BASE_URL}/login/`, {
    username,
    password
  });
  return response.data;
};

/**
 * 获取受保护的仪表盘数据
 * @param {string} token - 用户的认证 token
 * @returns {Promise<object>} - 仪表盘数据
 */
export const getDashboardData = async (token) => {
  // 同样移除 try...catch 块
  const response = await axios.get(`${API_BASE_URL}/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};