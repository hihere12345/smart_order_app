import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles.css' // 导入全局样式文件

const app = createApp(App)

app.use(router)
app.mount('#app')