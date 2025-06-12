<template>
  <div class="screen-container bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen">
    <div class="top-bar bg-blue-900/50 backdrop-blur-md py-4 px-6 flex justify-between items-center mb-6">
      <div class="title text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-white flex items-center">
        <i class="fa fa-microchip mr-3 text-blue-400"></i>
        <span>物联网设备监控大屏</span>
      </div>
      <div class="time text-white/80 text-lg" :class="{ 'animate-pulse': pulseTime }">{{ nowTime }}</div>
    </div>

    <el-row :gutter="20" class="screen-grid px-4">
      <!-- 设备统计卡片 -->
      <el-col :span="24">
        <div class="stat-cards flex flex-wrap gap-4 mb-6">
          <div class="stat-card bg-gradient-to-br from-blue-800/80 to-blue-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-700/30 flex-1 min-w-[200px]">
            <div class="stat-title text-white/80 text-sm mb-2">设备总数</div>
            <div class="stat-value text-white text-3xl font-bold">{{ summary.deviceTotal || 0 }}</div>
            <div class="stat-change flex items-center mt-2 text-green-400">
              <i class="fa fa-arrow-up mr-1"></i>
              <span></span>
            </div>
          </div>

          <div class="stat-card bg-gradient-to-br from-green-800/80 to-green-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-700/30 flex-1 min-w-[200px]">
            <div class="stat-title text-white/80 text-sm mb-2">今日新增</div>
            <div class="stat-value text-white text-3xl font-bold">{{ summary.deviceToday || 0 }}</div>
            <div class="stat-change flex items-center mt-2 text-green-400">
              <i class="fa fa-arrow-up mr-1"></i>
              <span></span>
            </div>
          </div>

          <div class="stat-card bg-gradient-to-br from-yellow-800/80 to-yellow-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-yellow-700/30 flex-1 min-w-[200px]">
            <div class="stat-title text-white/80 text-sm mb-2">在线设备</div>
            <div class="stat-value text-white text-3xl font-bold">{{ summary.deviceOnline || 0 }}</div>
            <div class="stat-change flex items-center mt-2 text-yellow-400">
              <i class="fa fa-minus mr-1"></i>
              <span></span>
            </div>
          </div>

          <div class="stat-card bg-gradient-to-br from-red-800/80 to-red-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-red-700/30 flex-1 min-w-[200px]">
            <div class="stat-title text-white/80 text-sm mb-2">今日告警</div>
            <div class="stat-value text-white text-3xl font-bold">{{ summary.alarmToday || 0 }}</div>
            <div class="stat-change flex items-center mt-2 text-red-400">
              <i class="fa fa-arrow-down mr-1"></i>
              <span></span>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 南京各区设备统计 -->
      <el-col :span="12">
        <div class="screen-panel bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transform transition-all hover:scale-[1.01] hover:shadow-xl">
          <div class="chart-title flex justify-between items-center mb-4">
            <div class="text-white text-xl font-semibold flex items-center">
              <i class="fa fa-bar-chart mr-2 text-blue-400"></i>
              南京各区设备统计
            </div>
          </div>
          <div ref="deviceDistrictChart" class="chart-container h-[320px]" />
        </div>
      </el-col>

      <!-- 设备点位地图 -->
      <el-col :span="12" :class="{ 'fixed top-0 left-0 right-0 bottom-0 z-50': isMapFullScreen }">
        <div
          class="screen-panel bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transform transition-all hover:scale-[1.01] hover:shadow-xl"
          :class="{ 'fixed top-0 left-0 right-0 bottom-0 z-50 rounded-none': isMapFullScreen }"
        >
          <div class="chart-title flex justify-between items-center mb-4">
            <div class="text-white text-xl font-semibold flex items-center">
              <i class="fa fa-map-marker mr-2 text-green-400"></i>
              设备点位地图（南京）
            </div>
            <div class="text-sm text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" @click="toggleFullScreen">
              <i class="fa" :class="isMapFullScreen ? 'fa-compress' : 'fa-expand'"></i>
              {{ isMapFullScreen ? '退出全屏' : '全屏' }}
            </div>
          </div>
          <div ref="deviceMapChart" class="chart-container" :class="{ 'h-[320px] w-full': !isMapFullScreen, 'h-[calc(100%-64px)] w-full': isMapFullScreen }" />
        </div>
      </el-col>

      <!-- 告警等级分布 -->
      <el-col :span="12">
        <div class="screen-panel bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transform transition-all hover:scale-[1.01] hover:shadow-xl">
          <div class="chart-title flex justify-between items-center mb-4">
            <div class="text-white text-xl font-semibold flex items-center">
              <i class="fa fa-exclamation-triangle mr-2 text-yellow-400"></i>
              告警等级分布
            </div>
          </div>
          <div ref="alarmLevelChart" class="chart-container h-[320px]" />
        </div>
      </el-col>

      <!-- 告警趋势 -->
      <el-col :span="12">
        <div class="screen-panel bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30 transform transition-all hover:scale-[1.01] hover:shadow-xl">
          <div class="chart-title flex justify-between items-center mb-4">
            <div class="text-white text-xl font-semibold flex items-center">
              <i class="fa fa-line-chart mr-2 text-purple-400"></i>
              告警趋势
            </div>
          </div>
          <div ref="alarmTrendChart" class="chart-container h-[320px]" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
