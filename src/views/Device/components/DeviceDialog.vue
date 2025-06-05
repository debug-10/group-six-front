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
      <slot name="footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" v-show="!dialogProps.isView" @click="handleSubmit">确定</el-button>
      </slot>
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
  row: { status: 1 },
  labelWidth: 100,
  fullscreen: false,
  maxHeight: '500px'
})

// 表单校验规则
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
  status: [{ required: true, message: '请选择设备状态', trigger: 'change' }]
})

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  params.row = { ...dialogProps.value.row, ...params.row }
  dialogProps.value = { ...dialogProps.value, ...params }
  dialogVisible.value = true
}

defineExpose({
  acceptParams
})

// 表单实例
const ruleFormRef = ref<FormInstance>()

// 提交表单
const handleSubmit = () => {
  ruleFormRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      await dialogProps.value.api!(dialogProps.value.row)
      ElMessage.success(`${dialogProps.value.title}设备成功！`)
      dialogProps.value.getTableList!()
      cancelDialog(true)
    } catch (error) {
      console.error(error)
    }
  })
}

// 关闭弹窗
const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  if (isClean) {
    dialogProps.value.row = { status: 1 }
    ruleFormRef.value?.resetFields()
  }
}
</script>
