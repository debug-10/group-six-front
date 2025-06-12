<!-- src/views/IoT/Admin/components/UserDialog.vue -->
<template>
  <Dialog :model-value="visible" :title="props.title" :max-height="'500px'">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" :disabled="isView">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名（2-20字）" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" clearable />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status" v-if="!isView">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="头像URL" prop="avatarUrl">
        <el-input v-model="formData.avatarUrl" placeholder="请输入头像URL" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!isView && props.title === '新增'">
        <el-input v-model="formData.password" type="password" show-password placeholder="请输入密码（6-20位）" />
      </el-form-item>
      <el-form-item label="确认密码" prop="submitPassword" v-if="!isView && props.title === '新增'">
        <el-input v-model="formData.submitPassword" type="password" show-password placeholder="请再次输入密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit" v-show="!isView">
        {{ props.title === '新增' ? '创建' : '保存' }}
      </el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { UserInfo } from '@/api/modules/user/index'

interface DialogProps {
  title: string
  row?: UserInfo.ResUserList
  api: (data: UserInfo.ReqUserParams) => Promise<any>
}

const props = defineProps<DialogProps>()
const emit = defineEmits(['refresh'])

const visible = ref<boolean>(false)
const formRef = ref<FormInstance>()
const formData = reactive<UserInfo.ReqUserParams>({
  username: '',
  phone: '',
  nickname: '',
  avatarUrl: '',
  status: 1,
  password: '',
  submitPassword: ''
})

const isView = ref<boolean>(false)

// 监听row变化
watch(
  () => props.row,
  (newRow) => {
    if (newRow) {
      formData.username = newRow.username || ''
      formData.phone = newRow.phone || ''
      formData.nickname = newRow.nickname || ''
      formData.avatarUrl = newRow.avatarUrl || ''
      formData.status = newRow.status ?? 1
      isView.value = props.title === '查看'
    } else {
      formData.username = ''
      formData.phone = ''
      formData.nickname = ''
      formData.avatarUrl = ''
      formData.status = 1
      isView.value = false
    }
  },
  { immediate: true }
)

// 打开对话框
const open = (options: DialogProps) => {
  visible.value = true
  props.title = options.title
  props.row = options.row
  props.api = options.api
}

defineExpose({ open })

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为2-20个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur', when: () => props.title === '新增' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  submitPassword: [
    {
      validator: (_, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 提交表单
const submit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      await props.api(formData)
      ElMessage.success(`${props.title}用户成功`)
      visible.value = false
      emit('refresh')
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '操作失败，请重试')
      console.error('提交表单失败:', error)
    }
  })
}

// 关闭对话框
const close = () => {
  visible.value = false
  formRef.value?.resetFields()
  formData.status = 1
  isView.value = false
}
</script>

<style scoped>
.el-dialog__body {
  padding: 24px;
}
.el-form-item {
  margin-bottom: 16px;
}
</style>
