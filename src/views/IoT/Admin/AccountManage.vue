<template>
  <div class="table-box" v-if="isMounted">
    <ProTable ref="proTable" title="用户管理列表" :columns="columns" :requestApi="getUserListApi" :initParam="initParams" :search-params="searchParams" @error="handleTableError">
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openUserDialog('新增')" v-hasPermi="['sys:user:add']"> 新增用户 </el-button>
      </template>

      <template #operation="{ row }">
        <el-button type="primary" link :icon="View" @click="openUserDialog('查看', row)" v-hasPermi="['sys:user:view']">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openUserDialog('编辑', row)" v-hasPermi="['sys:user:edit']">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="handleDelete(row)" v-hasPermi="['sys:user:remove']">删除</el-button>
      </template>
    </ProTable>

    <UserDialog ref="dialogRef" :title="dialogTitle" :api="dialogApi" @refresh="refreshTable" />
  </div>
  <div v-else>组件加载中...</div>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus, View, EditPen, Delete } from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import { ColumnProps } from '@/components/ProTable/interface'
import UserDialog from './components/UserDialog.vue'
import { getUserList, createUser, updateUser, deleteUser as removeUser, User } from '@/api/modules/user/index'

const isMounted = ref(false)
const proTable = ref<InstanceType<typeof ProTable>>()
const dialogRef = ref<InstanceType<typeof UserDialog>>()

onMounted(() => {
  isMounted.value = true
})

const initParams = reactive<{ role?: number }>({})
const searchParams = reactive<{ username?: string; phone?: string; status?: number }>({})
const getUserListApi = async (params: any) => {
  try {
    const query = {
      page: Number(params.page) || 1,
      limit: Number(params.limit) || 10,
      username: searchParams.username?.trim() || undefined,
      phone: searchParams.phone?.trim() || undefined,
      status: searchParams.status !== undefined ? searchParams.status : undefined
    }
    const res = await getUserList(query)

    console.log('接口返回:', res) // 这里确认接口数据结构

    return {
      list: res.data.users || [],
      total: res.data.pagination?.total || 0
    }
  } catch (err: any) {
    console.error('获取用户列表失败:', err)
    ElMessage.error(err.response?.data?.message || err.message || '获取用户列表失败')
    return { list: [], total: 0 }
  }
}

const handleTableError = (err: any) => {
  ElMessage.error(err.response?.data?.message || '表格加载失败')
}

const columns: ColumnProps<User.UserItem>[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'avatarUrl',
    label: '头像',
    width: 100,
    render: ({ row }) => <el-avatar size={32} src={row.avatarUrl || '/default-avatar.png'} />
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
    render: ({ row }) => <el-tag type={row.status === 1 ? 'success' : 'danger'}>{row.status === 1 ? '启用' : '禁用'}</el-tag>
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    render: ({ row }) => <span>{row.createTime?.split('T')[0]}</span>
  },
  {
    prop: 'updateTime',
    label: '更新时间',
    width: 180,
    render: ({ row }) => <span>{row.updateTime?.split('T')[0]}</span>
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 300 }
]

const dialogTitle = ref('')
const dialogApi = ref<(data: User.UserSubmitParams) => Promise<any>>()

const openUserDialog = (title: string, row?: User.UserItem) => {
  dialogTitle.value = title
  dialogApi.value = title === '新增' ? createUser : (data) => updateUser(row!.id, data)
  dialogRef.value?.open({ title, row: row || {}, api: dialogApi.value })
}

const handleDelete = async (row: User.UserItem) => {
  try {
    await ElMessageBox.confirm(`确认删除用户【${row.username}】？`, '提示', { type: 'warning' })
    await removeUser(row.id)
    ElMessage.success('删除成功')
    refreshTable()
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '删除失败')
  }
}

const refreshTable = () => {
  proTable.value?.getTableList()
}
</script>

<style scoped lang="less">
.table-box {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
</style>
