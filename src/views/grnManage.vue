<!--  -->
 <template>
  <el-form :inline="true" :model="queryForm" label-width="100px" size="small" class="demo-form-inline">
    <el-form-item label="入库单号：">
      <el-input v-model="queryForm.code" @keyup.enter.native="getTableData()" clearable placeholder="请输入库单号">
      </el-input>
    </el-form-item>
    <el-form-item label="开始时间：">
      <el-date-picker v-model="queryForm.startDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss" placeholder="录入订单开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间：">
      <el-date-picker v-model="queryForm.endDate" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime" placeholder="录入订单结束时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="商品类型：">
      <el-cascader v-model="queryForm.categoryId" :options="categoryData" placeholder="选择查询商品" :props="cascaderOptions"
        collapse-tags clearable />
    </el-form-item>

    <el-form-item label="供货商：">
      <el-select v-model="queryForm.supplierId" clearable remote filterable :loading="loadignData"
        :remote-method="query=>remoteSupplierData(query,'supplierData','loadignData')" placeholder="选择供货商">
        <el-option v-for="item in supplierData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="操作人：">
      <el-select v-model="queryForm.agentId" clearable filterable placeholder="选择入库单录入人员">
        <el-option v-for="item in agentData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="只看欠款：">
      <el-checkbox v-model="queryForm.minDebts"></el-checkbox>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="getTableData()" icon="Search">查询
      </el-button>
      <el-button icon="Plus" @click="handlerAdd()">新增入库单</el-button>
      <el-button icon="Download" @click="handleExport()">导出</el-button>
    </el-form-item>

    <el-form-item>
      <el-dropdown :hide-on-click="false">
        <el-button type="primary">
          配置显示列
        </el-button>
        <template #dropdown>
          <div class="tableFields-con">
            <el-checkbox-group v-model="showTableFiledsValue">
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in showTableFileds" :key="item.label">
                  <el-checkbox class="tableFields-item" :label="item.label">
                    {{item.value}}
                  </el-checkbox>

                </el-dropdown-item>
              </el-dropdown-menu>
            </el-checkbox-group>
          </div>
        </template>
      </el-dropdown>
    </el-form-item>
  </el-form>
  <el-table :data="tableData" v-loading="loadTable" row-key="id" border :tree-props="{ children: 'childrens' }">
    <el-table-column type="expand">
      <template #default="props">
        <div class="grn-detail-list">
          <el-table :data="props.row.children">
            <el-table-column prop="categoryName" label="产品名称"></el-table-column>
            <!-- <el-table-column prop="specieName" label="批次名称"></el-table-column> -->
            <el-table-column prop="amount" label="入库数量">
              <template #default="propsc">
                {{propsc.row.amount}} / {{propsc.row.unitName}}
              </template>
            </el-table-column>
            <el-table-column prop="price" label="进价">
              <template #default="propsc">
                {{propsc.row.price}} / {{propsc.row.unitName}}
              </template>
            </el-table-column>

            <el-table-column prop="repoName" label="仓库名称"></el-table-column>

          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column type="index" width="50" />
    <el-table-column prop="code" label="入库单号" min-width="200" v-if="showTableFiledsValue.includes('code')" />
    <el-table-column label="入库产品" min-width="320" v-if="showTableFiledsValue.includes('children')">
      <template #default="props">
        <span v-html="getTblTemplate(props.row.children)"></span>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="入库日期" width="160" v-if="showTableFiledsValue.includes('date')" />
    <el-table-column prop="agentName" label="操作人" min-width="120" v-if="showTableFiledsValue.includes('agentName')" />
    <el-table-column prop="supplierName" label="供应商" min-width="120"
      v-if="showTableFiledsValue.includes('supplierName')" />

    <el-table-column prop="totalPrice" label="总价" min-width="100" v-if="showTableFiledsValue.includes('totalPrice')" />
    <el-table-column prop="realCo" label="已付款" min-width="100" v-if="showTableFiledsValue.includes('realCo')" />
    <el-table-column prop="debt" label="待付款" min-width="100" sortable v-if="showTableFiledsValue.includes('debt')" />
    <el-table-column prop="remarks" label="备注" min-width="200" v-if="showTableFiledsValue.includes('remarks')" />
    <el-table-column label="操作" width="200" fixed="right">
      <template #default="scope">
        <el-button size="mini" icon="Edit" @click.prevent="handlerEdit(scope.row)">
          修改
        </el-button>
        <el-popconfirm title="退货！入库存产品将被清空，是否进行操作?" @confirm="handlerDelete(scope.row)" confirm-button-text="确定"
          cancel-button-text="取消">
          <template #reference>
            <el-button size="mini" type="danger" icon="Delete">
              退货
            </el-button>
          </template>
        </el-popconfirm>

      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:currentPage="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="v=>handleSizeChange(v)"
    @current-change="v=>handleCurrentChange(v)">
  </el-pagination>

  <!--  dialog -->
  <el-dialog v-model="dialogVisible" width="800px" fullscreen :title="isEdit?'修改入库单':'新增入库单'"
    :before-close="resetDialogForm">
    <el-form size="small" ref="dialogRef" label-width="120px" :model="dialogForm" :rules="dialogFormRules"
      class="demo-form-inline">

      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="入库单编号：" prop="code">
            <span v-if="isEdit">{{dialogForm.code}}</span>
            <el-input v-else v-model.trim="dialogForm.code" :maxlength="20" @keyup.enter.native="handlerSave()"
              clearable placeholder="请输入入库单编号">
            </el-input>

          </el-form-item>

        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="入库日期：" prop="date">
            <span v-if="isEdit">{{dialogForm.date}}</span>
            <el-date-picker v-else v-model="dialogForm.date" format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="请选择入库日期" style="width:100%">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="操作人：" prop="agentId">
            <el-select v-model="dialogForm.agentId" filterable clearable placeholder="选择入库单录入人员" style="width:100%">
              <el-option v-for="item in agentData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="供应商：" prop="supplierId">
            <el-select v-model="dialogForm.supplierId" clearable remote filterable :loading="loadignData"
              :remote-method="query=>remoteSupplierData(query,'supplierData','loadignData')" placeholder="选择供应商"
              style="width:100%">
              <el-option v-for="item in supplierData" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item label-width='0'>
        <el-divider>
          <div class="grn-detail-divider">
            <span class="grn-detail-title">入库产品明细</span>
            <el-button size="mini" type="primary" icon="Position" @click.prevent="showPurchaseModal()">
              从采购单导入
            </el-button>
          </div>
        </el-divider>
      </el-form-item>
      <el-form-item label-width='0'>
        <el-table :data="dialogForm.children">
          <el-table-column label="入库产品" min-width="220px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.categoryId'"
                :rules="dialogFormRules.categoryId">
                <el-cascader v-model="props.row.categoryId" filterable size="mini" :options="categoryData"
                  placeholder="请选择入库产品" :props="{ value: 'id', label: 'name' }" collapse-tags clearable
                  style="width:100%" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="产品批次" min-width="220px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.specieName'"
                :rules="dialogFormRules.specieName">
                <!-- <el-select v-model="props.row.specieId" filterable :loading="props.row.specieData.length===0"
                  style="width:100%" :disabled="props.row.specieData.length===0" clearable placeholder="请选择产品批次">
                  <el-option v-for="item in props.row.specieData" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select> -->
                <span v-if="isEdit">{{props.row.specieName}}</span>
                <el-input v-else v-model="props.row.specieName" placeholder="请输入产品批次名称" clearable>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="入库仓库" min-width="220px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.repoId'" :rules="dialogFormRules.repoId">
                <el-select v-model="props.row.repoId" filterable clearable placeholder="请选择仓库地址" style="width:100%">
                  <el-option v-for="item in repoData" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="入库数量" min-width="160px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.amount'" :rules="dialogFormRules.amount">
                <el-input-number v-model.number="props.row.amount" @change="getTotalPrice(props.$index)" :min="0"
                  style="width:100%" clearable placeholder="请输入入库数量">
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

          <el-table-column label="单价" min-width="200px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.price'" :rules="dialogFormRules.price">
                <el-input-number v-model.number="props.row.price" :min="0" @change="getTotalPrice(props.$index)"
                  style="width:100%" clearable placeholder="请输入单价">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="成本" min-width="200" fixed="right">
            <template #default="props">
              <!-- <el-form-item label-width="0" :prop="'children.'+props.$index+'.totalPrice'"
                :rules="dialogFormRules.totalPriceC">
                <el-input-number v-model.number="props.row.totalPrice" :precision="2" :min="0" style="width:100%"
                  clearable placeholder="请输入成本">
                </el-input-number>
              </el-form-item> -->
              <el-form-item> {{props.row.totalPrice}}</el-form-item>
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
        <el-button type="text" size="medium" icon="CirclePlus" @click="addGrnDetailList()">添加入库产品</el-button>
      </el-form-item>

      <el-row>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
          <el-form-item label="总成本：" prop="totalPrice">
            <div class="form-pre-flex">
              <!-- <el-input-number v-model="dialogForm.totalPrice" :precision="2" :min="0" clearable placeholder="请输入总价"
                style="width:100%">
              </el-input-number> -->
              {{dialogForm.totalPrice}}
              <!-- <el-button class="form-pre-flex-btn" @click="calculateTotalPrice">计算总价</el-button> -->
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
          <el-form-item label="已付款：" prop="realCo">
            <el-input-number v-model="dialogForm.realCo" :precision="2" :min="0" clearable placeholder="请输入已付款"
              style="width:100%">
            </el-input-number>
          </el-form-item>
        </el-col>

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

  <el-dialog v-model="purchaseVisible" fullscreen title="导入采购单至入库明细（双击表格行即可）">
    <Purchase @selectedPurchase="selectedPurchase" />
  </el-dialog>
