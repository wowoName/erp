<!--  -->
 <template>
  <el-form :inline="true" :model="queryForm" size="small" class="demo-form-inline">
    <el-form-item label="批次名称：" prop="name">
      <el-input v-model="queryForm.name" @keyup.enter.native="getSepcieData()" clearable placeholder="请输入产品名称">
      </el-input>
    </el-form-item>
    <el-form-item label="所属产品：" prop="categoryId">
      <el-cascader v-model="queryForm.categoryId" :options="categorytableData" :props="cascaderOptions" clearable>
      </el-cascader>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getSepcieData()" icon="Search">查询
      </el-button>
      <!-- <el-button icon="Plus" @click="handlerAdd()">新增批次</el-button> -->
    </el-form-item>
  </el-form>
  <el-table :data="tableData" v-loading="loadTable" row-key="id" border default-expand-all>
    <el-table-column prop="name" label="批次名称" />
    <el-table-column prop="categoryName" label="所属产品" />

    <el-table-column prop="cost" label="成本">
      <template #default="scope">
        <span>{{scope.row.cost}} / {{scope.row.unitName}}</span>
      </template>
    </el-table-column>

    <el-table-column prop="cost" label="仓库">
      <template #default="scope">
        <span>{{scope.row.inventory.repoName}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cost" label="库存">
      <template #default="scope">
        <span>{{scope.row.inventory.stock}} / {{scope.row.inventory.unitName}}</span>
      </template>
    </el-table-column>
    <!--  <el-table-column prop="selling" label="售价" width="150">
      <template #default="scope">
        <span>{{scope.row.selling}} / {{scope.row.unitName}}</span>
      </template>
    </el-table-column> -->
    <!-- <el-table-column label="操作" width="200">
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
    </el-table-column> -->
  </el-table>
  <el-pagination v-model:currentPage="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange">
  </el-pagination>

  <!--  dialog -->
  <el-dialog v-model="dialogVisible" width="500px" :close-on-click-modal="false" :title="isEdit?'修改批次':'新增批次'"
    :before-close="resetDialogForm">
    <el-form size="small" ref="dialogRef" :model="dialogForm" :rules="dialogFormRules" class="demo-form-inline">
      <el-form-item label="批次名称：" prop="name">
        <el-input v-model="dialogForm.name" clearable placeholder="请输入批次名称"></el-input>

      </el-form-item>
      <el-form-item label="所属产品：" prop="categoryId">
        <el-cascader v-model="dialogForm.categoryId" :disabled="isEdit" :props="cascaderOptions"
          :options="categorytableData" :loading="loadignData" clearable placeholder="请选择所属产品" style="width:100%">
        </el-cascader>
      </el-form-item>
      <el-form-item label="数量单位：" prop="unitId">
        <el-cascader v-model="dialogForm.unitId" :props="{label:'name',value:'id',checkStrictly:true}"
          :options="unitData" :loading="loadignData" clearable placeholder="请选择价格基础单位" style="width:100%">

        </el-cascader>
      </el-form-item>
      <!-- <el-form-item label="本批成本：" prop="cost">
        <el-input-number v-model="dialogForm.cost" :min="0" controls-position="right" clearable placeholder="请输入1单位产品成本"
          style="width:100%">
        </el-input-number>
      </el-form-item>
      <el-form-item label="本批售价：" prop="selling">
        <el-input-number v-model="dialogForm.selling" :min="0" controls-position="right" clearable
          placeholder="请输入1单位产品售价" style="width:100%"></el-input-number>
      </el-form-item> -->

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
import { getUnitList, getCategoryTree, getSpecieList, addSpecie, updateSpecie } from '@/api/common'
import { globalLoading, showMessage } from '@/utils'
export default {
  name: 'specie',
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
    // 新增、修改form
    let dialogForm = reactive({
      name: '',
      categoryId: [],
      cost: 0,
      selling: 0,
      unitId: ""
    })
    // 新增、修改formRules
    const dialogFormRules = {
      name: [{
        required: true, message: '请输入产品名称', trigger: 'blur',
      }],
      categoryId: [{
        type: 'array', required: true, message: '请选择批次所属产品', trigger: 'blur',
      }],
      // cost: [{
      //   required: true, message: '请输入产品单位进价', trigger: 'blur',
      // }],
      // selling: [{
      //   required: true, message: '请输入产品单位售价', trigger: 'blur',
      // }],
      // unitId: [{
      //   type: 'array', required: true, message: '请输入价格基础单位', trigger: 'blur',
      // }],
    }
    // 新增、修改dialog ref
    const dialogRef = ref(null)
    const methods = {
      /**
       * 获取批次列表
       */
      async getSepcieData() {
        state.loadTable = true
        const params = Object.assign({}, state.queryForm, {
          pageSize: state.pageSize,
          pageNo: state.currentPage
        })
        //产品id如果是数组取最后一位
        Array.isArray(params.categoryId) && (params.categoryId = params.categoryId.at(-1))
        const res = await getSpecieList(params)
        res.code === 200 && (state.tableData = res.message.records) && (state.total = res.message.total)
        state.loadTable = false
      },
      /**
       * 修改批次
       */
      handlerEdit(item) {
        state.isEdit = true
        state.currentEditData = item
        let das = toRaw(item)
        for (const key in dialogForm) {
          dialogForm[key] = das[key]
        }
        state.dialogVisible = true
      },
      /**
       * 新增批次
       * @param {*} item 当前操作数据
       */
      handlerAdd(item = {}) {
        state.currentEditData = item
        state.dialogVisible = true
        nextTick(() => {
          dialogRef.value.resetFields()
          state.isEdit = false

        })
      },
      /**
       * 删除
       */
      async handlerDelete(item) {
        const loading = globalLoading()
        const res = await deleteCategory(item.id)
        loading.close()
        showMessage(res.code === 200 ? 'success' : 'error', res.message)
        res.code === 200 && this.getSepcieData()
      },
      //保存
      handlerSava() {
        dialogRef.value.validate(async (valid) => {
          if (valid) {
            const params = Object.assign({}, dialogForm)
            //产品单位取最后一位
            params.categoryId = Array.isArray(params.categoryId) ? params.categoryId.at(-1) : params.categoryId
            //计量单位取最后一位
            params.unitId = Array.isArray(params.unitId) ? params.unitId.at(-1) : params.unitId
            //修改参数添加id
            state.isEdit && (params.id = state.currentEditData.id)
            state.saveLoading = true
            const responseData = state.isEdit ? await updateSpecie(params) : await addSpecie(params);
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

    /**
     * 获取产品以及单位数据
     */
    const getUnitAndCategoryData = async () => {
      state.loadignData = true
      const res = await Promise.all([getUnitList(), getCategoryTree()])
      res[0].code === 200 && (state.unitData = res[0].message)// 单位数据
      res[1].code === 200 && (state.categorytableData = res[1].message)//产品数据
      state.loadignData = false
    }
    //查询批次列表
    methods.getSepcieData()
    //获取产品以及单位数据
    getUnitAndCategoryData()

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