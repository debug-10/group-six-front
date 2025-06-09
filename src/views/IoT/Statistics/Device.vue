<template>
  <div class="screen-container">
    <h1 class="screen-title">物联网设备监控大屏</h1>
    <el-row :gutter="20" class="screen-grid">
      <el-col :span="12">
        <div class="screen-panel">
          <div class="chart-title">南京各区设备统计</div>
          <div ref="deviceDistrictChart" class="chart-container" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="screen-panel">
          <div class="chart-title">设备点位地图（南京）</div>
          <div ref="deviceMapChart" class="chart-container" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="screen-panel">
          <div class="chart-title">告警等级分布</div>
          <div ref="alarmLevelChart" class="chart-container" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="screen-panel">
          <div class="chart-title">告警趋势</div>
          <div ref="alarmTrendChart" class="chart-container" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import 'echarts/theme/dark'

// ✅ 导入并注册南京地图
import nanjing from '@/assets/map/nanjing.json'
import { getDeviceDistrictStats, getDeviceMap, getAlarmLevelStats, getAlarmTrend } from '@/api/modules/dashboard/index'
echarts.registerMap('nanjing', nanjing as any)
import { Dashboard } from '@/api/modules/dashboard/index'

const deviceDistrictChart = ref(null)
const deviceMapChart = ref(null)
const alarmLevelChart = ref(null)
const alarmTrendChart = ref(null)
const charts: echarts.ECharts[] = []

// 数据变量
const districtData = ref<Dashboard.DeviceDistrictStat[]>([])
const mapData = ref<Dashboard.DeviceMapItem[]>([])
const levelData = ref<Dashboard.AlarmLevelStat[]>([])
const trendData = ref<Dashboard.AlarmTrendItem[]>([])

// 定时器变量
const refreshInterval = ref<number | null>(null)

// 初始化图表
const initCharts = () => {
  // 设备区域统计图
  if (deviceDistrictChart.value && districtData.value.length) {
    const chart = echarts.init(deviceDistrictChart.value, 'dark')
    chart.setOption({
      tooltip: {},
      xAxis: {
        type: 'category',
        data: districtData.value.map((i) => i.district)
      },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: districtData.value.map((i) => i.count),
          itemStyle: { color: '#409EFF' }
        }
      ]
    })
    charts.push(chart)
  }

  // 设备地图
  if (deviceMapChart.value && mapData.value.length) {
    const chart = echarts.init(deviceMapChart.value, 'dark')
    chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (params) => `${params.name}<br/>经度: ${params.value[0]}<br/>纬度: ${params.value[1]}`
      },
      geo: {
        map: 'nanjing', // ✅ 注意与 registerMap 一致
        roam: true,
        label: { show: true, color: '#fff' },
        itemStyle: {
          areaColor: '#073C76',
          borderColor: '#0f5f9a'
        },
        emphasis: {
          itemStyle: {
            areaColor: '#2B91B7'
          }
        }
      },
      series: [
        {
          name: '设备点',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: mapData.value,
          symbolSize: 12,
          itemStyle: { color: '#67C23A' }
        }
      ]
    })
    charts.push(chart)
  }

  // 告警等级分布
  if (alarmLevelChart.value && levelData.value.length) {
    const chart = echarts.init(alarmLevelChart.value, 'dark')
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 10, textStyle: { color: '#fff' } },
      series: [
        {
          name: '告警等级',
          type: 'pie',
          radius: '50%',
          data: levelData.value.map((i) => ({
            value: i.count,
            name: i.level === 1 ? '低' : i.level === 2 ? '中' : '高'
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.5)'
            }
          }
        }
      ]
    })
    charts.push(chart)
  }

  // 告警趋势
  if (alarmTrendChart.value && trendData.value.length) {
    const chart = echarts.init(alarmTrendChart.value, 'dark')
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: trendData.value.map((i) => i.date)
      },
      yAxis: { type: 'value' },
      series: [
        {
          data: trendData.value.map((i) => i.count),
          type: 'line',
          smooth: true,
          lineStyle: { color: '#E6A23C' },
          itemStyle: { color: '#E6A23C' }
        }
      ]
    })
    charts.push(chart)
  }
}

// 获取数据
const fetchData = async () => {
  try {
    const districtResponse = await getDeviceDistrictStats()
    console.log('设备区域统计数据:', districtResponse) // 打印设备区域统计数据
    if (districtResponse.data) {
      districtData.value = [
        { district: '设备总数', count: districtResponse.data.deviceTotal },
        { district: '今日设备', count: districtResponse.data.deviceToday },
        { district: '在线设备', count: districtResponse.data.deviceOnline },
        { district: '告警设备', count: districtResponse.data.alarmToday }
      ]
    } else {
      districtData.value = []
    }

    const mapResponse = await getDeviceMap()
    console.log('设备点位地图数据:', mapResponse) // 打印设备点位地图数据
    mapData.value = mapResponse.data || []

    const levelResponse = await getAlarmLevelStats()
    console.log('告警等级分布数据:', levelResponse) // 打印告警等级分布数据
    levelData.value = levelResponse.data || []

    const trendResponse = await getAlarmTrend()
    console.log('告警趋势数据:', trendResponse) // 打印告警趋势数据
    trendData.value = trendResponse.data || []

    initCharts()
  } catch (error) {
    console.error('获取数据失败', error)
  }
}

// 启动定时刷新
const startAutoRefresh = () => {
  if (refreshInterval.value) return // 防止多次调用
  refreshInterval.value = setInterval(() => {
    fetchData() // 每秒刷新数据
  }, 10000) // 每 1 秒刷新一次
}

// 停止定时刷新
const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
}

// 组件生命周期
onMounted(() => {
  fetchData() // 初次加载数据
  startAutoRefresh() // 启动定时刷新

  setTimeout(() => {
    window.addEventListener('resize', () => charts.forEach((c) => c.resize()))
  }, 500)
})

onBeforeUnmount(() => {
  stopAutoRefresh() // 清除定时器
  charts.forEach((c) => c.dispose())
})
</script>

<style scoped>
.screen-container {
  background-color: #0f1c2e;
  color: #fff;
  padding: 20px;
  min-height: 100vh;
}
.screen-title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
}
.screen-grid {
  display: flex;
  flex-wrap: wrap;
}
.screen-panel {
  background-color: #1e2a38;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
}
.chart-title {
  font-size: 18px;
  margin-bottom: 10px;
  color: #ffd04b;
}
.chart-container {
  height: 320px;
  width: 100%;
}
</style>
