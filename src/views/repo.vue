<!--  -->
 <template>
  <el-form :inline="true" :model="queryForm" size="small" class="demo-form-inline">
    <el-form-item label="仓库名称：" prop="name">
      <el-input v-model="queryForm.name" @keyup.enter.native="getTableData()" clearable placeholder="请输入仓库名称查询">
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="getTableData()" icon="Search">查询
      </el-button>
      <el-button icon="Plus" @click="handlerAdd()">新增仓库</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" v-loading="loadTable" row-key="id" border default-expand-all>
    <el-table-column prop="name" label="仓库名称" />
    <el-table-column prop="address" label="仓库地址" />
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button size="mini" icon="Edit" @click.prevent="handlerEdit(scope.row)">
          修改
        </el-button>
        <el-popconfirm title="确定要删除吗?" @confirm="handlerDelete(scope.row)" confirm-button-text="确定"
          cancel-button-text="取消">
          <template #reference>
            <el-button size="small" type="danger" icon="Delete">
              删除
            </el-button>
          </template>
        </el-popconfirm>

      </template>
    </el-table-column>
  </el-table>

  <!--  dialog -->
  <el-dialog v-model="dialogVisible" width="500px" :title="isEdit?'修改仓库':'新增仓库'" :before-close="resetDialogForm">
    <el-form size="small" ref="dialogRef" :model="dialogForm" :rules="dialogFormRules" class="demo-form-inline">
      <el-form-item label="仓库名称：" prop="name">
        <el-input v-model.trim="dialogForm.name" maxlength="20" show-word-limit clearable placeholder="请输入仓库名称">
        </el-input>
      </el-form-item>

      <el-form-item label="仓库地址：" prop="address">
        <el-input v-model.trim="dialogForm.address" :rows="3" type="textarea" maxlength="50" show-word-limit clearable
          placeholder="请输入仓库地址" style="width:100%"></el-input>
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
import { reactive, toRefs, ref, toRaw } from 'vue'
import { addRepo, updateRepo, getRepoList, deleteRepo } from '@/api/common'
import { globalLoading, showMessage } from '@/utils'
export default {
  name: 'repoManager',
  setup(props, context) {
    const state = reactive({
      tableData: [],
      dialogVisible: false,// 修改、新增dialog
      isEdit: false,
      saveLoading: false,
      currentEditData: {},// 当前修改数据
      queryForm: {
        name: ''
      },
      loadTable: false
    })
    // 新增、修改form
    let dialogForm = reactive({
      name: '',
      address: ''
    })
    // 新增、修改formRules
    const dialogFormRules = {
      name: [{
        required: true, message: '请输入产品名称', trigger: 'blur',
      }],
      address: [{
        required: true, message: '请输入仓库地址', trigger: 'blur',
      }],

    }
    // 新增、修改dialog ref
    const dialogRef = ref(null)
    const methods = {
      /**
       * 获取列表
       */
      async getTableData() {
        state.loadTable = true
        const params = Object.assign({}, state.queryForm)
        const res = await getRepoList(params)
        res.code === 200 && (state.tableData = res.message)
        state.loadTable = false
      },
      /**
       * 修改
       */
      handlerEdit(item) {
        state.isEdit = true
        state.currentEditData = item
        dialogForm.name = item.name
        dialogForm.address = item.address
        state.dialogVisible = true
      },
      /**
       * 新增批次
       * @param {*} item 当前操作数据
       */
      handlerAdd(item = {}) {
        state.currentEditData = item
        dialogForm.name = ''
        dialogForm.address = ''
        state.isEdit = false
        state.dialogVisible = true
      },
      /**
       * 删除
       */
      async handlerDelete(item) {
        const loading = globalLoading()
        const res = await deleteRepo(item.id)
        loading.close()
        showMessage(res.code === 200 ? 'success' : 'error', res.message)
        res.code === 200 && this.getTableData()
      },
      //保存
      handlerSava() {
        dialogRef.value.validate(async (valid) => {
          if (valid) {
            const params = Object.assign({}, dialogForm)
            //修改参数添加id
            state.isEdit && (params.id = state.currentEditData.id)
            state.saveLoading = true
            const responseData = state.isEdit ? await updateRepo(params) : await addRepo(params);
            state.saveLoading = false
            // 刷新表格
            responseData.code === 200 && this.getTableData()
            //显示提示信息
            showMessage(responseData.code === 200 ? 'success' : 'error', responseData.message)
            responseData.code === 200 && (state.dialogVisible = false)
          }
          else {
            return false
          }
        })

      },
      /**
       * 关闭dialog 之前 重置form
       */
      resetDialogForm(done) {
        dialogRef.value.resetFields()
        state.saveLoading = false
        done()
      },
    }

    //查询表格列表
    methods.getTableData()

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