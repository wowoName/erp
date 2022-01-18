<!--  -->
 <template>
  <el-form :inline="true" size="small" class="demo-form-inline">
    <el-form-item>
      <el-button type="primary" icon="Plus" @click="handlerAdd()">新增产品系列</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" style="width: 100%" row-key="id" border default-expand-all>
    <el-table-column prop="name" label="商品名称" />
    <el-table-column label="操作" width="280">
      <template #default="scope">
        <el-button size="mini" icon="Edit" @click.prevent="handlerEdit(scope.row)">
          修改
        </el-button>
        <el-button type="primary" size="mini" icon="Plus" @click.prevent="handlerAdd(scope.row)">
          新增
        </el-button>

        <el-popconfirm title="确定要删除吗?" v-if="scope.row.children.length===0" @confirm="handlerDelete(scope.row)"
          confirm-button-text="确定" cancel-button-text="取消">
          <template #reference>
            <el-button size="small" type="danger" icon="Delete">
              删除
            </el-button>

          </template>
        </el-popconfirm>

      </template>
    </el-table-column>
  </el-table>

  <!-- 新增客户 dialog -->
  <el-dialog v-model="dialogVisible" width="500px" :title="isEdit?'修改产品类别':'新增产品类别'" :before-close="resetDialogForm">
    <el-form size="small" ref="dialogRef" :model="dialogForm" :rules="dialogFormRules" class="demo-form-inline">
      <el-form-item label="所属产品系列：">
        <span>{{currentEditData.pname}}</span>
      </el-form-item>
      <el-form-item label="产品名称：" prop="name">
        <el-input v-model="dialogForm.name" clearable placeholder="请输入产品名称"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">关闭</el-button>
        <el-button size="small" :loading="saveLoading" type="primary" @click="handlerSava()">保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

  <script>
import { reactive, toRefs, ref } from 'vue'
import { getCategoryTree, addCategory, updateCategory, deleteCategory } from '@/api/common'
import { globalLoading, showMessage } from '@/utils'
export default {
  name: 'category',
  setup(props, context) {
    const state = reactive({
      tableData: [],
      dialogVisible: false,// 修改、新增产品dialog
      isEdit: false,
      saveLoading: false,
      currentEditData: {},//当前修改数据
    })
    // 新增、修改form
    const dialogForm = reactive({
      name: ''
    })
    // 新增、修改formRules
    const dialogFormRules = {
      name: [{
        required: true, message: '请输入产品名称', trigger: 'blur',
      }],
    }
    // 新增、修改dialog ref
    const dialogRef = ref(null)
    const methods = {
      /**
       * 修改产品
       */
      handlerEdit(item) {
        state.isEdit = true
        state.currentEditData = item
        dialogForm.name = item.name
        state.dialogVisible = true
      },
      /**
       * 新增类别
       * @param {*} item 当前操作数据
       */
      handlerAdd(item = {}) {
        state.currentEditData = item
        dialogForm.name = ''
        state.currentEditData.pname = item?.name ?? '--'
        state.isEdit = false
        state.dialogVisible = true
      },
      /**
       * 删除
       */
      async handlerDelete(item) {
        const loading = globalLoading()
        const res = await deleteCategory(item.id)
        loading.close()
        showMessage(res.code === 200 ? 'success' : 'error', res.message)
        res.code === 200 && handlerGetCategory()
      },
      //保存
      async handlerSava() {
        const params = {
          name: dialogForm.name,
          pid: state.currentEditData?.pid ?? null
        }
        //修改参数添加id
        state.isEdit && (params.id = state.currentEditData.id)
        !state.isEdit && (params.pid = state.currentEditData.id)
        state.saveLoading = true
        const responseData = state.isEdit ? await updateCategory(params) : await addCategory(params);
        state.saveLoading = false
        // 刷新表格
        responseData.code === 200 && handlerGetCategory()
        //显示提示信息
        showMessage(responseData.code === 200 ? 'success' : 'error', responseData.message)
        responseData.code === 200 && (state.dialogVisible = false)
      },
      /**
       * 关闭dialog 之前 重置form
       */
      resetDialogForm(done) {
        dialogRef.value.resetFields()
        done()
      }
    }
    /**
     * 获取产品分类树
     */
    const handlerGetCategory = async () => {
      const categorytableData = await getCategoryTree()
      state.tableData = categorytableData.message
    }
    //加载产品类别数据
    handlerGetCategory()

    return {
      ...methods,
      ...toRefs(state), //抛出
      dialogFormRules,
      dialogForm,
      dialogRef,
    }
  },
}
  </script>
  <style lang='scss' scoped></style>