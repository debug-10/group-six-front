<template>
  <div class="table-box">
    <ProTable ref="proTable" title="用户管理列表" :columns="columns" :requestApi="getTableList" :initParam="initParam" :dataCallback="dataCallback" :search-params="searchParams">
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['sys:user:add']"> 新增用户 </el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['sys:user:view']"> 查看 </el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['sys:user:edit']"> 编辑 </el-button>
        <el-button type="warning" link :icon="EditPen" @click="openResetDialog(scope.row)" v-hasPermi="['sys:user:reset-psw']"> 重置密码 </el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteUser(scope.row)" v-hasPermi="['sys:user:remove']"> 删除 </el-button>
      </template>
    </ProTable>

    <UserDialog ref="dialogRef" :title="currentTitle" :api="currentApi" @refresh="refreshTable" />
    <ResetPasswordDialog ref="resetDialog" @refresh="refreshTable" />
  </div>
</template>

<script setup lang="tsx" name="AccountManage">
import { ref, reactive } from 'vue' // 移除未使用的 watch 导入
import { ElMessage } from 'element-plus'
import { CirclePlus, View, EditPen, Delete } from '@element-plus/icons-vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import UserDialog from './components/UserDialog.vue'
import ResetPasswordDialog from './components/ResetPasswordDialog.vue'
import { UserInfo, getUserList, addUser, editUser, deleteUser } from '@/api/modules/user/index'

// 表格实例
const proTable = ref<InstanceType<typeof ProTable>>()

// 初始化参数（固定查询普通用户）
const initParam = reactive<{ role: number }>({
  role: 3
})

// 搜索参数
const searchParams = reactive<{ status?: number; username?: string; phone?: string }>({})

// 数据回调函数（关键：解析后端多层数据结构）
const dataCallback = (res: any) => {
  return {
    list: res.data.users, // 用户列表
    total: res.data.pagination.total // 总数
  }
}

// 获取用户列表
const getTableList = (params: any) => {
  return getUserList({ ...params, ...initParam, ...searchParams })
}

// 表格列配置（完整展示所有字段）
const columns: ColumnProps<UserInfo.ResUserList>[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'avatarUrl',
    label: '头像',
    width: 120,
    render: (scope) => <el-avatar shape="square" size={32} src={scope.row.avatarUrl || '/default-avatar.png'} />
  },
  {
    prop: 'username',
    label: '用户名',
    search: { el: 'input', props: { placeholder: '请输入用户名' } }
  },
  {
    prop: 'nickname',
    label: '昵称',
    search: { el: 'input', props: { placeholder: '请输入昵称' } }
  },
  {
    prop: 'phone',
    label: '手机号',
    search: { el: 'input', props: { placeholder: '请输入手机号' } }
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    render: (scope) => <el-tag type={scope.row.status === 1 ? 'success' : 'danger'}>{scope.row.status === 1 ? '启用' : '禁用'}</el-tag>
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    render: (scope) => <span>{scope.row.createTime?.split('T')[0]}</span>
  },
  {
    prop: 'updateTime',
    label: '更新时间',
    width: 180,
    render: (scope) => <span>{scope.row.updateTime?.split('T')[0]}</span>
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 380 }
]

// 对话框标题和API响应式变量
const currentTitle = ref<string>('')
const currentApi = ref<(data: UserInfo.ReqUserParams) => Promise<any>>()

// 打开编辑/新增对话框
const dialogRef = ref<InstanceType<typeof UserDialog>>()
const openDrawer = (title: string, row?: UserInfo.ResUserList) => {
  currentTitle.value = title
  currentApi.value = title === '新增' ? (data: UserInfo.ReqUserParams) => addUser(data) : (data: UserInfo.ReqUserParams) => editUser(row!.id, data)

  dialogRef.value?.open({
    title: currentTitle.value,
    row: row || {},
    api: currentApi.value,
    onSuccess: () => {
      proTable.value?.getTableList()
      currentTitle.value = ''
      currentApi.value = undefined
    }
  })
}

// 打开重置密码对话框
const resetDialog = ref<InstanceType<typeof ResetPasswordDialog>>()
const openResetDialog = (row: UserInfo.ResUserList) => {
  resetDialog.value?.open(row.id)
}

// 删除用户
const deleteUser = async (row: UserInfo.ResUserList) => {
  try {
    await ElMessage.confirm(`确认删除用户【${row.username}】？`, '提示', { type: 'warning' })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    proTable.value?.getTableList()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 刷新表格
const refreshTable = () => {
  proTable.value?.getTableList()
}
</script>

<style scoped lang="less">
.table-box {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}
</style>