// 注意：此脚本使用 ES 模块语法，需要通过 Vite 或 Webpack 等构建工具处理 .vue 文件
// 请确保项目配置了 TypeScript 和 Vue 支持，并安装了必要依赖（如 vue、echarts、element-plus）

import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import 'echarts/theme/dark'
import nanjing from '@/assets/map/nanjing.json'
import { getDeviceDistrictStats, getDeviceMap, getAlarmLevelStats, getAlarmTrend } from '@/api/modules/dashboard/index'
import { Dashboard } from '@/api/modules/dashboard/index'

// 注册南京地图
echarts.registerMap('nanjing', nanjing as any)

// 图表 DOM 引用
const deviceDistrictChart = ref<HTMLElement | null>(null)
const deviceMapChart = ref<HTMLElement | null>(null)
const alarmLevelChart = ref<HTMLElement | null>(null)
const alarmTrendChart = ref<HTMLElement | null>(null)
const charts = ref<echarts.ECharts[]>([])

// 数据变量
const districtData = ref<Dashboard.DeviceDistrictStat[]>([])
const mapData = ref<Dashboard.DeviceMapItem[]>([])
const levelData = ref<Dashboard.AlarmLevelStat[]>([])
const trendData = ref<Dashboard.AlarmTrendItem[]>([])
const summary = ref({})

// 时间和动画状态
const nowTime = ref(new Date().toLocaleString())
const pulseTime = ref(false)
const isMapFullScreen = ref(false)

// 每秒更新时间并触发脉冲动画
setInterval(() => {
  nowTime.value = new Date().toLocaleString()
  pulseTime.value = true
  setTimeout(() => (pulseTime.value = false), 500)
}, 1000)

