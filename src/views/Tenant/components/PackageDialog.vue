<template>
  <el-dialog :title="dialogProps.title" v-model="dialogVisible" width="30%">
    <el-form ref="formRef" label-width="100px" :model="dialogProps.row" :rules="rules" :disabled="dialogProps.isView">
      <el-form-item label="套餐ID" prop="packageId" v-if="dialogProps.title !== '新增'">
        <el-input-number v-model="dialogProps.row.packageId" :disabled="true" />
      </el-form-item>
      <el-form-item label="权限配置" prop="permissions">
        <el-checkbox-group v-model="dialogProps.row.permissions">
          <el-checkbox v-for="perm in availablePermissions" :key="perm.id" :label="perm.id" :value="perm.id">
            {{ perm.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="cancelDialog">取消</el-button>
      <el-button type="primary" v-show="!dialogProps.isView" :loading="submitting" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElForm, ElInputNumber, ElButton, ElCheckboxGroup, ElCheckbox, type FormInstance } from 'element-plus'
import * as PackageAPI from '@/api/modules/package/index'

interface DialogProps {
  title: string
  isView: boolean
  row: PackageAPI.PackageItem
  getTableList?: () => Promise<void>
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  title: '',
  isView: false,
  row: { packageId: 0, permissions: [] }
})
const formRef = ref<FormInstance>()
const submitting = ref(false)

const availablePermissions = ref([
  { id: 1, name: '夜灯' },
  { id: 2, name: '火警' },
  { id: 3, name: '风扇' },
  { id: 4, name: '其他设备' }
])

const rules = reactive({
  permissions: [
    {
      validator: (_: any, value: number[]) => (value.length > 0 ? Promise.resolve() : Promise.reject('请至少选择一个权限')),
      trigger: 'change'
    }
  ]
})

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    const data = {
      ...dialogProps.value.row,
      permissions: dialogProps.value.row.permissions // 直接传递 number[]，由 PackageAPI 序列化
    }
    if (dialogProps.value.title === '新增') {
      const { packageId: _packageId, ...createData } = data
      await PackageAPI.createPackage(createData as PackageAPI.PackageItem)
      ElMessage.success('创建成功')
    } else {
      await PackageAPI.updatePackage(dialogProps.value.row.packageId!, data)
      ElMessage.success('更新成功')
    }
    dialogProps.value.getTableList?.()
    cancelDialog(true)
  } catch (error: any) {
    ElMessage.error(error.message || `${dialogProps.value.title}失败`)
  } finally {
    submitting.value = false
  }
}

const acceptParams = (params: DialogProps) => {
  const row = {
    ...params.row,
    permissions:
      typeof params.row.permissions === 'string' && params.row.permissions
        ? JSON.parse(params.row.permissions)
        : Array.isArray(params.row.permissions)
        ? params.row.permissions
        : []
  }
  dialogProps.value = { ...params, row }
  dialogVisible.value = true
}

const cancelDialog = (clean = false) => {
  dialogVisible.value = false
  if (clean) {
    formRef.value?.resetFields()
    dialogProps.value.row = { packageId: 0, permissions: [] }
  }
}

defineExpose({ acceptParams })
</script>
