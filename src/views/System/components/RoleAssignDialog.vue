<template>
  <el-dialog v-model="dialogVisible" title="权限分配" width="500px" :before-close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="管理员">
        <el-input v-model="formData.username" disabled />
      </el-form-item>
      <el-form-item label="当前角色">
        <el-tag :type="getRoleTagType(formData.currentRole)">{{ getRoleName(formData.currentRole) }}</el-tag>
      </el-form-item>
      <el-form-item label="分配角色" prop="roleId">
        <el-select v-model="formData.roleId" placeholder="请选择角色" class="w-full">
          <el-option v-for="role in roleOptions" :key="role.value" :label="role.label" :value="role.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入分配原因或备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { SysManager } from '@/api/interface'
import { assignManagerRole } from '@/api/modules/manager'

const emit = defineEmits(['refresh'])

const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref()

const formData = reactive({
  managerId: 0,
  username: '',
  currentRole: 0,
  roleId: 0,
  remark: ''
})

const rules = {
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const roleOptions = [
  { label: '超级管理员', value: 1 },
  { label: '租户管理员', value: 2 },
  { label: '普通用户', value: 3 }
]

const getRoleName = (role: number) => {
  const roleMap = { 1: '超级管理员', 2: '租户管理员', 3: '普通用户' }
  return roleMap[role] || '未知'
}

const getRoleTagType = (role: number) => {
  return role === 1 ? 'danger' : role === 2 ? 'warning' : 'info'
}

const openDialog = (row: SysManager.ResManagerList) => {
  formData.managerId = row.id
  formData.username = row.username
  formData.currentRole = row.role
  formData.roleId = row.role
  formData.remark = ''
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

const handleConfirm = async () => {
  if (!formRef.value) return

  await formRef.value.validate()

  if (formData.roleId === formData.currentRole) {
    ElMessage.warning('请选择不同的角色')
    return
  }

  loading.value = true
  try {
    await assignManagerRole({
      managerId: formData.managerId,
      roleId: formData.roleId
    })

    ElMessage.success('权限分配成功')
    handleClose()
    emit('refresh')
  } catch (error) {
    console.error('权限分配失败:', error)
  } finally {
    loading.value = false
  }
}

defineExpose({
  openDialog
})
</script>
