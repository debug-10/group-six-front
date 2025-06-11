<template>
  <div>
    <el-button type="primary" @click="openDialog('新增')">新增套餐</el-button>
    <el-table :data="packageList" style="width: 100%" stripe :loading="loading">
      <el-table-column label="套餐名称" width="150">
        <template #default="{ row }">
          {{ packageNameMap[row.packageId] || '未知套餐' }}
        </template>
      </el-table-column>
      <el-table-column label="权限配置">
        <template #default="{ row }">
          {{ row.permissions.length ? row.permissions.map((id) => permissionNameMap[id] || `未知权限${id}`).join(', ') : '无' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="text" @click="openDialog('编辑', row)">编辑</el-button>
          <el-button type="text" style="color: red" @click="handleDelete(row.packageId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <PackageDialog ref="dialogRef" @updateList="fetchPackages" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PackageDialog from '@/views/Tenant/components/PackageDialog.vue'
import * as PackageAPI from '@/api/modules/package/index'

const packageNameMap: Record<number, string> = {
  1: '基础版套餐',
  2: '高级版套餐',
  3: '豪华版套餐'
}

const permissionNameMap: Record<number, string> = {
  1: '智能夜灯',
  2: '智能火警',
  3: '智能风扇',
  4: '其他设备'
}

interface PackageDialogInstance {
  acceptParams: (params: { title: string; isView: boolean; row: PackageAPI.PackageItem }) => void
}

const packageList = ref<PackageAPI.PackageItem[]>([])
const dialogRef = ref<PackageDialogInstance>()
const loading = ref(false)

const fetchPackages = async () => {
  loading.value = true
  try {
    const res = await PackageAPI.getPackageList()
    console.log('Fetched packages:', res.data)
    packageList.value = [...res.data]
  } catch (error) {
    console.error('Fetch packages error:', error)
    packageList.value = []
    ElMessage.error('加载套餐列表失败')
  } finally {
    loading.value = false
  }
}

const openDialog = (title: string, row?: PackageAPI.PackageItem) => {
  dialogRef.value?.acceptParams({
    title,
    isView: false,
    row: row ? { ...row } : { packageId: 0, permissions: [] }
  })
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除该套餐吗？', '提示')
    await PackageAPI.deletePackage(id)
    ElMessage.success('删除成功')
    await fetchPackages()
  } catch (error) {
    // 错误已在 deletePackage 中处理
  }
}

onMounted(() => {
  console.log('Fetching packages on mount')
  fetchPackages()
})
</script>
