<template>
  <Dialog :model-value="visible" :title="dialogTitle" :max-height="'500px'">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" :disabled="isView">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" clearable />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="formData.role" placeholder="请选择角色" :disabled="isView">
          <el-option label="租户管理员" value="2" />
          <el-option label="用户" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像URL" prop="avatarUrl">
        <el-input v-model="formData.avatarUrl" placeholder="请输入头像URL" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!isView && showPasswordField">
        <el-input v-model="formData.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit" v-show="!isView">
        {{ dialogTitle === '编辑' ? '保存' : '更新' }}
      </el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { UserInfo } from '@/api/modules/user'

interface DialogOptions {
  title: string
  row?: UserInfo.ResUserList
  api: (id: number, data: UserInfo.UpdateUserParams) => Promise<any>
  showPassword?: boolean
}

const props = defineProps<{
  visible: boolean
}>()
const emit = defineEmits(['update:visible', 'refresh'])

const dialogOptions = ref<DialogOptions>({
  title: '',
  api: () => Promise.resolve(),
  showPassword: false
})
const dialogTitle = computed(() => dialogOptions.value.title)
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const formRef = ref<FormInstance>()
const currentUserId = ref<number | undefined>(undefined)

const formData = reactive<UserInfo.UpdateUserParams>({
  username: '',
  phone: '',
  nickname: '',
  avatarUrl: '',
  role: 3,
  password: ''
})

const isView = ref<boolean>(false)

const showPasswordField = computed(() => {
  return dialogOptions.value.showPassword
})

// 打开对话框
const open = (options: DialogOptions) => {
  // 重置表单数据
  resetFormData()

  // 更新对话框选项
  dialogOptions.value = { ...options }

  // 处理用户数据
  if (options.row) {
    currentUserId.value = options.row.id
    populateFormData(options.row)
    isView.value = options.title === '查看'
  }

  // 显示对话框
  visible.value = true
}

// 重置表单数据
const resetFormData = () => {
  formData.username = ''
  formData.phone = ''
  formData.nickname = ''
  formData.avatarUrl = ''
  formData.role = 3
  formData.password = ''
  currentUserId.value = undefined
  isView.value = false
}

// 从表格行数据填充表单数据
const populateFormData = (row: UserInfo.ResUserList) => {
  // 直接映射相同字段名的属性
  formData.username = row.username || ''
  formData.phone = row.phone || ''
  formData.nickname = row.nickname || ''
  formData.avatarUrl = row.avatarUrl || ''

  // 确保角色值是数字类型
  if (row.role !== undefined) {
    formData.role = typeof row.role === 'string' ? parseInt(row.role) : row.role
  }

  // 对于其他可能需要转换的字段，可以在这里添加映射逻辑
  // 例如：formData.status = row.status || 1
}

defineExpose({ open })

// 监听对话框选项变化，确保数据同步
watch(
  () => dialogOptions.value,
  (newOptions) => {
    if (newOptions.row) {
      currentUserId.value = newOptions.row.id
      populateFormData(newOptions.row)
      isView.value = newOptions.title === '查看'
    }
  },
  { immediate: true }
)

// 监听对话框显示状态变化
watch(
  () => visible.value,
  (newVisible) => {
    if (!newVisible) {
      // 对话框关闭时重置表单
      resetFormData()
      formRef.value?.resetFields()
    }
  }
)

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
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  password: [{ min: 6, message: '密码长度至少为6位', trigger: 'blur', when: () => showPasswordField.value }]
})

// 提交表单
const submit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      if (!currentUserId.value && dialogOptions.value.title === '编辑') {
        throw new Error('缺少用户ID')
      }

      if (dialogOptions.value.title === '新增') {
        await dialogOptions.value.api(0, formData)
      } else {
        await dialogOptions.value.api(currentUserId.value!, formData)
      }

      ElMessage.success(`${dialogOptions.value.title}用户成功`)
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
}
</script>

<style scoped>
/* 样式... */
</style>
