<template>
  <div class="alarm-manage">
    <div class="table-box">
      <ProTable ref="proTable" title="告警管理" :columns="columns" :request-api="getTableList" :init-param="initParam" :data-callback="dataCallback">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增告警</el-button>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="danger" link :icon="Delete" @click="deleteAlarmItem(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <AlarmDialog ref="dialogRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="AlarmManage">
import { ref, reactive, h } from 'vue'
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import AlarmDialog from './components/AlarmDialog.vue'
import { CirclePlus, Download, View, EditPen, Delete } from '@element-plus/icons-vue'
import { useDownload } from '@/hooks/useDownload'
import { useHandleData } from '@/hooks/useHandleData'
import { getAlarmList, deleteAlarm } from '@/api/modules/alarm'
import { Alarm } from '@/api/modules/alarm'

// ProTable 实例
const proTable = ref<ProTableInstance>()

// 表格初始化参数
const initParam = reactive({})

// 数据处理回调
const dataCallback = (data: any) => {
  const list = data?.alarms || []
  const pagination = data?.pagination || {}
  return {
    list: list,
    total: pagination.total || list.length,
    pageNum: pagination.page || 1,
    pageSize: pagination.limit || 10
  }
}

// 获取表格数据
const getTableList = (params: any) => {
  return getAlarmList(params)
}

// 告警类型映射
const ALARM_TYPE_MAP = {
  1: '离线',
  2: '警报',
  3: '损坏'
}

// 表格配置
const columns = reactive<ColumnProps[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  { type: 'index', label: '告警ID', width: 80 },
  {
    prop: 'deviceId',
    label: '设备ID',
    search: { el: 'input' }
  },
  {
    prop: 'type',
    label: '告警类型',
    search: {
      el: 'select',
      props: {
        options: [
          { label: '离线', value: 1 },
          { label: '警报', value: 2 },
          { label: '损坏', value: 3 }
        ]
      }
    },
    render: (scope) => ALARM_TYPE_MAP[scope.row.type] || '未知'
  },
  {
    prop: 'level',
    label: '告警级别',
    enum: [
      { label: '低', value: 1 },
      { label: '中', value: 2 },
      { label: '高', value: 3 }
    ],
    search: { el: 'select', props: { filterable: true } },
    render: (scope) => {
      const level = scope.row.level
      const tagType = level === 1 ? 'info' : level === 2 ? 'warning' : 'danger'
      const label = level === 1 ? '低' : level === 2 ? '中' : '高'
      return h('el-tag', { type: tagType }, label)
    }
  },
  {
    prop: 'status',
    label: '状态',
    enum: [
      { label: '未处理', value: 0 },
      { label: '已处理', value: 1 }
    ],
    search: { el: 'select', props: { filterable: true } },
    render: (scope) => {
      return h('el-tag', { type: scope.row.status === 0 ? 'danger' : 'success' }, scope.row.status === 0 ? '未处理' : '已处理')
    }
  },
  {
    prop: 'message',
    label: '告警信息'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 250 }
])

// 下载文件
const downloadFile = () => {
  useDownload(getAlarmList, '告警数据')
}

// 删除告警
const deleteAlarmItem = async (row: Alarm.AlarmVO) => {
  await useHandleData(deleteAlarm, row.id, `删除【ID:${row.id}】告警`)
  proTable.value?.getTableList()
}

// 打开弹框(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof AlarmDialog>>()
const openDrawer = (title: string, row: Partial<Alarm.AlarmVO> = {}) => {
  console.log('传递给弹框的数据:', row) // 调试：检查传递的row数据

  // 确保传递的row包含id且为数字类型
  if (title === '编辑' && (!row.id || isNaN(Number(row.id)))) {
    ElMessage.error('无效的告警ID')
    return
  }

  const params = {
    title,
    isView: title === '查看',
    row: { ...row }, // 传递原始数据
    getTableList: () => proTable.value?.getTableList()
  }
  dialogRef.value?.acceptParams(params)
}
</script>

<style scoped lang="less">
.alarm-manage {
  .table-box {
    margin: 10px;
  }
}
</style>
