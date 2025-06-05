<template>
  <div class="table-box">
    <ProTable ref="proTable" title="设备列表" :columns="columns" :requestApi="getTableList" :initParam="initParam" :dataCallback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['device:manage:add']">新增设备</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['device:manage:view']">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['device:manage:edit']">编辑</el-button>
        <el-button type="primary" link :icon="Setting" @click="updateDeviceStatus(scope.row)" v-hasPermi="['device:manage:status']">
          {{ scope.row.status === 1 ? '禁用' : '启用' }}
        </el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteDevice(scope.row)" v-hasPermi="['device:manage:remove']">删除</el-button>
      </template>
    </ProTable>
    <DeviceDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="DeviceManage">
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ColumnProps } from '@/components/ProTable/interface'
import { Device } from '@/api/interface'
import { CirclePlus, Download, View, EditPen, Setting, Delete } from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import DeviceDialog from './components/DeviceDialog.vue'
import { useHandleData } from '@/hooks/useHandleData'
import { useDownload } from '@/hooks/useDownload'
import { getDevicePageApi, createDeviceApi, updateDeviceApi, deleteDeviceApi, updateDeviceStatusApi, exportDeviceApi } from '@/api/modules/device'

// 获取 ProTable 元素，调用其获取刷新数据方法
const proTable = ref()

// 初始化请求参数
const initParam = reactive({})

// 数据回调处理
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

// 获取表格数据
const getTableList = (params: any) => {
  let newParams = { ...params }
  return getDevicePageApi(newParams)
}

// 表格配置项
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '设备名称',
    search: { el: 'input' }
  },
  {
    prop: 'type',
    label: '设备类型',
    enum: [
      { label: '类型1', value: 1 },
      { label: '类型2', value: 2 },
      { label: '类型3', value: 3 }
    ],
    search: { el: 'select', props: { filterable: true } }
  },
  {
    prop: 'location',
    label: '设备位置',
    search: { el: 'input' }
  },
  {
    prop: 'status',
    label: '状态',
    enum: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ],
    search: { el: 'select', props: { filterable: true } },
    render: (scope) => {
      return <el-tag type={scope.row.status === 1 ? 'success' : 'danger'}>{scope.row.status === 1 ? '启用' : '禁用'}</el-tag>
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

// 删除设备
const deleteDevice = async (params: Device.DeviceInfo) => {
  await useHandleData(deleteDeviceApi, [params.id], `删除设备【${params.name}】`)
  proTable.value.getTableList()
}

// 更新设备状态
const updateDeviceStatus = async (row: Device.DeviceInfo) => {
  const newStatus = row.status === 1 ? 0 : 1
  const statusText = newStatus === 1 ? '启用' : '禁用'

  ElMessageBox.confirm(`确认要${statusText}设备【${row.name}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await updateDeviceStatusApi({ id: row.id, status: newStatus })
    ElMessage.success(`${statusText}成功`)
    proTable.value.getTableList()
  })
}

// 导出设备数据
const downloadFile = async () => {
  ElMessageBox.confirm('确认导出设备数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    useDownload(exportDeviceApi, '设备列表', proTable.value?.searchParam)
  })
}

// 打开 drawer(新增、查看、编辑)
const dialogRef = ref()
const openDrawer = (title: string, row: Partial<Device.DeviceInfo> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: title === '新增' ? createDeviceApi : title === '编辑' ? updateDeviceApi : undefined,
    getTableList: proTable.value.getTableList
  }
  dialogRef.value.acceptParams(params)
}
</script>

<style scoped lang="less">
.table-box {
  margin: 20px;
}
</style>
