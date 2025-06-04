<template>
  <div class="iot-dashboard">
    <div class="dashboard-header">
      <h1>物联平台监控大屏</h1>
      <div class="time">{{ currentTime }}</div>
    </div>
    <div class="dashboard-content">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon device">
            <el-icon><Monitor /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ deviceStats.total }}</div>
            <div class="stat-label">设备总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon online">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ deviceStats.online }}</div>
            <div class="stat-label">在线设备</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon offline">
            <el-icon><CircleClose /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ deviceStats.offline }}</div>
            <div class="stat-label">离线设备</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon alarm">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ alarmStats.total }}</div>
            <div class="stat-label">告警数量</div>
          </div>
        </div>
      </div>
      <!-- 图表区域 -->
      <div class="charts-container">
        <div class="chart-item">
          <div class="chart-title">设备类型分布</div>
          <div ref="deviceTypeChart" class="chart"></div>
        </div>
        <div class="chart-item">
          <div class="chart-title">设备状态趋势</div>
          <div ref="deviceTrendChart" class="chart"></div>
        </div>
        <div class="chart-item">
          <div class="chart-title">告警统计</div>
          <div ref="alarmChart" class="chart"></div>
        </div>
        <div class="chart-item">
          <div class="chart-title">实时监控</div>
          <div ref="realtimeChart" class="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="IotDashboard">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 当前时间
const currentTime = ref('')
let timeInterval: NodeJS.Timeout

// 统计数据
const deviceStats = reactive({
  total: 0,
  online: 0,
  offline: 0
})

const alarmStats = reactive({
  total: 0,
  unhandled: 0
})

// 图表引用
const deviceTypeChart = ref()
const deviceTrendChart = ref()
const alarmChart = ref()
const realtimeChart = ref()

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 初始化设备类型分布图表
const initDeviceTypeChart = () => {
  const chart = echarts.init(deviceTypeChart.value)
  const option = {
    title: {
      text: '设备类型分布',
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 35, name: '摄像头' },
          { value: 25, name: '门禁' },
          { value: 20, name: '温湿度' },
          { value: 15, name: '烟感' },
          { value: 10, name: '灯光' },
          { value: 8, name: '空调' },
          { value: 5, name: '开关' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

// 初始化设备状态趋势图表
const initDeviceTrendChart = () => {
  const chart = echarts.init(deviceTrendChart.value)
  const option = {
    title: {
      text: '设备状态趋势',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['在线设备', '离线设备'],
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '在线设备',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
        smooth: true,
        itemStyle: {
          color: '#67C23A'
        }
      },
      {
        name: '离线设备',
        type: 'line',
        data: [20, 18, 25, 16, 30, 10, 15],
        smooth: true,
        itemStyle: {
          color: '#F56C6C'
        }
      }
    ]
  }
  chart.setOption(option)
}

// 获取统计数据
const getStatistics = async () => {
  try {
    // 这里应该调用实际的API获取统计数据
    deviceStats.total = 150
    deviceStats.online = 135
    deviceStats.offline = 15
    alarmStats.total = 8
    alarmStats.unhandled = 3
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  // 初始化时间
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  // 获取统计数据
  getStatistics()
  // 初始化图表
  setTimeout(() => {
    initDeviceTypeChart()
    initDeviceTrendChart()
  }, 100)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped lang="less">
.iot-dashboard {
  padding: 20px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  min-height: 100vh;
  color: #fff;
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    h1 {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }
    .time {
      font-size: 18px;
      font-weight: 500;
    }
  }
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
    .stat-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 20px;
      display: flex;
      align-items: center;
      backdrop-filter: blur(10px);
      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        .el-icon {
          font-size: 24px;
        }
        &.device {
          background: #409eff;
        }
        &.online {
          background: #67c23a;
        }
        &.offline {
          background: #f56c6c;
        }
        &.alarm {
          background: #e6a23c;
        }
      }
      .stat-info {
        .stat-number {
          font-size: 32px;
          font-weight: bold;
          line-height: 1;
        }
        .stat-label {
          font-size: 14px;
          opacity: 0.8;
          margin-top: 5px;
        }
      }
    }
  }
  .charts-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    .chart-item {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 20px;
      backdrop-filter: blur(10px);
      .chart-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        text-align: center;
      }
      .chart {
        height: 300px;
      }
    }
  }
}
</style>
