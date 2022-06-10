<!--  -->
 <template>
  <el-form :inline="true" :model="queryForm" label-width="100px" size="small" class="demo-form-inline">
    <el-form-item label="采购单号：">
      <el-input v-model="queryForm.code" @keyup.enter.native="getTableData()" clearable placeholder="请输采购单号">
      </el-input>
    </el-form-item>
    <el-form-item label="开始时间：">
      <el-date-picker v-model="queryForm.startDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss" placeholder="申请开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间：">
      <el-date-picker v-model="queryForm.endDate" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime" placeholder="申请结束时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="商品类型：">
      <el-cascader v-model="queryForm.categoryId" :options="categoryData" placeholder="选择查询商品" :props="cascaderOptions"
        collapse-tags clearable />
    </el-form-item>

    <el-form-item label="申请人：">
      <el-select v-model="queryForm.applyId" clearable filterable placeholder="选择申请人">
        <el-option v-for="item in agentData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="采购人：">
      <el-select v-model="queryForm.purchaseId" clearable filterable placeholder="选择采购人">
        <el-option v-for="item in agentData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="审核状态">
      <el-select v-model="queryForm.status" clearable filterable placeholder="选择审核状态">
        <el-option v-for="item in statusData" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getTableData()" icon="Search">查询
      </el-button>
      <el-button icon="Plus" @click="handlerAdd()">新增申请采购单</el-button>
    </el-form-item>

  </el-form>
  <el-table :data="tableData" v-loading="loadTable" v-tableHeight row-key="id" border
    :tree-props="{ children: 'childrens' }">
    <el-table-column type="expand">
      <template #default="props">
        <div class="grn-detail-list">
          <el-table :data="props.row.children">
            <el-table-column prop="categoryName" label="采购产品"></el-table-column>
            <el-table-column prop="categoryName" label="产品名称"></el-table-column>
            <el-table-column prop="amount" label="采购数量">
              <template #default="propsc">
                {{propsc.row.amount}} / {{propsc.row.unitName}}
              </template>
            </el-table-column>
            <el-table-column prop="repoName" label="仓库名称"></el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column type="index" width="50" />
    <el-table-column prop="applyDate" label="申请日期" width="160" />
    <el-table-column prop="statusName" label="审核状态" width="120">
      <template #default="scope">
        <span :class="['status-'+scope.row.status]">{{scope.row.statusName}}</span>
      </template>
    </el-table-column>

    <el-table-column prop="code" label="采购单号" min-width="200" />
    <el-table-column label="采购产品" min-width="320">
      <template #default="props">
        <span v-html="getTblTemplate(props.row.children)"></span>
      </template>
    </el-table-column>
    <el-table-column prop="applyUserName" label="申请人" min-width="120" />
    <el-table-column prop="purchaseUserName" label="采购人" min-width="120" />
    <el-table-column prop="remarks" label="申请人备注" min-width="200" />

    <el-table-column prop="checkUserName" label="审核人" min-width="120" />
    <el-table-column prop="checkRemarks" label="审核人备注" min-width="120" />

    <el-table-column label="操作" width="150" fixed="right">
      <template #default="scope">
        <!-- <el-button size="mini" icon="Edit" @click.prevent="handlerEdit(scope.row)" v-if="scope.row.status!='1'">
          修改
        </el-button>
        <el-button size="mini" type="primary" icon="Coordinate" @click.prevent="handlerAudit(scope.row)"
          v-if="scope.row.status=='0'">
          审核
        </el-button>

        <el-button size="mini" icon="View" @click.prevent="handlerAudit(scope.row,'view')">
          查看
        </el-button>
        <el-button size="mini" icon="Printer" @click.prevent="handlerPrint(scope.row)" v-if="scope.row.status=='1'">
          打印
        </el-button> -->

        <el-dropdown split-button type="primary" @click="handlerAudit(scope.row,'view')" size="mini"
          @command="v=>handleCommand(v,scope.row)">
          <el-icon>
            <View />
          </el-icon>查看
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="edit" v-if="scope.row.status!='1'">
                <el-icon>
                  <edit></edit>
                </el-icon>修改
              </el-dropdown-item>
              <el-dropdown-item command="audit" v-if="scope.row.status!='1'">
                <el-icon>
                  <coordinate></coordinate>
                </el-icon>审核
              </el-dropdown-item>
              <el-dropdown-item command="print" v-if="scope.row.status=='1'">
                <el-icon>
                  <printer></printer>
                </el-icon>打印
              </el-dropdown-item>
              <el-dropdown-item command="delete" v-if="scope.row.status!='1'">
                <el-icon>
                  <delete />
                </el-icon>删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:currentPage="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="v=>handleSizeChange(v)"
    @current-change="v=>handleCurrentChange(v)">
  </el-pagination>

  <!--  dialog -->
  <el-dialog v-model="dialogVisible" width="800px" fullscreen :title="isEdit?'修改采购单':'新增采购单'"
    :before-close="resetDialogForm">
    <el-form size="small" ref="dialogRef" label-width="120px" :model="dialogForm" :rules="dialogFormRules"
      class="demo-form-inline">

      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="采购单编号：" prop="code">
            <span v-if="isEdit">{{dialogForm.code}}</span>
            <el-input v-else v-model.trim="dialogForm.code" :maxlength="20" @keyup.enter.native="handlerSave()"
              clearable placeholder="请输入采购单编号">
            </el-input>

          </el-form-item>

        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="采购日期：" prop="date">
            <span v-if="isEdit">{{dialogForm.purchaseDate}}</span>
            <el-date-picker v-else v-model="dialogForm.purchaseDate" format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss" type="datetime" :disabled-date="disabledDate" placeholder="请选择采购日期"
              style="width:100%">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="申请人：" prop="applyId">
            <el-select v-model="dialogForm.applyId" filterable clearable placeholder="选择申请人" style="width:100%">
              <el-option v-for="item in agentData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="采购人：" prop="purchaseId">
            <el-select v-model="dialogForm.purchaseId" filterable clearable placeholder="选择申请人" style="width:100%">
              <el-option v-for="item in agentData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item label-width='0'>
        <el-divider> <span class="grn-detail-title">采购产品明细</span> </el-divider>
      </el-form-item>
      <el-form-item label-width='0'>
        <el-table :data="dialogForm.children">
          <el-table-column label="采购产品" min-width="220px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.categoryId'"
                :rules="dialogFormRules.categoryId">
                <el-cascader v-model="props.row.categoryId" filterable size="mini" :options="categoryData"
                  placeholder="请选择采购产品" :props="{ value: 'id', label: 'name' }" collapse-tags clearable
                  style="width:100%" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="采购仓库" min-width="220px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.repoId'" :rules="dialogFormRules.repoId">
                <el-select v-model="props.row.repoId" filterable clearable placeholder="请选择仓库地址" style="width:100%">
                  <el-option v-for="item in repoData" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="采购数量" min-width="160px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.amount'" :rules="dialogFormRules.amount">
                <el-input-number v-model.number="props.row.amount" :min="0" style="width:100%" clearable
                  placeholder="请输入采购数量">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="数量单位" min-width="160px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.unitId'" :rules="dialogFormRules.unitId">
                <el-cascader v-model="props.row.unitId" filterable
                  :props="{ value: 'id', label: 'name', checkStrictly: true }" :options="unitData" clearable
                  placeholder="请选择数量单位" style="width:100%" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120" fixed="right">
            <template #default="props">
              <el-form-item label-width="0" v-if="props.$index!==0">
                <el-button size="mini" type="danger" icon="Delete" @click="removeGrnDetail(props.$index)">删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>

        </el-table>
      </el-form-item>

      <el-form-item label-width='0'>
        <el-button type="text" size="medium" icon="CirclePlus" @click="addGrnDetailList()">添加采购产品</el-button>
      </el-form-item>

      <el-row>

        <el-col :span="24">
          <el-form-item label="备注：" prop="remarks">
            <el-input v-model.trim="dialogForm.remarks" type="textarea" :rows="4" show-word-limit maxlength="50"
              clearable placeholder="请输入备注信息">
            </el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <el-divider border-style="dashed"></el-divider>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">关闭</el-button>
        <el-button size="small" :loading="saveLoading" type="primary" @click="handlerSave()">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog fullscreen :title="dialogType==='audit'?'审核采购单':'查看审核单'" v-model="auditVisible">
    <el-form size="small" label-width="120px" class="demo-form-inline" ref="auditFormRef" :model="auditForm">
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="采购单编号：">
            {{dialogForm.code}}
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="申请日期：">
            {{dialogForm.applyDate}}
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="采购日期：">
            {{dialogForm.purchaseDate}}
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="申请人：">
            {{currentEditData.applyUserName}}
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="采购人：">
            {{currentEditData.purchaseUserName}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width='0'>
            <el-table :data="dialogForm.children">
              <el-table-column label="采购产品" prop="categoryName"> </el-table-column>

              <el-table-column label="采购数量" prop="amount">
                <template #default="scope">
                  {{scope.row.amount}} / {{scope.row.unitName}}
                </template>
              </el-table-column>

              <el-table-column label="采购仓库" prop="repoName"></el-table-column>
            </el-table>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注：">
            {{dialogForm.remarks}}
          </el-form-item>
        </el-col>

        <el-divider>
          <h3>{{dialogType==='audit'?'审核':'审核结果'}}</h3>
        </el-divider>

        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="审核：" prop="status">
            <el-radio-group v-model="auditForm.status" v-if="dialogType==='audit'">
              <el-radio-button label="1">通过</el-radio-button>
              <el-radio-button label="2">不通过</el-radio-button>
            </el-radio-group>
            <span v-else>{{currentEditData.statusName}}</span>
          </el-form-item>
        </el-col>
        <template v-if="dialogType==='view'">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="审核人：">
              {{currentEditData.checkUserName}}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="审核日期：">
              {{currentEditData.auditDate}}
            </el-form-item>
          </el-col>
        </template>

        <el-col :span="24">
          <el-form-item label="审核备注：" prop="checkRemarks">
            <el-input v-model.trim="auditForm.checkRemarks" v-if="dialogType==='audit'" type="textarea" :rows="4"
              show-word-limit maxlength="50" clearable placeholder="请输入备注信息">
            </el-input>
            <span v-else>{{currentEditData.checkRemarks}}</span>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="auditVisible = false">关闭</el-button>
        <el-button size="small" :loading="saveLoading" type="primary" v-if="dialogType==='audit'"
          @click="handlerSaveAudit()">保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

  <script>
import { reactive, toRefs, ref, nextTick, toRaw } from 'vue'
import moment from 'moment'
import {
  getPurchaseList, addPurchase, getRepoList, getCategoryTree, getUnitList, updatePurchase, auditPurchase,
  deletePurchase
} from '@/api/common'
import { userList } from '@/api/user'
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from 'element-plus'
import { showMessage, getDataById } from '@/utils'
import _ from 'lodash'

export default {
  name: 'grnManage',
  setup(props, context) {
    const state = reactive({
      tableData: [],
      dialogVisible: false,// 修改、新增产品dialog
      isEdit: false,
      saveLoading: false,
      currentEditData: {},// 当前修改数据
      categoryData: [],// 产品数据
      agentData: [],//用户
      repoData: [],//仓库
      unitData: [],// 数量单位
      loadignData: false,//加载 产品loading
      queryForm: {
        code: '',
        startDate: moment(new Date(+new Date() - 30 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        endDate: '',
        categoryId: '',
        applyId: '',// 申请人
        status: 0
      },
      cascaderOptions: { value: 'id', label: 'name', multiple: true },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loadTable: false,
      statusData: [{
        label: '全部',
        value: ''
      }, {
        label: '待审核',
        value: 0
      }, {
        label: '通过',
        value: 1
      }, {
        label: '未通过',
        value: 2
      }],
      auditVisible: false,// 审核dialog
      dialogType: 'audit',//审核类型（审核、查看）
    })
    const router = useRouter()
    //采购单数据
    const getSupplierFormData = () => ({
      code: 'CG' + moment(new Date()).format('YYYYMMDDHHmmss'),//采购单编号
      purchaseDate: '',//采购日期
      applyDate: '',// 申请时间
      applyId: '',// 申请人id
      purchaseId: '',// 采购人id
      remarks: '', // 备注信息
      status: 0,// 审核状态
      children: [{
        categoryId: '',
        repoId: '',
        unitId: '',
        amount: 1,
      }]
    })
    // 新增、修改form
    let dialogForm = reactive(getSupplierFormData())
    let auditForm = reactive({
      status: 1,// 审核状态
      checkRemarks: '',// 审核备注
    })
    // 新增、修改formRules
    const dialogFormRules = {
      code: [{
        required: true, message: '请输入采购单编号', trigger: 'blur',
      }],
      purchaseDate: [{
        required: true, message: '请选择采购日期', trigger: 'change',
      }],
      applyId: [{
        required: true, message: '请选择申请人', trigger: 'change',
      }],
      purchaseId: [{
        required: true, message: '请选择采购人', trigger: 'change',
      }],
      categoryId: [{
        required: true, message: '请选择采购产品', trigger: 'blur',
      }],
      amount: [{
        required: true, message: '请输入采购数量', trigger: 'blur',
      }, {
        type: 'number',
        min: 1,
        message: '采购数量最小为1',
        trigger: 'blur',
      }],
      unitId: [{
        required: true, message: '请选择数量单位', trigger: 'blur',
      }]
    }
    // 新增、修改dialog ref
    const dialogRef = ref(null)
    const auditFormRef = ref(null)
    const methods = {
      /**
       * 下拉菜单
       * @param {*} type 类型
       */
      handleCommand(type, item) {
        switch (type) {
          case 'edit':
            this.handlerEdit(item);
            break;
          case 'print':
            this.handlerPrint(item);
            break;
          case 'audit':
            this.handlerAudit(item);
            break;
          case 'delete':
            this.handlerDelete(item);
            break;
          default:
            console.info('未知类型');
            break;
        }
      },
      /**
       * 打印
       */
      handlerPrint(item) {
        window.open('#print-purchase?id=' + item.id, '_blank')
      },
      /**
       * 采购日期 大于当前日期
       */
      disabledDate(time) {
        return time.getTime() <= Date.now()
      },
      /**
   * 显示采购明细
   */
      getTblTemplate(tblItems) {
        return tblItems.map(v => v.repoName + ' 采购 <span class="category-name">' + v.categoryName + '</span> ' + v.amount + '/' + v.unitName).join('<br />')

      },

      /**
       * 移除采购明细
       */
      removeGrnDetail(index) {
        dialogForm.children.splice(index, 1)
      },
      /**
       * 新增采购产品明细
       * 添加一个子级明细
       */
      addGrnDetailList() {
        dialogForm.children.push({
          categoryId: '',
          repoId: '',
          unitId: '',
          amount: 1,
        })
      },
      /**
       * 获取列表
       */
      async getTableData() {
        state.loadTable = true
        const params = Object.assign({}, state.queryForm, {
          pageSize: state.pageSize,
          pageNo: state.currentPage
        })

        //是否只看欠款
        params.minDebt = params.minDebts ? 0 : null;


        //产品id如果是数组取最后一位
        Array.isArray(params.categoryId) && (params.categoryId = params.categoryId.map(v => v.at(-1)).join(','))

        console.log(params)
        const res = await getPurchaseList(params)
        res.code === 200 && (state.tableData = res.message.records) && (state.total = res.message.total)
        state.loadTable = false
      },
      /**
       * 进行审核或者查看
       */
      handlerAudit(item, type = 'audit') {
        state.dialogType = type
        item = JSON.parse(JSON.stringify(toRaw(item)));
        state.currentEditData = item
        state.auditVisible = true
        nextTick(() => {
          auditFormRef.value.resetFields()
          this.setDialogFormData(item)
        })
      },
      /**
       * 保存审核
       */
      async handlerSaveAudit() {
        const res = await auditPurchase({
          id: state.currentEditData.id,
          status: auditForm.status,
          checkRemarks: auditForm.checkRemarks,// 审核备注
        })
        if (res.code === 200) {
          state.auditVisible = false
          // 刷新表格
          this.getTableData()
        }
        showMessage(res.code === 200 ? 'success' : 'error', res.message)

      },
      /**
       * 修改
       */
      handlerEdit(item) {
        item = JSON.parse(JSON.stringify(toRaw(item)));
        state.isEdit = true
        state.dialogVisible = true
        state.currentEditData = item
        nextTick(async () => {
          dialogRef.value.resetFields()
          this.setDialogFormData(item)
        })
      },
      setDialogFormData(item) {
        for (const key in dialogForm) {
          if (key === 'children') {
            for (const itemc of item.children) {
              itemc.specieData = []
            }
          }
          dialogForm[key] = item[key]
        }
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
          dialogForm.children = [{
            categoryId: '',
            repoId: '',
            unitId: '',
            amount: 1,
          }]
          dialogForm.code = "CG" + moment(new Date()).format('YYYYMMDDHHmmss')
          dialogForm.purchaseDate = moment(new Date(+new Date() + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss')
          state.currentEditData = item
        })
      },
      /**
       * 删除
       */
      handlerDelete(item) {
        ElMessageBox.confirm('确定要删除吗?', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(async () => {
            done()
            const loading = globalLoading()
            const res = await deletePurchase({
              id: item.id,
              status: state.currentEditData.status
            })
            loading.close()
            showMessage(res.code === 200 ? 'success' : 'error', res.message)
            res.code === 200 && this.getTableData()

          })
          .catch(() => {
            // catch error
          })

      },
      //保存
      handlerSave() {
        dialogRef.value.validate(async (valid) => {
          if (valid) {
            const params = Object.assign({}, dialogForm)

            for (const item of params.children) {
              //单位最后一位
              item.unitId = Array.isArray(item.unitId) ? item.unitId.at(-1) : item.unitId;
              // 入库产品id 
              item.categoryId = Array.isArray(item.categoryId) ? item.categoryId.at(-1) : item.categoryId;
            }
            // 添加操作人姓名
            params.purchaseUserName = state.agentData.find(v => v.id === params.purchaseId).name
            // 申请人
            params.applyUserName = state.agentData.find(v => v.id === params.applyId).name

            // 申请时间(新增时添加)
            !state.isEdit && (params.applyDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))

            // 修改参数添加id
            state.isEdit && (params.id = state.currentEditData.id)

            const responseData = state.isEdit ? await updatePurchase(params) : await addPurchase(params);
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
        done()
      },

      /**
       * 分页记录数改变
       */
      handleSizeChange(value) {
        state.pageSize = value
        this.getTableData()
      },
      /**
       * 分页页数改变
       */
      handleCurrentChange(value) {
        state.currentPage = value
        this.getTableData()
      }
    }



    //查询产品树、用户列表、供应商
    const getUnitAndCategoryData = async () => {
      state.loadignData = true
      const res = await Promise.all([getCategoryTree(), userList(), getRepoList({ name: '' }), getUnitList()]).finally(() => {
        state.loadignData = false
      })

      res[0].code === 200 && (state.categoryData = res[0].message)// 产品
      res[1].code === 200 && (state.agentData = res[1].message.data)// 用户
      res[2].code === 200 && (state.repoData = res[2].message)// 仓库
      res[3].code === 200 && (state.unitData = res[3].message)// 数量单位
      state.loadignData = false
    }
    //查询产品树
    getUnitAndCategoryData()
    //查询表格
    methods.getTableData()

    return {
      ...methods,
      ...toRefs(state), //抛出
      dialogFormRules,
      dialogForm,
      dialogRef,
      auditForm,
      auditFormRef
    }
  },
}
  </script>
  <style lang='scss' scoped>
.grn-detail-list {
  margin: 15px;
  box-sizing: border-box;
  background-color: #ffffff;
  box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.1);

  &-item {
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
.grn-detail-title {
  font-size: 25px;
  color: #409eff;
}

.form-pre-flex {
  display: flex;
  .form-pre-flex-btn {
    margin-left: 5px;
  }
}
</style>