<template>
  <el-dialog v-model="visible" title="重置密码" width="400px">
    <el-form ref="formRef" :model="formData" :rules="rules">
      <el-form-item label="新密码" prop="password">
        <el-input v-model="formData.password" type="password" show-password placeholder="请输入新密码（6-20位）" />
      </el-form-item>
      <el-form-item label="确认密码" prop="submitPassword">
        <el-input v-model="formData.submitPassword" type="password" show-password placeholder="请再次输入新密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="resetPassword">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { editUser } from '@/api/modules/user'

const visible = ref(false)
const formData = reactive({
  password: '',
  submitPassword: ''
})
const formRef = ref<FormInstance>()

const open = (userId: number) => {
  visible.value = true
  formData.password = ''
  formData.submitPassword = ''
  currentUserId.value = userId
}

defineExpose({ open })

const currentUserId = ref<number>()

const rules = reactive({
  password: [{ required: true, message: '密码不能为空', trigger: 'blur', min: 6 }],
  submitPassword: [
    {
      validator: (_, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不一致'))
        }
        callback()
      },
      trigger: 'blur'
    }
  ]
})

const resetPassword = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      await editUser(currentUserId.value!, { password: formData.password })
      ElMessage.success('密码重置成功')
      visible.value = false
    } catch (error) {
      ElMessage.error('重置失败，请重试')
    }
  })
}
</script>
