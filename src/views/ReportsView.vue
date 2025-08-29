<template>
    <div class="dashboard-content">
        <h3>报表统计</h3>

        <div class="report-controls">
        <label for="startDate">开始日期:</label>
        <input type="date" id="startDate" v-model="startDate" />
        <label for="endDate">结束日期:</label>
        <input type="date" id="endDate" v-model="endDate" />
        <button @click="generateReport" class="generate-btn">生成报表</button>
        </div>

        <div v-if="reportData" class="report-container">
        <p class="report-info">
            报表范围: {{ reportData.query_range.start_date }} 至 {{ reportData.query_range.end_date }}
        </p>
        <div class="report-summary">
            <div class="summary-card">
            <h4>总收入</h4>
            <p class="summary-value">￥{{ parseFloat(reportData.summary.total_revenue).toFixed(2) }}</p>
            </div>
            <div class="summary-card">
            <h4>总订单数</h4>
            <p class="summary-value">{{ reportData.summary.total_orders }}</p>
            </div>
            <div class="summary-card">
            <h4>平均订单价值</h4>
            <p class="summary-value">￥{{ parseFloat(reportData.summary.average_order_value).toFixed(2) }}</p>
            </div>
        </div>
        <div class="report-top-items">
            <h4>畅销商品</h4>
            <table v-if="reportData.top_selling_items.length > 0">
            <thead>
                <tr>
                <th>商品名称</th>
                <th>销售数量</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in reportData.top_selling_items" :key="index">
                <td>{{ item.menu_item__name }}</td>
                <td>{{ item.total_sold }}</td>
                </tr>
            </tbody>
            </table>
            <p v-else class="no-data-msg">暂无畅销商品数据</p>
        </div>
        </div>
        <div v-else class="no-data-msg">
        <p>请选择日期范围生成报表</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getReportSummary } from '@/remote/api.js';

const reportData = ref(null);
const startDate = ref('');
const endDate = ref('');

const fetchReport = async () => {
    try {
        reportData.value = await getReportSummary(startDate.value, endDate.value);
    } catch (error) {
        console.error('获取报表数据失败:', error);
        reportData.value = null;
    }
};

const generateReport = () => {
    fetchReport();
};

onMounted(() => {
    const today = new Date().toISOString().slice(0, 10);
    startDate.value = today;
    endDate.value = today;
    fetchReport();
});
</script>