// 初始化所有图表
const initCharts = () => {
  // 清理现有图表
  charts.value.forEach((chart) => chart.dispose())
  charts.value = []

  // 设备区域统计图（柱状图）
  if (deviceDistrictChart.value && districtData.value.length) {
    const chart = echarts.init(deviceDistrictChart.value, 'dark')
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(17, 25, 40, 0.8)',
        borderColor: 'rgba(76, 175, 80, 0.3)',
        borderWidth: 1,
        textStyle: { color: '#fff' },
        formatter: (params: any) => `
          <div style="color: #4CAF50; font-weight: bold;">${params[0].name}</div>
          <div>设备数量: <span style="color: #2196F3;">${params[0].value}</span></div>
        `
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: districtData.value.map((i) => i.district),
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)',
          interval: 0,
          rotate: 45
        },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: 'rgba(255, 255, 255, 0.7)' },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
      },
      series: [
        {
          type: 'bar',
          data: districtData.value.map((i) => i.count),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#409EFF' },
              { offset: 1, color: '#0E5CAD' }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '40%',
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#64B5F6' },
                { offset: 1, color: '#1976D2' }
              ])
            }
          }
        }
      ]
    })
    charts.value.push(chart)
  }

  // 设备点位地图（散点图）
  if (
    deviceMapChart.value &&
    mapData.value.length &&
    mapData.value.every((item) => item.name && Array.isArray(item.value) && item.value.length === 2 && typeof item.value[0] === 'number' && typeof item.value[1] === 'number')
  ) {
    const chart = echarts.init(deviceMapChart.value, 'dark')
    chart.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17, 25, 40, 0.8)',
        borderColor: 'rgba(76, 175, 80, 0.3)',
        borderWidth: 1,
        textStyle: { color: '#fff' },
        formatter: (params: any) => `${params.name}<br/>经度: ${params.value[0]}<br/>纬度: ${params.value[1]}`
      },
      geo: {
        map: 'nanjing',
        roam: true,
        label: {
          show: true,
          color: '#fff',
          fontSize: 10,
          formatter: (params: any) => params.name
        },
        itemStyle: {
          areaColor: 'rgba(7, 60, 118, 0.3)',
          borderColor: '#0f5f9a',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: { areaColor: 'rgba(43, 145, 183, 0.5)' }
        },
        layoutSize: '100%'
      },
      series: [
        {
          name: '设备点',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: mapData.value,
          symbolSize: 12,
          itemStyle: {
            color: '#67C23A',
            shadowBlur: 20,
            shadowColor: 'rgba(103, 194, 58, 0.5)'
          },
          emphasis: {
            symbolSize: 16,
            itemStyle: {
              color: '#8BC34A',
              shadowBlur: 30,
              shadowColor: 'rgba(139, 195, 74, 0.7)'
            }
          }
        }
      ]
    })
    charts.value.push(chart)
    setTimeout(() => chart.resize(), 100)
  }

  // 告警等级分布（饼图）
  if (alarmLevelChart.value && levelData.value.length) {
    const chart = echarts.init(alarmLevelChart.value, 'dark')
    chart.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17, 25, 40, 0.8)',
        borderColor: 'rgba(76, 175, 80, 0.3)',
        borderWidth: 1,
        textStyle: { color: '#fff' },
        formatter: (params: any) => `
          <div style="color: #FFC107; font-weight: bold;">${params.name}</div>
          <div>告警数量: <span style="color: #FF5722;">${params.value}</span></div>
          <div>占比: <span style="color: #FF5722;">${params.percent}%</span></div>
        `
      },
      legend: {
        bottom: 10,
        textStyle: { color: 'rgba(255, 255, 255, 0.7)' },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 15
      },
      series: [
        {
          name: '告警等级',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: '{b}: {d}%',
            color: 'rgba(255, 255, 255, 0.8)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderRadius: 4,
            padding: [2, 4]
          },
          labelLine: {
            show: true,
            lineStyle: { color: 'rgba(255, 255, 255, 0.3)' }
          },
          data: levelData.value.map((i) => ({
            value: i.count,
            name: i.level === 1 ? '低' : i.level === 2 ? '中' : '高',
            itemStyle: {
              color: i.level === 1 ? '#4CAF50' : i.level === 2 ? '#FFC107' : '#F44336'
            }
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
    charts.value.push(chart)
  }

  // 告警趋势（折线图）
  if (alarmTrendChart.value && trendData.value.length) {
    const chart = echarts.init(alarmTrendChart.value, 'dark')
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(17, 25, 40, 0.8)',
        borderColor: 'rgba(76, 175, 80, 0.3)',
        borderWidth: 1,
        textStyle: { color: '#fff' },
        formatter: (params: any) => `
          <div style="color: #E91E63; font-weight: bold;">告警数量: ${params[0].value}</div>
        `
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: [], // 不显示日期数据
        axisLabel: {
          show: false // 隐藏横轴标签
        },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: 'rgba(255, 255, 255, 0.7)' },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
      },
      series: [
        {
          data: trendData.value.map((i) => i.count),
          type: 'line',
          smooth: true,
          lineStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#E6A23C' },
              { offset: 1, color: '#FF9800' }
            ]),
            width: 3
          },
          itemStyle: {
            color: '#FF9800',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.8)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(230, 162, 60, 0.3)' },
              { offset: 1, color: 'rgba(230, 162, 60, 0.05)' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: '#FFC107',
              borderColor: 'rgba(255, 255, 255, 1)'
            }
          }
        }
      ]
    })
    charts.value.push(chart)
  }
}

// 切换地图全屏模式
const toggleFullScreen = () => {
  isMapFullScreen.value = !isMapFullScreen.value
  setTimeout(() => {
    if (charts.value[1]) {
      charts.value[1].resize()
    }
  }, 300)
}

// 增量更新图表数据
const updateCharts = () => {
  console.log('更新图表，charts:', charts.value.length, 'mapData:', mapData.value)
  if (charts.value[0] && districtData.value.length) {
    charts.value[0].setOption(
      {
        xAxis: { data: districtData.value.map((i) => i.district) },
        series: [{ data: districtData.value.map((i) => i.count) }]
      },
      true
    )
  }
  if (
    charts.value[1] &&
    mapData.value.length &&
    mapData.value.every((item) => item.name && Array.isArray(item.value) && item.value.length === 2 && typeof item.value[0] === 'number' && typeof item.value[1] === 'number')
  ) {
    charts.value[1].setOption(
      {
        series: [{ data: mapData.value }]
      },
      true
    )
  }
  if (charts.value[2] && levelData.value.length) {
    charts.value[2].setOption(
      {
        series: [
          {
            data: levelData.value.map((i) => ({
              value: i.count,
              name: i.level === 1 ? '低' : i.level === 2 ? '中' : '高'
            }))
          }
        ]
      },
      true
    )
  }
  if (charts.value[3] && trendData.value.length) {
    charts.value[3].setOption(
      {
        series: [{ data: trendData.value.map((i) => i.count) }]
      },
      true
    )
  }
}

