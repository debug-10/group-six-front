<template>
  <div class="device-bind">
    <div class="table-box">
      <ProTable ref="proTable" title="设备绑定管理" :columns="columns" :request-api="getDeviceBindList" :init-param="initParam" :data-callback="dataCallback">
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('绑定设备')">绑定设备</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="danger" link :icon="Delete" @click="unbindDevice(scope.row)">解绑</el-button>
        </template>
      </ProTable>
      <DeviceBindDialog ref="dialogRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="DeviceBind">
import { ref, reactive } from 'vue'
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import DeviceBindDialog from './components/DeviceBindDialog.vue'
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
    prop: 'adminName',
    label: '管理员',
    search: { el: 'input' }
  },
  {
    prop: 'deviceName',
    label: '设备名称',
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
    prop: 'deviceId',
    label: '设备ID'
  },
  {
    prop: 'bindTime',
    label: '绑定时间',
    width: 180
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 150 }
])

// 解绑设备
const unbindDevice = async (params: any) => {
  await useHandleData(() => unbindDeviceApi(params.id), `解绑设备【${params.deviceName}】`)
  getTableList()
}

// 打开绑定对话框
const dialogRef = ref<InstanceType<typeof DeviceBindDialog>>()
const openDrawer = (title: string, row: Partial<any> = {}) => {
  const params = {
    title,
    row: { ...row },
    api: bindDeviceApi,
    getTableList
  }
  dialogRef.value?.acceptParams(params)
}
</script>
