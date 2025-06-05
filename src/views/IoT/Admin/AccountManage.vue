<template>
  <div class="account-manage">
    <div class="table-box">
      <ProTable ref="proTable" title="账号管理" :columns="columns" :request-api="getAccountList" :init-param="initParam" :data-callback="dataCallback">
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增账号</el-button>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
          <el-button type="danger" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <AccountDialog ref="dialogRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="AccountManage">
import { ref, reactive } from 'vue'
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import AccountDialog from './components/AccountDialog.vue'

// ProTable 实例
const proTable = ref<ProTableInstance>()

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({})

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  }
}

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const getTableList = () => {
  proTable.value?.getTableList()
}

// 表格配置项
const columns = reactive<ColumnProps[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  { type: 'index', label: '#', width: 80 },
  {
    prop: 'username',
    label: '用户名',
    search: { el: 'input' }
  },
  {
    prop: 'nickname',
    label: '昵称'
  },
  {
    prop: 'phone',
    label: '手机号',
    search: { el: 'input' }
  },
  {
    prop: 'deviceCount',
    label: '管理设备数量'
  },
  {
    prop: 'status',
    label: '状态',
    tag: true,
    enum: [
      { label: '启用', value: 1, tagType: 'success' },
      { label: '禁用', value: 0, tagType: 'danger' }
    ],
    search: { el: 'select', props: { filterable: true } }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
])

// 打开 drawer(新增、查看、编辑)
const dialogRef = ref<InstanceType<typeof AccountDialog>>()
const openDrawer = (title: string, row: Partial<any> = {}) => {
  const params = {
    title,
    isView: title === '查看',
    row: { ...row },
    api: title === '新增' ? addAccountApi : title === '编辑' ? editAccountApi : undefined,
    getTableList
  }
  dialogRef.value?.acceptParams(params)
}
</script>
