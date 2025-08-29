如何运行该项目：
1. 确保python+Django的后端API服务已经启动。
2. 安装依赖：npm install
3. 运行服务：npm run dev
4. 通过http://localhost:5173访问顾客页面
5. 通过http://localhost:5173/dashboard访问管理后台
   1. 用户名：manager1，密码：smartorder123 经理角色，拥有大部分管理权限
   2. 用户名：waiter1，密码：smartorder123 服务员角色，拥有查看餐桌和订单管理权限
   3. 用户名：cook1，密码：smartorder123 厨师角色，拥有查看订单权限