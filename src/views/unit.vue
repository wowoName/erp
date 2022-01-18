<!--  -->
 <template>

  <el-form :inline="true" size="small" class="demo-form-inline">
    <el-form-item>
      <el-button type="primary" icon="Plus" @click="handlerAdd()">添加基础单位</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" v-loading="loadingTbl" row-key="id" border default-expand-all>
    <el-table-column prop="name" label="单位名称" />
    <el-table-column prop="ratio" label="与上级换算比例" />

    <el-table-column label="操作" width="280">
      <template #default="scope">
        <el-button size="mini" icon="Edit" @click.prevent="handlerEdit(scope.row)">
          修改
        </el-button>
        <el-button type="primary" v-if="scope.row.children.length===0" size="mini" icon="Plus"
          @click.prevent="handlerAdd(scope.row)">
          新增
        </el-button>

      </template>
    </el-table-column>
  </el-table>

  <!-- 新增客户 dialog -->
  <el-dialog v-model="dialogVisible" width="500px" :title="isEdit?'修改单位':'新增单位'" :before-close="resetDialogForm">
    <el-form size="small" ref="dialogRef" :model="dialogForm" :rules="dialogFormRules" class="demo-form-inline">

      <el-form-item label="单位名称：" prop="name">
        <el-input v-model="dialogForm.name" clearable placeholder="请输入产品名称"></el-input>
      </el-form-item>

      <el-form-item label="换算比例：" prop="ratio" v-if="dialogForm.ratio!==null">
        <el-input-number style="width:100%" v-model="dialogForm.ratio" :min="1" clearable placeholder="请输入换上比例">
        </el-input-number>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">关闭</el-button>
        <el-button size="small" :loading="saveLoading" type="primary" @click="handlerSave()">保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

  <script>
import { reactive, toRefs, ref } from 'vue'
import { updateUnit, addUnit, getUnitList } from '@/api/common'
import { showMessage } from '@/utils'
export default {
  name: 'unitManager',
  setup(props, context) {
    const state = reactive({
      tableData: [],
      dialogVisible: false,// 修改、新增产品dialog
      isEdit: false,
      saveLoading: false,
      currentEditData: {},//当前修改数据
      loadingTbl: false,//表格加载状态
    })
    // 新增、修改form
    const dialogForm = reactive({
      name: '',
      ratio: 1
    })
    // 新增、修改formRules
    const dialogFormRules = {
      name: [{
        required: true, message: '请输入单位名称', trigger: 'blur',
      }],
      ratio: [{
        required: true, message: '请输入换算比例', trigger: 'change',
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
        dialogForm.ratio = item.ratio
        state.dialogVisible = true
      },
      /**
       * 新增类别
       * @param {*} item 当前操作数据
       */
      handlerAdd(item = {}) {
        state.currentEditData = item
        dialogForm.name = ''
        dialogForm.ratio = Object.keys(item).length == 0 ? null : 1;
        state.isEdit = false
        state.dialogVisible = true
      },
      //保存
      handlerSave() {
        dialogRef.value.validate(async (valid) => {
          if (valid) {
            const params = Object.assign({}, dialogForm)
            //修改参数添加id
            state.isEdit && (params.id = state.currentEditData.id)
            //新增
            !state.isEdit && (params.pid = state.currentEditData.id)
            state.saveLoading = true
            const responseData = state.isEdit ? await updateUnit(params) : await addUnit(params);
            state.saveLoading = false
            // 刷新表格
            responseData.code === 200 && handlerGetUnitTree()
            //显示提示信息
            showMessage(responseData.code === 200 ? 'success' : 'error', responseData.message)
            responseData.code === 200 && (state.dialogVisible = false)
          } else {
            console.log('error submit!!')
            return false
          }
        })

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
     * 获取计量单位树
     */
    const handlerGetUnitTree = async () => {
      state.loadingTbl = true
      const res = await getUnitList()
      res.code === 200 && (state.tableData = res.message)
      state.loadingTbl = false
    }
    //加载产品类别数据
    handlerGetUnitTree()

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