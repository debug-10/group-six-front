<template>
  <div class="table-box">
    <ProTable ref="proTable" title="租户列表" :columns="columns" :request-api="getTableList" :init-param="initParam" :data-callback="dataCallback">
      <template #tableHeader>
        <div></div>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增租户</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出数据</el-button>
      </template>
      <template #operation="{ row }">
        <div></div>
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', row)">编辑</el-button>
        <el-button type="primary" link :icon="Setting" @click="updateTenantStatus(row)">
          {{ row.status === 1 ? '禁用' : '启用' }}
        </el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteTenant(row)">删除</el-button>
      </template>
    </ProTable>
    <TenantDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="TenantManage">
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ColumnProps } from '@/components/ProTable/interface'
import { CirclePlus, Download, View, EditPen, Setting, Delete } from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import TenantDialog from './components/TenantDialog.vue'
import { useHandleData } from '@/hooks/useHandleData'
import { useDownload } from '@/hooks/useDownload'
import { getTenantPageApi, createTenantApi, updateTenantApi, deleteTenantApi, updateTenantStatusApi } from '@/api/modules/tenant'
import { Tenant } from '@/api/interface'

// 表格实例
const proTable = ref()
const dialogRef = ref()

const initParam = reactive({})
const dataCallback = (data: any) => ({
  list: data.tenants || [],
  total: data.pagination?.total || 0
})
const getTableList = (params: any) => getTenantPageApi({ ...params })

const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  { type: 'index', label: '序号', width: 60 },
  { prop: 'tenantName', label: '租户名称', search: { el: 'input' } },
  {
    prop: 'packageType',
    label: '套餐类型',
    enum: [
      { label: '基础套餐', value: 1 },
      { label: '高级套餐', value: 2 },
      { label: '企业套餐', value: 3 }
    ],
    search: { el: 'select', props: { filterable: true } }
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

  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

const deleteTenant = async (row: Tenant.TenantVO) => {
  await useHandleData(deleteTenantApi, [row.tenantId], `删除租户【${row.tenantName}】`)
  proTable.value?.getTableList()
}

const updateTenantStatus = async (row: Tenant.TenantVO) => {
  const newStatus = row.status === 1 ? 0 : 1
  ElMessageBox.confirm(`确认要${newStatus === 1 ? '启用' : '禁用'}租户【${row.tenantName}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await updateTenantStatusApi({ tenantId: row.tenantId, status: newStatus })
    ElMessage.success('操作成功')
    proTable.value?.getTableList()
  })
}

const downloadFile = () => {
  useDownload(() => {}, '租户列表', proTable.value?.searchParam) // 暂无导出接口，需实现
}

const openDrawer = (title: string, row: Partial<Tenant.TenantVO> = {}) => {
  dialogRef.value.acceptParams({
    title,
    isView: title === '查看',
    row: { ...row },
    api: title === '新增' ? createTenantApi : title === '编辑' ? updateTenantApi : undefined,
    getTableList: proTable.value?.getTableList
  })
}
</script>

<style scoped lang="less">
.table-box {
  margin: 20px;
}
</style>
