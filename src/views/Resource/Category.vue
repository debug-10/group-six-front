<template>
  <div class="table-box">
    <ProTable ref="proTable" title="分类列表" :columns="columns" :requestApi="getTableList" :initParam="initParam" :dataCallback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteRow(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <CategoryDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="CategoryManagement">
import { ref, reactive } from 'vue'
import { Category } from '@/api/interface/index'
import { ColumnProps } from '@/components/ProTable/interface'
import { useHandleData } from '@/hooks/useHandleData'
import ProTable from '@/components/ProTable/index.vue'
import CategoryDialog from '@/views/Resource/components/CategoryDialog.vue'
import { CirclePlus, Delete, EditPen, View } from '@element-plus/icons-vue'
import { CategoryApi } from '@/api/modules/Category'

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()

// 如果表格需要初始化请求参数，直接定义传给 ProTable
const initParam = reactive({})

// dataCallback 是对于返回的表格数据做处理，如果后台返回的数据不是 datalist && total 这些字段，那么可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

// 请求分类数据
const getTableList = (params: any) => {
  let newParams = { ...params }
  return CategoryApi.page(newParams)
}

// 表格配置项
// 表格配置项
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'title',
    label: '分类名称',
    search: { el: 'input' }
  },
  {
    prop: 'type',
    label: '分类类型'
  },
  {
    prop: 'description',
    label: '分类描述',
    width: 200 // 设置合适的宽度
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 200
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

// 删除分类
const deleteRow = async (params: Category) => {
  try {
    await useHandleData(CategoryApi.delete, [params.pkId], `删除【${params.title}】分类`)
    proTable.value.getTableList() // 刷新表格数据
  } catch (error) {
    console.error('删除失败', error)
  }
}

// 打开 drawer (新增、查看、编辑)
const dialogRef = ref()
const openDrawer = (title: string, row: Partial<Category> = {}) => {
  let params = {
    title,
    row: { ...row }, // 如果是编辑，传入已有的分类数据
    isView: title === '查看', // 查看时不允许修改
    api: title === '新增' ? CategoryApi.add : title === '编辑' ? CategoryApi.edit : '',
    getTableList: proTable.value.getTableList // 刷新表格数据
  }
  dialogRef.value.acceptParams(params) // 打开对话框并传入数据
}
</script>
