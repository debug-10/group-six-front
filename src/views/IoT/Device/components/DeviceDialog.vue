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
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="dialogProps.row.name" placeholder="请输入设备名称" maxlength="50" />
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="dialogProps.row.type" placeholder="请选择设备类型" class="w-full">
            <el-option label="类型1" :value="1" />
            <el-option label="类型2" :value="2" />
            <el-option label="类型3" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备位置" prop="location">
          <el-input v-model="dialogProps.row.location" placeholder="请输入设备位置" maxlength="100" />
        </el-form-item>
        <el-form-item label="设备 MAC 地址" prop="deviceMac">
          <el-input v-model="dialogProps.row.deviceMac" placeholder="请输入设备 MAC 地址" maxlength="50" />
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="dialogProps.title !== '新增'">
          <el-radio-group v-model="dialogProps.row.status">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dialogProps.row.remark" type="textarea" placeholder="请输入备注信息" maxlength="200" :rows="3" />
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
  row: { status: 1, deviceMac: '' }, // 新增 deviceMac 字段
  labelWidth: 100,
  fullscreen: false,
  maxHeight: '500px'
})

const rules = reactive({
  name: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
  location: [
    { required: true, message: '请输入设备位置', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  deviceMac: [
    { required: true, message: '请输入设备 MAC 地址', trigger: 'blur' },
    { min: 17, max: 17, message: 'MAC 地址格式不正确', trigger: 'blur' }, // 长度检查，可以根据需要调整
    { pattern: /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, message: 'MAC 地址格式不正确', trigger: 'blur' } // 正则表达式检查 MAC 地址
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
    dialogProps.value.row = { status: 1, deviceMac: '' } // 重置时清空 deviceMac
  }
}

defineExpose({ acceptParams })
</script>
