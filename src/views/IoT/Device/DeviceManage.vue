<template>
  <div class="device-manage">
    <div class="table-box">
      <ProTable ref="proTable" title="设备管理" :columns="columns" :request-api="getDeviceList" :init-param="initParam" :data-callback="dataCallback">
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增设备</el-button>
          <el-button type="success" :icon="Refresh" @click="refreshDeviceStatus">刷新状态</el-button>
        </template>
        <!-- 设备状态 -->
        <template #status="scope">
          <el-tag :type="scope.row.status === 'online' ? 'success' : 'danger'">
            {{ scope.row.status === 'online' ? '在线' : '离线' }}
          </el-tag>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="warning" link :icon="Setting" @click="controlDevice(scope.row)">控制</el-button>
          <el-button type="danger" link :icon="Delete" @click="deleteDevice(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <DeviceDialog ref="dialogRef" />
      <DeviceControlDialog ref="controlDialogRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="DeviceManage">
import { ref, reactive } from 'vue'
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import DeviceDialog from './components/DeviceDialog.vue'
import DeviceControlDialog from './components/DeviceControlDialog.vue'
import { useHandleData } from '@/hooks/useHandleData'

// ProTable 实例
const proTable = ref<ProTableInstance>()

// 初始化请求参数
const initParam = reactive({})

// 数据回调处理
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
}

// 获取表格列表
const getTableList = () => {
  proTable.value?.getTableList()
}

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  { type: 'index', label: '#', width: 80 },
  {
    prop: 'deviceName',
    label: '设备名称',
    search: { el: 'input' }
  },
  {
    prop: 'deviceId',
    label: '设备ID',
    search: { el: 'input' }
  },
  {
    prop: 'deviceType',
    label: '设备类型',
    enum: [
      { label: '摄像头', value: 'camera' },
      { label: '门禁', value: 'access' },
      { label: '空调', value: 'air' },
      { label: '温湿度', value: 'temp' },
      { label: '烟感', value: 'smoke' },
      { label: '灯光', value: 'light' },
      { label: '开关', value: 'switch' }
    ],
    search: { el: 'select', props: { filterable: true } }
  },
  {
    prop: 'location',
    label: '设备位置'
  },
  {
    prop: 'status',
    label: '在线状态',
    enum: [
      { label: '在线', value: 'online', tagType: 'success' },
      { label: '离线', value: 'offline', tagType: 'danger' }
    ],
    search: { el: 'select', props: { filterable: true } }
  },
  {
    prop: 'temperature',
    label: '温度(°C)'
  },
  {
    prop: 'humidity',
    label: '湿度(%)'
  },
  {
    prop: 'lastOnlineTime',
    label: '最后在线时间',
    width: 180
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 280 }
])

// 删除设备
const deleteDevice = async (params: any) => {
  await useHandleData(() => deleteDeviceApi(params.id), `删除设备【${params.deviceName}】`)
  getTableList()
}

// 刷新设备状态
const refreshDeviceStatus = async () => {
  await useHandleData(() => refreshDeviceStatusApi(), '刷新设备状态')
  getTableList()
}

// 控制设备
const controlDialogRef = ref<InstanceType<typeof DeviceControlDialog>>()
const controlDevice = (row: any) => {
  const params = {
    title: '设备控制',
    row: { ...row },
    getTableList
  }
  controlDialogRef.value?.acceptParams(params)
}

// 打开设备对话框
const dialogRef = ref<InstanceType<typeof DeviceDialog>>()
const openDrawer = (title: string, row: Partial<any> = {}) => {
  const params = {
    title,
    isView: title === '查看',
    row: { ...row },
    api: title === '新增' ? addDeviceApi : title === '编辑' ? editDeviceApi : undefined,
    getTableList
  }
  dialogRef.value?.acceptParams(params)
}

// 模拟API函数
const getDeviceList = async (params: any) => {
  return {
    data: {
      list: [],
      total: 0,
      pageNum: 1,
      pageSize: 10
    }
  }
}

const deleteDeviceApi = async (id: string) => {
  // 删除设备API
}

const refreshDeviceStatusApi = async () => {
  // 刷新设备状态API
}

const addDeviceApi = async (params: any) => {
  // 新增设备API
}

const editDeviceApi = async (params: any) => {
  // 编辑设备API
}
</script>
