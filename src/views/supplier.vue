<!--  -->
 <template>
  <el-form :inline="true" :model="queryForm" size="small" class="demo-form-inline">
    <el-form-item label="供应商名称：" prop="name">
      <el-input v-model="queryForm.name" @keyup.enter.native="getSepcieData()" clearable placeholder="请输入产品名称">
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getSepcieData()" icon="Search">查询
      </el-button>
      <el-button icon="Plus" @click="handlerAdd()">新增供应商</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" v-loading="loadTable" v-tableHeight row-key="id" border default-expand-all>
    <el-table-column prop="name" label="供应商名称" />
    <el-table-column prop="contact" label="联系人" width="110" />
    <el-table-column prop="phone" label="电话" width="110" />
    <el-table-column prop="address" label="地址" />
    <el-table-column prop="remarks" label="备注" />
    <el-table-column label="操作" width="200" fixed="right">
      <template #default="scope">
        <el-button size="mini" icon="Edit" @click.prevent="handlerEdit(scope.row)">
          修改
        </el-button>
        <el-popconfirm title="确定要删除吗?" @confirm="handlerDelete(scope.row)" confirm-button-text="确定"
          cancel-button-text="取消">
          <template #reference>
            <el-button size="mini" type="danger" icon="Delete">
              删除
            </el-button>
          </template>
        </el-popconfirm>

      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:currentPage="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange">
  </el-pagination>

  <!--  dialog -->
  <el-dialog v-model="dialogVisible" width="500px" :title="isEdit?'修改供应商':'新增供应商'" :before-close="resetDialogForm">
    <el-form size="small" ref="dialogRef" label-width="120px" :model="dialogForm" :rules="dialogFormRules"
      class="demo-form-inline">

      <el-form-item label="供应商名称：" prop="name" v-if="isEdit">
        {{dialogForm.name}}
      </el-form-item>
      <el-form-item label="供应商名称：" prop="name" v-else>
        <el-input v-model.trim="dialogForm.name" @keyup.enter.native="handlerSava()" clearable placeholder="请输入供应商名称">
        </el-input>
      </el-form-item>

      <el-form-item label="联系人：" prop="contact">
        <el-input v-model.trim="dialogForm.contact" clearable placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="phone">
        <el-input v-model.number="dialogForm.phone" maxlength="11" clearable placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="公司地址：" prop="address">
        <el-input v-model.trim="dialogForm.address" type="textarea" :row="2" show-word-limit maxlength="30" clearable
          placeholder="请输入公司地址">
        </el-input>
      </el-form-item>
      <el-form-item label="备注信息：" prop="remarks">
        <el-input v-model.trim="dialogForm.remarks" @keyup.enter.native="handlerSava()" type="textarea" :row="3"
          show-word-limit maxlength="50" clearable placeholder="请输入备注信息">
        </el-input>
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
import { reactive, toRefs, ref, toRaw, nextTick } from 'vue'
import {
  deleteSupplier, getSupplierList, updateSupplier, addSupplier
} from '@/api/common'
import { globalLoading, showMessage } from '@/utils'
export default {
  name: 'supplierManage',
  setup(props, context) {
    const state = reactive({
      tableData: [],
      dialogVisible: false,// 修改、新增产品dialog
      isEdit: false,
      saveLoading: false,
      currentEditData: {},// 当前修改数据
      unitData: [],// 单位数据
      categorytableData: [],// 产品数据
      loadignData: false,//加载 产品 以及单位loading
      queryForm: {
        name: '',
        categoryId: ''
      },
      cascaderOptions: { value: 'id', label: 'name' },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loadTable: false
    })

    //供应商数据
    const getSupplierFormData = () => ({
      name: '',
      contact: '',
      phone: '',
      address: '',
      remarks: ''
    })
    // 新增、修改form
    let dialogForm = reactive(getSupplierFormData())
    // 新增、修改formRules
    const dialogFormRules = {
      name: [{
        required: true, message: '请输入供应商名称', trigger: 'blur',
      }]

    }
    // 新增、修改dialog ref
    const dialogRef = ref(null)
    const methods = {
      /**
       * 获取列表
       */
      async getSepcieData() {
        state.loadTable = true
        const params = Object.assign({}, state.queryForm, {
          pageSize: state.pageSize,
          pageNo: state.currentPage
        })
        //产品id如果是数组取最后一位
        Array.isArray(params.categoryId) && (params.categoryId = params.categoryId.at(-1))
        const res = await getSupplierList(params)
        res.code === 200 && (state.tableData = res.message.records) && (state.total = res.message.total)
        state.loadTable = false
      },
      /**
       * 修改
       */
      handlerEdit(item) {
        state.isEdit = true
        state.dialogVisible = true
        state.currentEditData = item
        nextTick(() => {
          dialogRef.value.resetFields()
          for (const key in dialogForm) {
            dialogForm[key] = item[key]
          }
        })
      },
      /**
       * 新增
       * @param {*} item 当前操作数据
       */
      handlerAdd(item = {}) {
        state.dialogVisible = true
        state.isEdit = false
        nextTick(() => {
          dialogRef.value.resetFields()
          state.currentEditData = item
        })
      },
      /**
       * 删除
       */
      async handlerDelete(item) {
        const loading = globalLoading()
        const res = await deleteSupplier(item.id)
        loading.close()
        showMessage(res.code === 200 ? 'success' : 'error', res.message)
        res.code === 200 && this.getSepcieData()
      },
      //保存
      handlerSava() {
        dialogRef.value.validate(async (valid) => {
          if (valid) {
            const params = Object.assign({}, dialogForm)
            //修改参数添加id
            state.isEdit && (params.id = state.currentEditData.id)
            state.saveLoading = true
            const responseData = state.isEdit ? await updateSupplier(params) : await addSupplier(params);
            state.saveLoading = false
            // 刷新表格
            responseData.code === 200 && this.getSepcieData()
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
        done()
      },

      /**
       * 分页记录数改变
       */
      handleSizeChange(value) {
        state.pageSize = value
        this.getSepcieData()
      },
      /**
       * 分页页数改变
       */
      handleCurrentChange(value) {
        state.currentPage = value
        this.getSepcieData()
      }
    }
    //查询批次列表
    methods.getSepcieData()

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