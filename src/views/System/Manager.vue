<template>
  <div class="table-box">
    <ProTable ref="proTable" title="管理员列表" :columns="columns" :requestApi="getTableList" :initParam="initParam" :dataCallback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['sys:manager:add']">新增管理员</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['sys:manager:view']">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['sys:manager:edit']">编辑</el-button>
        <el-button type="success" link :icon="Setting" @click="openRoleAssign(scope.row)" v-hasPermi="['sys:manager:assign-role']">权限分配</el-button>
        <el-button type="warning" link :icon="EditPen" @click="openDrawer('重置', scope.row)" v-hasPermi="['sys:manager:reset-psw']">重置密码</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteAccount(scope.row)" v-hasPermi="['sys:manager:remove']">删除</el-button>
      </template>
    </ProTable>
    <ManagerDialog ref="dialogRef" />
    <RoleAssignDialog ref="roleAssignRef" @refresh="refreshTable" />
  </div>
</template>

<script setup lang="tsx" name="SysManager">
import { ref, reactive } from 'vue'
import { SysManager } from '@/api/interface'
import { ColumnProps } from '@/components/ProTable/interface'
import { useHandleData } from '@/hooks/useHandleData'
import { useAuthButtons } from '@/hooks/useAuthButtons'
import ProTable from '@/components/ProTable/index.vue'
import ManagerDialog from '@/views/System/components/ManagerDialog.vue'
import RoleAssignDialog from '@/views/System/components/RoleAssignDialog.vue'
import { getManagerPage, addManager, editManager, deleteManager } from '@/api/modules/manager'

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
  console.log('请求参数:', newParams)
  return getManagerPage(newParams).then((res) => {
    console.log('API响应数据:', res)
    return res
  })
}

// 页面按钮权限
const { BUTTONS } = useAuthButtons()

// 表格配置项
const columns: ColumnProps<SysManager.ResManagerList>[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'avatarUrl',
    label: '头像',
    width: 120,
    render: (scope) => {
      return <el-avatar shape={'square'} size={27} src={scope.row.avatarUrl} />
    }
  },
  {
    prop: 'username',
    label: '用户名',
    search: { el: 'input' }
  },
  {
    prop: 'nickname',
    label: '昵称',
    search: { el: 'input' }
  },
  {
    prop: 'phone',
    label: '手机号',
    search: { el: 'input' }
  },
  {
    prop: 'role',
    label: '角色',
    enum: [
      { label: '超级管理员', value: 1 },
      { label: '租户管理员', value: 2 },
      { label: '普通用户', value: 3 }
    ],
    search: { el: 'select' },
    fieldNames: { label: 'label', value: 'value' },
    render: (scope) => {
      const roleMap = { 1: '超级管理员', 2: '租户管理员', 3: '普通用户' }
      return <el-tag type={scope.row.role === 1 ? 'danger' : scope.row.role === 2 ? 'warning' : 'info'}>{roleMap[scope.row.role]}</el-tag>
    }
  },
  {
    prop: 'status',
    label: '状态',
    enum: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ],
    search: { el: 'select' },
    fieldNames: { label: 'label', value: 'value' },
    render: (scope) => {
      // 加强安全检查
      if (!scope || !scope.row || scope.row.status === undefined) {
        return <el-tag type="info">数据加载中...</el-tag>
      }
      const status = scope.row.status ?? 0
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch model-value={status} active-text={status ? '启用' : '禁用'} active-value={1} inactive-value={0} />
          ) : (
            <el-tag type={status ? 'success' : 'danger'}>{status ? '启用' : '禁用'}</el-tag>
          )}
        </>
      )
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 200
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

// 删除管理员
const deleteAccount = async (params: SysManager.ResManagerList) => {
  await useHandleData(deleteManager, [params.id], `删除【${params.username}】管理员`)
  proTable.value.getTableList()
}

// 打开对话框
const dialogRef = ref()
const openDrawer = (title: string, row: Partial<SysManager.ResManagerList> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: title === '新增' ? addManager : title === '编辑' || title === '重置' ? editManager : '',
    getTableList: proTable.value.getTableList,
    maxHeight: title === '重置' ? '100px' : '500px'
  }
  dialogRef.value.acceptParams(params)
}

// 权限分配
const roleAssignRef = ref()
const openRoleAssign = (row: SysManager.ResManagerList) => {
  roleAssignRef.value.openDialog(row)
}

// 刷新表格数据
const refreshTable = () => {
  if (proTable.value) {
    proTable.value.getTableList()
  }
}
</script>
