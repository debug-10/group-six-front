<template>
  <div class="table-box">
    <ProTable ref="proTable" title="设备列表" :columns="columns" :request-api="getTableList" :init-param="initParam" :data-callback="dataCallback">
      <template #tableHeader>
        <div></div>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增设备</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
      </template>
      <template #operation="{ row }">
        <div></div>
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', row)">编辑</el-button>
        <el-button type="primary" link :icon="Setting" @click="updateDeviceStatus(row)">
          {{ row.status === 1 ? '禁用' : '启用' }}
        </el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteDevice(row)">删除</el-button>
      </template>
    </ProTable>
    <DeviceDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="DeviceManage">
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ColumnProps } from '@/components/ProTable/interface'
import { CirclePlus, Download, View, EditPen, Setting, Delete } from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import DeviceDialog from './components/DeviceDialog.vue'
import { useHandleData } from '@/hooks/useHandleData'
import { useDownload } from '@/hooks/useDownload'
import { getDevicePageApi, createDeviceApi, updateDeviceApi, deleteDeviceApi, updateDeviceStatusApi, exportDeviceApi } from '@/api/modules/device'
import { Device } from '@/api/interface'

// 表格实例
const proTable = ref()
const dialogRef = ref()

const initParam = reactive({})
const dataCallback = (data: any) => ({
  list: data.list || [],
  total: data.total || 0
})
const getTableList = (params: any) => getDevicePageApi({ ...params })

const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  { type: 'index', label: '序号', width: 60 },
  {
    prop: 'name',
    label: '设备名称',
    search: { el: 'input' }
  },
  {
    prop: 'type',
    label: '设备类型',
    enum: [
      { label: '智能夜灯', value: 1 },
      { label: '智能火警', value: 2 },
      { label: '智能风扇', value: 3 },
      { label: '智能空调', value: 4 }
    ],
    search: { el: 'select', props: { filterable: true } }
  },
  {
    prop: 'location',
    label: '设备位置',
    search: { el: 'input' }
  },
  {
    prop: 'deviceMac',
    label: '设备 MAC 地址',
    search: { el: 'input' }
  },
  {
    prop: 'status',
    label: '状态',
    enum: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ],
    search: { el: 'select' },
    render: (scope) => {
      return <el-tag type={scope.row.status === 1 ? 'success' : 'danger'}>{scope.row.status === 1 ? '启用' : '禁用'}</el-tag>
    }
  },
  { prop: 'createTime', label: '创建时间', width: 180 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

const deleteDevice = async (row: Device.DeviceVO) => {
  await useHandleData(deleteDeviceApi, [row.id], `删除设备【${row.name}】`)
  proTable.value?.getTableList()
}

const updateDeviceStatus = async (row: Device.DeviceVO) => {
  const newStatus = row.status === 1 ? 0 : 1
  ElMessageBox.confirm(`确认要${newStatus === 1 ? '启用' : '禁用'}设备【${row.name}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await updateDeviceStatusApi({ id: row.id, status: newStatus })
    ElMessage.success('操作成功')
    proTable.value?.getTableList()
  })
}

const downloadFile = () => {
  useDownload(exportDeviceApi, '设备列表', proTable.value?.searchParam)
}

const openDrawer = (title: string, row: Partial<Device.DeviceVO> = {}) => {
  dialogRef.value.acceptParams({
    title,
    isView: title === '查看',
    row: { ...row },
    api: title === '新增' ? createDeviceApi : title === '编辑' ? updateDeviceApi : undefined,
    getTableList: proTable.value?.getTableList
  })
}
</script>

<style scoped lang="less">
.table-box {
  margin: 20px;
}
</style>
