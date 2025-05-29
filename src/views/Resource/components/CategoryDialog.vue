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
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="dialogProps.row!.title" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="分类类型" prop="type">
          <el-select v-model="dialogProps.row!.type" placeholder="请选择分类类型">
            <el-option label="类型 1" :value="1"></el-option>
            <el-option label="类型 2" :value="2"></el-option>
            <el-option label="类型 3" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类描述" prop="description">
          <el-input v-model="dialogProps.row!.description" placeholder="请输入分类描述" clearable></el-input>
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
  row: {},
  labelWidth: 160,
  fullscreen: true,
  maxHeight: '500px'
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

const rules = reactive({
  title: [
    { required: true, message: '请填写分类名称', trigger: 'blur' },
    { max: 50, message: '分类名称最多50个字符', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择分类类型', trigger: 'change' }],
  description: [{ max: 200, message: '描述最多200个字符', trigger: 'blur' }]
})

const ruleFormRef = ref<FormInstance>()

// 提交表单
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await dialogProps.value.api!(dialogProps.value.row)
      ElMessage.success(`${dialogProps.value.title}分类成功！`)
      dialogProps.value.getTableList!()
      cancelDialog(true)
    } catch (error) {
      console.log(error)
    }
  })
}

// 取消操作
const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  if (isClean || ['查看', '编辑'].includes(dialogProps.value.title)) {
    dialogProps.value.row = {}
    ruleFormRef.value!.resetFields()
  }
}
</script>

<style scoped lang="less"></style>
