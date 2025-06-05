<template>
  <Dialog :model-value="dialogVisible" :title="dialogProps.title" :fullscreen="dialogProps.fullscreen" :max-height="dialogProps.maxHeight" :cancel-dialog="cancelDialog">
    <div :style="'width: calc(100% - ' + dialogProps.labelWidth! / 2 + 'px)'">
      <el-form
        ref="ruleFormRef"
        label-position="right"
        :label-width="dialogProps.labelWidth + 'px'"
        :rules="rules"
        :model="dialogProps.row"
        :disabled="dialogProps.isView"
        :hide-required-asterisk="dialogProps.isView"
      >
        <el-form-item label="租户名称" prop="tenantName">
          <el-input v-model="dialogProps.row.tenantName" placeholder="请输入租户名称" maxlength="50" />
        </el-form-item>
        <el-form-item label="套餐类型" prop="packageType">
          <el-select v-model="dialogProps.row.packageType" placeholder="请选择套餐类型" class="w-full">
            <el-option label="基础套餐" :value="1" />
            <el-option label="高级套餐" :value="2" />
            <el-option label="企业套餐" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="管理员用户名" prop="adminUsername">
          <el-input v-model="dialogProps.row.adminUsername" placeholder="请输入管理员用户名" maxlength="50" />
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="dialogProps.title !== '新增'">
          <el-radio-group v-model="dialogProps.row.status">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建者ID" prop="creatorId">
          <el-input v-model.number="dialogProps.row.creatorId" placeholder="请输入创建者ID" maxlength="10" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="cancelDialog">取消</el-button>
      <el-button type="primary" v-show="!dialogProps.isView" @click="handleSubmit">确定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'

interface DialogProps {
  title: string
  isView: boolean
  fullscreen?: boolean
  row: any
  labelWidth?: number
  maxHeight?: number | string
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  title: '',
  row: { status: 1, packageType: 1 },
  labelWidth: 100,
  fullscreen: false,
  maxHeight: '500px'
})

const rules = reactive({
  tenantName: [
    { required: true, message: '请输入租户名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  packageType: [{ required: true, message: '请选择套餐类型', trigger: 'change' }],
  adminUsername: [
    { required: true, message: '请输入管理员用户名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  creatorId: [
    { required: true, message: '请输入创建者ID', trigger: 'blur' },
    { type: 'number', message: '创建者ID必须为数字', trigger: 'blur' }
  ]
})

const ruleFormRef = ref<FormInstance>()

const acceptParams = (params: DialogProps) => {
  dialogProps.value = { ...dialogProps.value, ...params }
  dialogVisible.value = true
}

const handleSubmit = () => {
  ruleFormRef.value?.validate(async (valid) => {
    if (!valid) return
    await dialogProps.value.api?.(dialogProps.value.row)
    ElMessage.success(`${dialogProps.value.title}成功`)
    dialogProps.value.getTableList?.()
    cancelDialog(true)
  })
}

const cancelDialog = (clean = false) => {
  dialogVisible.value = false
  if (clean) {
    ruleFormRef.value?.resetFields()
    dialogProps.value.row = { status: 1, packageType: 1 }
  }
}

defineExpose({ acceptParams })
</script>
