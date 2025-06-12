<!-- src/views/IoT/Admin/AccountManage.vue -->
<template>
  <div class="table-box" v-if="isMounted">
    <ProTable
      ref="proTable"
      title="用户管理列表"
      :columns="columns"
      :requestApi="getTableList"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :search-params="searchParams"
      @error="handleTableError"
    >
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['sys:user:add']">新增用户</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['sys:user:view']">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteUser(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <UserDialog ref="dialogRef" :title="currentTitle" :api="currentApi" @refresh="refreshTable" />
  </div>
  <div v-else>组件加载中...</div>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { CirclePlus, View, EditPen, Delete } from '@element-plus/icons-vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import UserDialog from './components/UserDialog.vue'
import { UserInfo, getUserList, addUser, editUser, deleteUser } from '@/api/modules/user'

// 调试加载状态
const isMounted = ref(false)

// 新增：创建数据缓存对象
const dataCache = ref({
  apiData: null, // 存储API原始数据
  processedData: null // 存储处理后的数据
})

onMounted(() => {
  console.log('AccountManage.vue 已挂载')
  isMounted.value = true
})

// 表格实例
const proTable = ref<InstanceType<typeof ProTable>>()

// 初始化参数
const initParam = reactive<{ role: number }>({
  role: 3 // 固定查询普通用户
})

// 搜索参数
const searchParams = reactive<{ status?: number; username?: string; phone?: string }>({})

// 数据回调函数（从缓存dataCache获取数据）
const dataCallback = () => {
  console.groupCollapsed('📊 dataCallback 数据处理')

  // 从缓存中获取处理后的数据
  const cachedData = dataCache.value.processedData

  console.log('dataCallback 从缓存获取的数据:', cachedData)

  // 检查缓存数据是否存在
  if (!cachedData) {
    console.warn('dataCallback: 缓存中没有数据，返回默认结构')
    const defaultData = { list: [], total: 0 }
    console.log('dataCallback 返回结果:', defaultData)
    console.groupEnd()
    return defaultData
  }

  console.log('dataCallback 返回结果:', cachedData)
  console.groupEnd()
  return cachedData
}

// 获取用户列表
const getTableList = async (params: any) => {
  try {
    // 1. 打印函数入口参数
    console.groupCollapsed('🚀 getTableList 调用开始')
    console.log('调用参数 params:', params)

    // 2. 构造请求参数并打印
    const requestParams: {
      page: number
      limit: number
      status?: number
      role?: number
    } = {
      page: Number(params.page) || 1,
      limit: Number(params.limit) || 20,
      role: Number(initParam.role) || undefined
    }

    if (searchParams.status !== undefined && searchParams.status !== null) {
      requestParams.status = Number(searchParams.status)
    }

    console.log('最终请求参数 requestParams:', requestParams)

    // 3. 调用API并捕获响应
    const res = await getUserList(requestParams)

    // 4. 打印API响应的完整结构
    console.log('API 响应 res 完整结构:', res)
    if (res) {
      console.log('API 响应 res.users:', res.users)
      console.log('API 响应 res.pagination:', res.pagination)
    }

    // 关键修改：处理数据并存入缓存
    const transformedData = {
      list: res.users || [], // 将 users 转换为 list
      total: res.pagination?.total || 0 // 提取 total
    }
    console.log('getTableList 转换后的数据:', transformedData)

    // 将原始数据和处理后的数据存入缓存
    dataCache.value = {
      apiData: res,
      processedData: transformedData
    }
    console.log('📊 已将数据存入缓存:', dataCache.value)

    console.groupEnd() // 🚀 getTableList 调用结束
    return res
  } catch (error: any) {
    console.groupCollapsed('🛑 getTableList 错误捕获')
    console.error('获取用户列表失败:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    })

    // 打印错误响应的详细信息（如果有）
    if (error.response?.data) {
      console.log('错误响应数据 error.response.data:', error.response.data)
      console.log('错误响应状态码 error.response.status:', error.response.status)
    }

    ElMessage.error(error.response?.data?.message || '加载用户列表失败')

    // 打印返回的默认数据结构
    const defaultData = {
      users: [],
      pagination: {
        total: 0,
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 20
      }
    }
    console.log('错误时返回的默认数据:', defaultData)
    console.groupEnd() // 🛑 getTableList 错误捕获
    return defaultData
  }
}

// 处理表格错误
const handleTableError = (error: any) => {
  ElMessage.error(error.response?.data?.message || '加载用户列表失败，请检查网络或刷新页面')
  console.error('ProTable 错误:', error)
}

// 表格列配置
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
  { prop: 'operation', label: '操作', fixed: 'right', width: 300 }
]

// 对话框标题和API
const currentTitle = ref<string>('')
const currentApi = ref<(data: UserInfo.ReqUserParams) => Promise<any>>()

// 打开对话框
const dialogRef = ref<InstanceType<typeof UserDialog>>()
const openDrawer = (title: string, row?: UserInfo.ResUserList) => {
  currentTitle.value = title
  currentApi.value = title === '新增' ? addUser : (data: UserInfo.ReqUserParams) => editUser(row!.id, data)
  dialogRef.value?.open({
    title,
    row: row || {},
    api: currentApi.value
  })
}

// 删除用户
const deleteUser = async (row: UserInfo.ResUserList) => {
  try {
    await ElMessage.confirm(`确认删除用户【${row.username}】？`, '提示', { type: 'warning' })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    proTable.value?.getTableList()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '删除失败')
    console.error('删除用户失败:', error)
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