</template>

  <script>
import { reactive, toRefs, ref, nextTick, toRaw } from 'vue'
import moment from 'moment'
import {
  getGrnList, updateGrnList, addGrnList, deleteGrnList, getSupplierList, getRepoList, getListByCategoryId, getCategoryTree, getUnitList
  , addSpecieList
} from '@/api/common'
import { userList } from '@/api/user'
import { globalLoading, showMessage, downLoadFile, getDataById } from '@/utils'
import mathJs from '@/utils/math'
//远程搜索供应商，客户
import remoteMix from '@/mixin/remote'
import _ from 'lodash'
// 采购单
import Purchase from '@/components/purchase/index.vue'
export default {
  name: 'grnManage',
  components: {
    Purchase
  },
  setup(props, context) {
    const state = reactive({
      purchaseVisible: false,// 采购单dialog
      tableData: [],
      dialogVisible: false,// 修改、新增产品dialog
      isEdit: false,
      saveLoading: false,
      currentEditData: {},// 当前修改数据
      categoryData: [],// 产品数据
      agentData: [],//用户
      repoData: [],//仓库
      supplierData: [],//供应商
      unitData: [],// 数量单位
      loadignData: false,//加载 产品loading
      queryForm: {
        code: '',
        startDate: moment(new Date(+new Date() - 30 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        endDate: '',
        categoryId: '',
        agentData: '',
        supplierId: '',//供货商
        minDebts: false
      },
      cascaderOptions: { value: 'id', label: 'name', multiple: true },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loadTable: false,
      showTableFileds: [
        { label: "code", value: "入库单号" },
        { label: "children", value: "入库明细" },
        { label: "date", value: "入库日期" },
        { label: "agentName", value: "操作人" },
        { label: "supplierName", value: "供应商" },
        { label: "totalPrice", value: "总价" },
        { label: "realCo", value: "已付款" },
        { label: "debt", value: "待付款" },
        { label: "remarks", value: "备注" },
      ],
      showTableFiledsValue: ["children", "date", "supplierName", "totalPrice", "realCo", "debt", "remarks"]

    })

    const { remoteSupplierData } = remoteMix(state)
    //入库单数据
    const getSupplierFormData = () => ({
      code: '' + moment(new Date()).format('YYYYMMDDHHmmss'),//入库单编号
      date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),//入库日期
      agentId: '',// 操作人id
      supplierId: '',// 供应商id
      totalPrice: 0,// 总价
      realCo: 0, // 已付款
      remarks: '', // 备注信息
      children: [{
        categoryId: '',
        repoId: '',
        specieId: '',
        specieName: "IN" + moment(new Date()).format('YYYYMMDDHHmmss') + "" + 0,
        unitId: '',
        amount: 1,
        totalPrice: 0,//采购成本
        price: 0,//单价
        // specieData: [],// 产品对应的批次数据
      }]
    })
    // 新增、修改form
    let dialogForm = reactive(getSupplierFormData())
    // 新增、修改formRules
    const dialogFormRules = {
      code: [{
        required: true, message: '请输入入库单编号', trigger: 'blur',
      }],
      date: [{
        required: true, message: '请选择入库日期', trigger: 'change',
      }],
      agentId: [{
        required: true, message: '请选择操作人', trigger: 'change',
      }],
      supplierId: [{
        required: true, message: '请选择供应商', trigger: 'change',
      }],
      categoryId: [{
        required: true, message: '请选择入库产品', trigger: 'blur',
      }],
      amount: [{
        required: true, message: '请输入入库数量', trigger: 'blur',
      }, {
        type: 'number',
        min: 1,
        message: '入库数量最小为1',
        trigger: 'blur',
      }],
      unitId: [{
        required: true, message: '请选择数量单位', trigger: 'blur',
      }],
      repoId: [{
        required: true, message: '请选择仓库', trigger: 'blur',
      }],
      specieId: [{
        required: true, message: '请输入批次名称', trigger: 'blur',
      }],
      categoryId: [{
        required: true, message: '请选择入库产品', trigger: 'blur',
      }],
      specieName: [{
        required: true, message: '请输入批次名称', trigger: 'blur',
      }],
      totalPriceC: [{
        required: true, message: '请输入入库成本', trigger: 'blur',
      }, {
        type: 'number',
        min: 0,
        message: '入库成本不能小于0',
        trigger: 'blur',
      }]
    }
    // 新增、修改dialog ref
    const dialogRef = ref(null)
    const methods = {
      /**
       * 选择的采购单
       */
      async selectedPurchase(purchaseData) {
        state.purchaseVisible = false
        showMessage('success', '导入成功')
        // 将采购的产品合并到明细
        dialogForm.children = []
        let index = 0;
        for (const item of purchaseData.children) {
          dialogForm.children.push({
            categoryId: item.categoryId,
            repoId: item.repoId,
            specieId: '',
            specieName: "IN" + moment(new Date()).format('YYYYMMDDHHmmss') + "" + index,
            unitId: item.unitId,
            amount: item.amount,
            totalPrice: 0,//采购成本
            price: 0,//单价
          })
          index++
        }

      },
      // 通过采购单导入产品
      showPurchaseModal() {
        state.purchaseVisible = true
      },
      /**
       * 显示入库明细
       */
      getTblTemplate(tblItems) {
        return tblItems.map(v => v.repoName + ' 入库 <span class="category-name">' + v.categoryName + '</span> ' + v.amount + '/' + v.unitName + '【进价：' + v.price + ' / ' + v.unitName + '】').join('<br />')

      },
      getTotalPrice(index) {
        const curGrnDetail = dialogForm.children[index]
        dialogForm.children[index].totalPrice = mathJs.multiply(curGrnDetail.amount, curGrnDetail.price)
        this.calculateTotalPrice()
      },
      /**
       * 计算总价格
       */
      calculateTotalPrice() {
        const totalPrice = dialogForm.children.reduce((total, c) => total += c.totalPrice, 0)
        // 总价格
        dialogForm.totalPrice = totalPrice
        // 已付款
        dialogForm.realCo = totalPrice
      },
      /**
       * 导出
       */
      handleExport() {
        const params = []
        for (const key in state.queryForm) {
          params.push(key + "=" + state.queryForm[key])
        }
        const url = process.env.VUE_APP_URL_API + "/grn/exportGrnList?" + params.join("&")
        downLoadFile(url)
      },
      /**
       * 移除入库明细
       */
      removeGrnDetail(index) {
        dialogForm.children.splice(index, 1)
      },
      /**
       * 入库产品明细 入库产品change事件
       * 获取产品批次数
       */
      async getGrnDetailSpecie(value, index) {
        //之前选择批次清除
        dialogForm.children[index].specieId = '';
        dialogForm.children[index].specieData = []
        const res = await getListByCategoryId({ categoryIds: value.at(-1) })
        res.code === 200 && (dialogForm.children[index].specieData = res.message)
        //默认选中第一个
        res.code === 200 && res.message.length > 0 && (dialogForm.children[index].specieId = res.message[0].id)
      },
      /**
       * 新增入库产品明细
       * 添加一个子级明细
       */
      addGrnDetailList() {
        dialogForm.children.push({
          categoryId: '',
          repoId: '',
          specieId: '',
          specieName: "IN" + moment(new Date()).format('YYYYMMDDHHmmss') + "" + 0,
          unitId: '',
          amount: 1,
          totalPrice: 0,//采购成本
          price: 0,//单价
          specieData: [],// 产品对应的批次数据
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
        const res = await getGrnList(params)
        res.code === 200 && (state.tableData = res.message.records) && (state.total = res.message.total)
        state.loadTable = false
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
          for (const key in dialogForm) {
            if (key === 'children') {
              for (const itemc of item.children) {
                itemc.specieData = []
              }
            }
            dialogForm[key] = item[key]
          }
          //自己加载对应的批次
          for (const c of dialogForm.children) {
            const res = await getListByCategoryId({ categoryIds: c.categoryId })
            res.code === 200 && (c.specieData = res.message)
          }
          console.log(dialogForm)
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
          dialogForm.children = [{
            categoryId: '',
            repoId: '',
            specieId: '',
            specieName: "IN" + moment(new Date()).format('YYYYMMDDHHmmss') + "" + 0,
            unitId: '',
            amount: 1,
            totalPrice: 0,//采购成本
            price: 0,//单价
            // specieData: [],// 产品对应的批次数据
          }]
          dialogForm.code = moment(new Date()).format('YYYYMMDDHHmmss')
          dialogForm.date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          state.currentEditData = item
        })
      },
      /**
       * 删除
       */
      async handlerDelete(item) {
        const loading = globalLoading()
        const updateGrn = _.cloneDeep(item); //JSON.parse(JSON.stringify(toRaw(item)))
        //将库存清零
        for (const itemc of updateGrn.children) {
          itemc.amount = 0
        }
        // 状态置为编辑--目的为添加批次id
        state.isEdit = true

        //组装批次
        const specieList = getGrnSpecieData(updateGrn.children)
        state.isEdit = false
        const prams = {
          grnData: updateGrn,
          grnId: item.id,
          grnDetailIds: item.children.map(v => v.id),
          specieList
        }
        const resDel = await deleteGrnList(prams).finally(() => {
          loading.close()
        })

        showMessage(resDel.code === 200 ? 'success' : 'error', resDel.message)
        resDel.code === 200 && this.getTableData()
      },
      //保存
      handlerSave() {
        dialogRef.value.validate(async (valid) => {
          if (valid) {
            //新增批次
            const specieList = getGrnSpecieData()
            // const res = await addSpecieList(specieList);
            // if (res.code !== 200) {
            //   showMessage('error', res.message)
            //   return
            // }
            //入库产品明细修改单位id ，产品id
            await setGrnDetailTotalPrice()
            const params = Object.assign({}, dialogForm)
            //添加操作人姓名
            params.agentName = state.agentData.find(v => v.id === params.agentId).name
            //供应商
            params.supplierName = state.supplierData.find(v => v.id === params.supplierId).name
            //欠款
            params.debt = mathJs.subtract(params.totalPrice, params.realCo)
            //修改参数添加id
            state.isEdit && (params.id = state.currentEditData.id)
            //删除批次数据
            params.children.forEach(v => {
              delete v.specieData
            })
            // state.saveLoading = true

            // 添加批次
            const grnInParams = {
              grnData: params,
              specieList
            }
            const responseData = state.isEdit ? await updateGrnList(grnInParams) : await addGrnList(grnInParams);
            state.saveLoading = false
            // 刷新表格
            responseData.code === 200 && this.getTableData()
            //显示提示信息
            showMessage(responseData.code === 200 ? 'success' : 'error', responseData.message || responseData.message.message)
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

    /**
     * 获取入库产品批次
     */
    const getGrnSpecieData = (grnDetailData) => {
      if (!grnDetailData) grnDetailData = dialogForm.children;
      return grnDetailData.map(v => {
        const unitId = Array.isArray(v.unitId) ? v.unitId.at(-1) : v.unitId;
        // 数量单位名称
        let unitNameData = getDataById(state.unitData, unitId)

        unitNameData.find(unitv => unitv.id === unitId)// state.unitData.flat(Infinity).find(unitv => unitv.id === unitId)
        const unitName = unitNameData?.[0]?.name ?? '';
        // 入库产品id 
        const categoryId = Array.isArray(v.categoryId) ? v.categoryId.at(-1) : v.categoryId;
        let editParas = {}
        //修改状态下 添加批次id
        if (state.isEdit) {
          editParas.id = v.specieId;
        }
        return {
          name: v.specieName,
          categoryId,
          unitId,
          unitName,
          cost: v.price,// mathJs.divide(v.totalPrice, v.amount),//成本 = 总成 / 数量
          selling: 0,
          ...editParas
        }
      })
    }

    /**
     * 入库产品添加总价
     */
    const setGrnDetailTotalPrice = () => {
      return new Promise((resolve, reject) => {
        let index = 1;
        for (const item of dialogForm.children) {
          // 选择批次id
          // const curSpecieId = item.specieId;
          // const selSpecieData = item.specieData.find(v => v.id === curSpecieId)
          // if (!selSpecieData) {
          //   showMessage('error', `入库库产品第${index}项。批次不存在！`)
          //   reject("批次不存在")
          //   break
          // }
          // // 选择批次价格
          // const speciCost = selSpecieData.cost;
          // // 选择批次数量单位 
          // const specieUnitId = selSpecieData.unitId
          // //比较选择的批次计量单位与 选择的数量单位是否一致
          // const unit1Id = Array.isArray(item.unitId) ? item.unitId.at(-1) : item.unitId;

          // const { equal, totalPrice } = equalUnitRoot(state.unitData, unit1Id, specieUnitId, speciCost, item.amount)
          // if (!equal) {
          //   showMessage('error', `入库产品第${index}项。批次数量单位与入库数量单位不一致！`)
          //   reject("批次数量单位与入库数量单位不一致，无法转换 不可入库")
          //   break
          // }
          //计算总价（总成本改为计算）
          // item.totalPrice = totalPrice
          //单位最后一位
          item.unitId = Array.isArray(item.unitId) ? item.unitId.at(-1) : item.unitId;
          // 入库产品id 
          item.categoryId = Array.isArray(item.categoryId) ? item.categoryId.at(-1) : item.categoryId;
          index++;
        }
        resolve()
      })
    }

    //查询产品树、用户列表、供应商
    const getUnitAndCategoryData = async () => {
      state.loadignData = true
      const res = await Promise.all([getCategoryTree(), userList(), getSupplierList({ pageSize: 20, pageNo: 1 }), getRepoList({ name: '' }), getUnitList()]).finally(() => {
        state.loadignData = false
      })

      res[0].code === 200 && (state.categoryData = res[0].message)// 产品
      res[1].code === 200 && (state.agentData = res[1].message.data)// 用户
      res[2].code === 200 && (state.supplierData = res[2].message.records)// 供应商
      res[3].code === 200 && (state.repoData = res[3].message)// 仓库
      res[4].code === 200 && (state.unitData = res[4].message)// 数量单位
      state.loadignData = false
    }
    //查询产品树
    getUnitAndCategoryData()
    //查询批次列表
    methods.getTableData()

    return {
      ...methods,
      ...toRefs(state), //抛出
      dialogFormRules,
      dialogForm,
      dialogRef,
      remoteSupplierData
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
.grn-detail-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  .grn-detail-title {
    display: inline-block;
    margin-right: 15px;
    font-size: 25px;
    color: #409eff;
  }
}

.form-pre-flex {
  display: flex;
  .form-pre-flex-btn {
    margin-left: 5px;
  }
}
</style>