// 初始化 WebSocket 连接
const initWebSocket = () => {
  const webSocket = new WebSocket('ws://localhost:8080/share-admin-api/ws/dashboard')

  webSocket.onopen = () => {
    console.log('✅ WebSocket 连接成功')
  }

  webSocket.onmessage = (event) => {
    console.log('📨 收到 WebSocket 消息:', event.data)
    try {
      const message = JSON.parse(event.data)
      if (message.type === 'dashboardData') {
        summary.value = message.summary || {}
        districtData.value = message.summary
          ? [
              { district: '设备总数', count: message.summary.deviceTotal },
              { district: '今日设备', count: message.summary.deviceToday },
              { district: '在线设备', count: message.summary.deviceOnline },
              { district: '告警设备', count: message.summary.alarmToday }
            ]
          : []
        mapData.value = message.deviceMap || []
        levelData.value = message.alarmLevelStats || []
        trendData.value = message.alarmTrend || []

        if (!charts.value.length) {
          initCharts()
        } else {
          updateCharts()
        }
      }
    } catch (error) {
      console.error('解析 WebSocket 消息失败:', error)
    }
  }

  webSocket.onerror = (error) => {
    console.error('❌ WebSocket 错误:', error)
    webSocket?.close()
    setTimeout(initWebSocket, 5000)
  }

  webSocket.onclose = () => {
    console.log('🔌 WebSocket 连接关闭')
    setTimeout(initWebSocket, 5000)
  }
}

// 获取初始数据
const fetchData = async () => {
  try {
    const districtResponse = await getDeviceDistrictStats()
    console.log('设备区域统计数据:', districtResponse)
    summary.value = districtResponse.data || {}
    districtData.value = districtResponse.data
      ? [
          { district: '设备总数', count: districtResponse.data.deviceTotal },
          { district: '今日设备', count: districtResponse.data.deviceToday },
          { district: '在线设备', count: districtResponse.data.deviceOnline },
          { district: '告警设备', count: districtResponse.data.alarmToday }
        ]
      : []

    const mapResponse = await getDeviceMap()
    console.log('设备点位地图数据:', mapResponse)
    mapData.value = mapResponse.data || []

    const levelResponse = await getAlarmLevelStats()
    console.log('告警等级分布数据:', levelResponse)
    levelData.value = levelResponse.data || []

    const trendResponse = await getAlarmTrend()
    console.log('告警趋势数据:', trendResponse)
    trendData.value = trendResponse.data || []

    initCharts()
  } catch (error) {
    console.error('获取初始数据失败:', error)
  }
}

// 组件生命周期钩子
onMounted(() => {
  fetchData() // 初次加载数据
  initWebSocket() // 初始化 WebSocket

  // 每10秒刷新数据
  const refreshInterval = setInterval(() => {
    fetchData()
  }, 10000)

  // 窗口大小变化时调整图表尺寸
  setTimeout(() => {
    window.addEventListener('resize', () => charts.value.forEach((c) => c.resize()))
  }, 500)

  // 组件卸载时清理资源
  onBeforeUnmount(() => {
    clearInterval(refreshInterval) // 清除刷新定时器
    charts.value.forEach((c) => c.dispose()) // 销毁图表
    charts.value = []
    window.removeEventListener('resize', () => charts.value.forEach((c) => c.resize()))
  })
})
</script>

<style scoped>
/* 导入外部字体 */
@font-face {
  font-family: 'Inter';
  src: url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
}

/* 基础样式 */
.screen-container {
  font-family: 'Inter', sans-serif;
  padding: 20px;
  color: #fff;
}

.top-bar {
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
}

.time {
  text-shadow: 0 0 10px rgba(100, 149, 237, 0.7);
}

.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.stat-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.2);
}

.screen-panel {
  transition: all 0.3s ease;
}

.screen-panel:hover {
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.2);
}

.screen-panel.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0;
  z-index: 50;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

.chart-container.full-screen {
  width: 100% !important;
  height: calc(100% - 64px) !important;
}

.chart-container {
  transition: all 0.3s ease;
}

.rank-list {
  margin-top: 20px;
}

.rank-list ul {
  list-style: none;
  padding: 0;
}

.rank-list li {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.rank-num {
  width: 40px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-right: 10px;
}

.rank-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-rate {
  min-width: 60px;
  text-align: right;
}
</style>
