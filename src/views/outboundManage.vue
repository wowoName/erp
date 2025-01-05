<!--  -->
<template>
  <el-form :inline="true" :model="queryForm" label-width="100px" size="small" class="demo-form-inline">
    <el-form-item label="出库单号：">
      <el-input
        v-model="queryForm.code"
        @keyup.enter.native="getTableData()"
        clearable
        placeholder="请输入出库单号"
      ></el-input>
    </el-form-item>
    <el-form-item label="开始时间：" prop="startDate">
      <el-date-picker
        v-model="queryForm.startDate"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="出库开始时间"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间：" prop="endDate">
      <el-date-picker
        v-model="queryForm.endDate"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime"
        placeholder="出库结束时间"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="商品类型：" prop="categoryId">
      <el-cascader
        v-model="queryForm.categoryId"
        :options="categoryData"
        placeholder="选择查询商品"
        :props="cascaderOptions"
        collapse-tags
        clearable
      />
    </el-form-item>

    <el-form-item label="客户：" prop="supplierId">
      <el-select
        v-model="queryForm.customerId"
        remote
        filterable
        :loading="loadignData"
        :remote-method="query => remoteCustomeData(query, 'customerData', 'loadignData')"
        clearable
        placeholder="选择客户"
      >
        <el-option v-for="item in customerData" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="操作人：" prop="agentId">
      <el-select v-model="queryForm.agentId" filterable clearable placeholder="选择出库单录入人员">
        <el-option v-for="item in agentData" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="查看未结账：" prop="minDebts">
      <el-checkbox v-model="queryForm.minDebts"></el-checkbox>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="getTableData()" icon="Search">查询</el-button>
      <el-button icon="Plus" @click="handlerAdd()">新增出库单</el-button>
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
                    {{ item.value }}
                  </el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-checkbox-group>
          </div>
        </template>
      </el-dropdown>
    </el-form-item>
  </el-form>
  <el-table
    :data="tableData"
    v-loading="loadTable"
    v-tableHeight
    row-key="id"
    :tree-props="{ children: 'childrens' }"
    border
  >
    <el-table-column type="expand">
      <template #default="props">
        <div class="grn-detail-list">
          <el-table :data="props.row.children">
            <el-table-column prop="categoryName" label="产品名称"></el-table-column>
            <el-table-column prop="amount" label="出库数量">
              <template #default="propsc">{{ propsc.row.amount }} / {{ propsc.row.unitName }}</template>
            </el-table-column>

            <el-table-column prop="amount" label="进价">
              <template #default="propsc">{{ propsc.row.specieCost }} / {{ propsc.row.costUnitName }}</template>
            </el-table-column>

            <el-table-column prop="amount" label="售价">
              <template #default="propsc">{{ propsc.row.price }} / {{ propsc.row.unitName }}</template>
            </el-table-column>

            <el-table-column prop="totalPrice" label="总价"></el-table-column>
            <el-table-column prop="fees" label="其他费用"></el-table-column>
            <el-table-column prop="profits" label="利润"></el-table-column>

            <el-table-column prop="repoName" label="出库仓库"></el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column type="index" width="50" />
    <el-table-column prop="code" label="出库单号" min-width="150" v-if="showTableFiledsValue.includes('code')" />
    <el-table-column label="出库产品" min-width="400" v-if="showTableFiledsValue.includes('children')">
      <template #default="props">
        <div v-html="getTblTemplate(props.row.children)"></div>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="出库日期" width="160" v-if="showTableFiledsValue.includes('date')" />
    <el-table-column
      prop="agentName"
      label="操作人"
      min-width="120"
      v-if="showTableFiledsValue.includes('agentName')"
    />
    <el-table-column
      prop="customerName"
      label="客户姓名"
      min-width="120"
      v-if="showTableFiledsValue.includes('customerName')"
    />

    <el-table-column prop="remarks" label="备注" min-width="200" v-if="showTableFiledsValue.includes('remarks')" />
    <el-table-column
      prop="distribution"
      label="是否配送"
      min-width="200"
      v-if="showTableFiledsValue.includes('distribution')"
    >
      <template #default="scope">
        <el-tooltip placement="top" v-if="scope.row.distribution === '0'">
          <template #content>
            联系人{{ scope.row.distributionName }}
            <br />
            联系方式：{{ scope.row.distributionPhone }}
            <br />
            配送地址：{{ scope.row.distributionAddress }}
            <br />
            备注信息：{{ scope.row.distributionRemarks }}
            <br />
          </template>
          <span>
            配送详情
            <el-icon style="vertical-align: middle;">
              <info-filled color="#7ca0d5" />
            </el-icon>
          </span>
        </el-tooltip>
        <span v-else>否</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="totalPrice"
      label="总价"
      min-width="100"
      v-if="showTableFiledsValue.includes('totalPrice')"
    />
    <el-table-column prop="realCo" label="已付款" min-width="100" v-if="showTableFiledsValue.includes('realCo')" />
    <el-table-column prop="debt" label="待付款" min-width="100" sortable v-if="showTableFiledsValue.includes('debt')" />
    <el-table-column prop="fees" label="其他费用" min-width="100" v-if="showTableFiledsValue.includes('fees')" />
    <el-table-column
      prop="profits"
      label="利润"
      min-width="100"
      sortable
      v-if="showTableFiledsValue.includes('profits')"
    />
    <el-table-column label="操作" width="200" fixed="right">
      <template #default="scope">
        <el-button size="mini" icon="Edit" @click.prevent="handlerEdit(scope.row)">
          修改
        </el-button>
        <!-- <el-popconfirm title="确定要删除吗?" @confirm="handlerDelete(scope.row)" confirm-button-text="确定"
          cancel-button-text="取消">
          <template #reference>
            <el-button size="mini" type="danger" icon="Delete">
              删除
            </el-button>
          </template>
        </el-popconfirm> -->
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:currentPage="currentPage"
    :page-sizes="[10, 20, 30, 50]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="v => handleSizeChange(v)"
    @current-change="v => handleCurrentChange(v)"
  ></el-pagination>

  <!--  dialog -->
  <el-dialog
    v-model="dialogVisible"
    width="800px"
    fullscreen
    :title="isEdit ? '修改出库单' : '新增出库单'"
    :before-close="resetDialogForm"
  >
    <el-form
      size="small"
      ref="dialogRef"
      label-width="120px"
      :model="dialogForm"
      :rules="dialogFormRules"
      class="demo-form-inline"
    >
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="出库单编号：" prop="code">
            <span v-if="isEdit">{{ dialogForm.code }}</span>
            <el-input
              v-else
              v-model.trim="dialogForm.code"
              :maxlength="20"
              @keyup.enter.native="handlerSava()"
              clearable
              placeholder="请输入出库单编号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="出库日期：" prop="date">
            <span v-if="isEdit">{{ dialogForm.date }}</span>
            <el-date-picker
              v-else
              v-model="dialogForm.date"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              placeholder="请选择出库日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="操作人：" prop="agentId">
            <el-select
              v-model="dialogForm.agentId"
              filterable
              clearable
              placeholder="选择出库单录入人员"
              style="width:100%"
            >
              <el-option v-for="item in agentData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="客户：" prop="customerId">
            <el-select
              v-model="dialogForm.customerId"
              clearable
              filterable
              :loading="loadignData"
              :remote-method="query => remoteCustomeData(query, 'customerData', 'loadignData')"
              @change="setDistributionName"
              placeholder="请选择选择客户"
              style="width:100%"
            >
              <el-option v-for="item in customerData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-divider>
          <span class="grn-detail-title">出库产品明细</span>
          <el-button size="mini" type="primary" icon="Position" @click.prevent="showPurchaseModal()">
            从出库申请单导入
          </el-button>
        </el-divider>
      </el-form-item>
      <el-form-item label-width="0">
        <el-table :data="dialogForm.children">
          <el-table-column label="出库产品" min-width="220px">
            <template #default="props">
              <el-form-item
                label-width="0"
                :prop="'children.' + props.$index + '.categoryId'"
                :rules="dialogFormRules.categoryId"
              >
                <el-cascader
                  v-model="props.row.categoryId"
                  filterable
                  @change="v => getGrnDetailSpecie(v, props.$index)"
                  size="mini"
                  :options="categoryData"
                  placeholder="请选择出库产品"
                  :props="{ value: 'id', label: 'name' }"
                  collapse-tags
                  clearable
                  style="width:100%"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="产品批次" min-width="220px">
            <template #default="props">
              <el-form-item
                label-width="0"
                :prop="'children.' + props.$index + '.specieId'"
                :rules="dialogFormRules.specieId"
              >
                <!-- getCategoryStock -->
                <el-select
                  v-model="props.row.specieId"
                  filterable
                  clearable
                  :disabled="props.row.specieData.length == 0"
                  @change="specieChanged(props.$index)"
                  placeholder="请选择产品批次"
                >
                  <el-option
                    v-for="item in props.row.specieData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="出库仓库" min-width="220px">
            <template #default="props">
              <el-form-item
                label-width="0"
                :prop="'children.' + props.$index + '.repoId'"
                :rules="dialogFormRules.repoId"
              >
                <el-select
                  v-model="props.row.repoId"
                  @change="getCategoryStock(props.$index)"
                  filterable
                  clearable
                  placeholder="请选择仓库地址"
                  style="width:100%"
                >
                  <el-option v-for="item in repoData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="库存量" min-width="220px">
            <template #default="props">
              <el-form-item label-width="0">
                <el-icon class="is-loading" v-if="props.row.stockLoading">
                  <loading />
                </el-icon>
                <span v-else>{{ props.row.stock }}{{ props.row.stockUnitName }}</span>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="出库数量" min-width="200px">
            <template #default="props">
              <el-form-item
                label-width="0"
                :prop="'children.' + props.$index + '.amount'"
                :rules="dialogFormRules.amount"
              >
                <el-input-number
                  v-model.number="props.row.amount"
                  @change="getTotalPrice(props.$index)"
                  :min="0"
                  style="width:100%"
                  clearable
                  placeholder="请输入出库数量"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="数量单位" min-width="200px">
            <template #default="props">
              <el-form-item
                label-width="0"
                :prop="'children.' + props.$index + '.unitId'"
                :rules="dialogFormRules.unitId"
              >
                <el-cascader
                  v-model="props.row.unitId"
                  filterable
                  @change="caculateOutboundTotalprofits(props.$index)"
                  :props="{ value: 'id', label: 'name', checkStrictly: true }"
                  :options="unitData"
                  clearable
                  placeholder="请选择数量单位"
                  style="width:100%"
                />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="单价" min-width="200px" fixed="right">
            <template #default="props">
              <el-form-item
                label-width="0"
                :prop="'children.' + props.$index + '.price'"
                :rules="dialogFormRules.price"
              >
                <el-input-number
                  v-model.number="props.row.price"
                  @change="getTotalPrice(props.$index)"
                  :min="0"
                  style="width:100%"
                  clearable
                  placeholder="请输入单价"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="产品进价" min-width="220px" fixed="right">
            <template #default="props">
              <el-form-item label-width="0">
                <el-icon class="is-loading" v-if="props.row.grnPriceLoading">
                  <loading />
                </el-icon>
                <span v-else>{{ props.row.grnPrice }}</span>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="总价格" prop="cost" min-width="100px" fixed="right">
            <template #default="props">
              <el-form-item label-width="0">
                {{ props.row.totalPrice }}
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="利润" prop="cost" min-width="100px" fixed="right">
            <template #default="props">
              <el-form-item label-width="0">
                {{ props.row.profits }}
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120" fixed="right" v-if="!isEdit">
            <template #default="props">
              <el-form-item label-width="0" v-if="props.$index !== 0">
                <el-button size="mini" type="danger" icon="Delete" @click="removeGrnDetail(props.$index)">
                  删除
                </el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label-width="0" v-if="!isEdit">
        <el-button type="text" size="medium" icon="CirclePlus" @click="addGrnDetailList()">添加出库产品</el-button>
      </el-form-item>
      <el-divider border-style="dashed"></el-divider>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-form-item label="其他费用：" prop="fees">
            <el-input-number
              v-model="dialogForm.fees"
              @change="setTotalPrice()"
              :precision="2"
              :min="0"
              clearable
              placeholder="请输入其他费用"
              style="width:100%"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-form-item label="总利润：">
            {{ toatlProfits }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-form-item label="总价：" prop="totalPrice">
            <el-input-number
              v-model="dialogForm.totalPrice"
              :precision="2"
              clearable
              placeholder="请输入总价"
              style="width:100%"
            ></el-input-number>
            <el-tooltip class="item" effect="dark" content="商品总价格" placement="top-start">
              <span style="cursor:pointer">
                商品总价格：{{ totalPriceOutbound }}
                <el-icon color="#7ca0d5">
                  <info-filled />
                </el-icon>
              </span>
            </el-tooltip>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-form-item label="已付款：" prop="realCo">
            <el-input-number
              v-model="dialogForm.realCo"
              :precision="2"
              clearable
              placeholder="请输入已付款"
              style="width:100%"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注：" prop="remarks">
            <el-input
              v-model.trim="dialogForm.remarks"
              type="textarea"
              :rows="4"
              show-word-limit
              maxlength="50"
              clearable
              placeholder="请输入备注信息"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider border-style="dashed"></el-divider>

      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="是否需要配送：" prop="distribution">
            <el-radio-group v-model="dialogForm.distribution" size="medium" @change="resetDistribution">
              <el-radio-button label="1">否</el-radio-button>
              <el-radio-button label="0">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <template v-if="dialogForm.distribution === '0'">
          <el-col :span="24">
            <el-row>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="联系人：" prop="distributionPhone">
                  <el-input
                    v-model="dialogForm.distributionName"
                    :maxlength="11"
                    clearable
                    placeholder="请输入联系人"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="联系电话：" prop="distributionPhone">
                  <el-input
                    v-model="dialogForm.distributionPhone"
                    :maxlength="11"
                    clearable
                    placeholder="请输入手机号"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="收货地址：" prop="distributionAddress">
                  <el-input
                    v-model.trim="dialogForm.distributionAddress"
                    type="textarea"
                    :rows="2"
                    show-word-limit
                    maxlength="50"
                    clearable
                    placeholder="请输入收货地址"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="备注信息：" prop="distributionRemarks">
                  <el-input
                    v-model.trim="dialogForm.distributionRemarks"
                    type="textarea"
                    :rows="2"
                    show-word-limit
                    maxlength="50"
                    clearable
                    placeholder="请输入备注信息"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">关闭</el-button>
        <el-button size="small" :loading="saveLoading" type="primary" @click="handlerSava()">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="exportVisible" fullscreen title="导入出库申请单至出库明细（双击表格行即可）">
    <DeliveryNotice @selectedPurchase="item => selectedPurchase(item)" />
  </el-dialog>
</template>

<script>
import { reactive, toRefs, ref, nextTick, toRaw } from 'vue'
import moment from 'moment'
import {
  getOutboundList,
  updateOutbound,
  addOutbound,
  deleteGrnList,
  customerList,
  getRepoList,
  getListByCategoryId,
  getCategoryTree,
  getUnitList,
  getInventoryAllList
} from '@/api/common'
import { userList } from '@/api/user'
import {
  globalLoading,
  showMessage,
  equalUnitRoot,
  downLoadFile,
  convertedQuantityUnit,
  getTreeDataById
} from '@/utils'
import mathJs from '@/utils/math'
import _ from 'lodash'
import remoteMix from '@/mixin/remote'
// 出库申请单
import DeliveryNotice from '@/components/deliveryNotice/index.vue'
export default {
  name: 'outboundManage',
  components: {
    DeliveryNotice
  },
  setup(props, context) {
    const outbList = {
      categoryId: '',
      repoId: '',
      specieId: '',
      unitId: '',
      amount: 1,
      specieData: [],
      totalPrice: 0, //总售价
      profits: 0, // 利润
      stock: '', //库存量
      price: 0, //单价
      grnPrice: '', //进价
      stockLoading: false, //计算总价格loading
      grnPriceLoading: false,
      profitsLoading: false // 利润loading
    }
    const state = reactive({
      tableData: [],
      dialogVisible: false, // 修改、新增产品dialog
      isEdit: false,
      saveLoading: false,
      currentEditData: {}, // 当前修改数据
      categoryData: [], // 产品数据
      agentData: [], //用户
      repoData: [], //仓库
      customerData: [], // 客户
      unitData: [], // 数量单位
      loadignData: false, //加载 产品loading
      queryForm: {
        code: '',
        startDate: moment(new Date(+new Date() - 30 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        endDate: '',
        categoryId: '',
        agentData: '',
        customerId: '', // 客户
        minDebts: false
      },
      cascaderOptions: { value: 'id', label: 'name', multiple: true },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loadTable: false,
      totalPriceOutbound: 0, //计算出的出库商品总加个
      toatlProfits: 0, //总利润
      showTableFileds: [
        { label: 'code', value: '出库单号' },
        { label: 'children', value: '出库明细' },
        { label: 'date', value: '出库日期' },
        { label: 'agentName', value: '操作人' },
        { label: 'customerName', value: '客户姓名' },
        { label: 'remarks', value: '备注' },
        { label: 'distribution', value: '是否配送' },
        { label: 'totalPrice', value: '总价' },
        { label: 'realCo', value: '已付款' },
        { label: 'debt', value: '待付款' },
        { label: 'fees', value: '其他费用' },
        { label: 'profits', value: '利润' }
      ],
      showTableFiledsValue: ['children', 'date', 'customerName', 'totalPrice', 'realCo', 'debt', 'fees', 'profits'],
      exportVisible: false
    })

    const { remoteCustomeData } = remoteMix(state)

    /**
     * 出库产品参数
     */
    function getOutboundChildrenList() {
      return _.cloneDeep(outbList)
    }
    // 新增、修改form
    let dialogForm = reactive({
      code: 'OUT' + moment(new Date()).format('YYYYMMDDHHmmss'), //出库单编号
      date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), //出库日期
      agentId: '', // 操作人id
      customerId: '', //  客户
      totalPrice: 0, // 总价
      realCo: 0, // 已付款
      fees: 0, //其他费用
      remarks: '', // 备注信息
      distribution: '1', //是否需要配送
      distributionPhone: '', //配送联系电话
      distributionAddress: '', //收货地址
      distributionRemarks: '', //配送备注
      distributionName: '', //配送联系人
      children: [getOutboundChildrenList()]
    })

    // 新增、修改formRules
    const dialogFormRules = {
      code: [
        {
          required: true,
          message: '请输入出库单编号',
          trigger: 'blur'
        }
      ],
      date: [
        {
          required: true,
          message: '请选择出库日期',
          trigger: 'change'
        }
      ],
      agentId: [
        {
          required: true,
          message: '请选择操作人',
          trigger: 'change'
        }
      ],
      customerId: [
        {
          required: true,
          message: '请选择客户',
          trigger: 'change'
        }
      ],
      categoryId: [
        {
          required: true,
          message: '请选择出库产品',
          trigger: 'blur'
        }
      ],
      amount: [
        {
          required: true,
          message: '请输入出库数量',
          trigger: 'blur'
        },
        {
          type: 'number',
          min: 1,
          message: '出库数量最小为1',
          trigger: 'blur'
        }
      ],
      unitId: [
        {
          required: true,
          message: '请选择数量单位',
          trigger: 'blur'
        }
      ],
      repoId: [
        {
          required: true,
          message: '请选择仓库',
          trigger: 'blur'
        }
      ],
      specieId: [
        {
          required: true,
          message: '请选择批次',
          trigger: 'blur'
        }
      ],
      categoryId: [
        {
          required: true,
          message: '请选择出库产品',
          trigger: 'blur'
        }
      ],
      price: [
        {
          required: true,
          message: '请输入单价',
          trigger: 'blur'
        },
        {
          type: 'number',
          min: 0,
          message: '单价最小为0',
          trigger: 'blur'
        }
      ]
    }
    // 新增、修改dialog ref
    const dialogRef = ref(null)
    /**
     * 出库产品 计算利润  切换展示 产品id 、 单位id
     */
    function setGrnDetailTotalPrice() {
      return new Promise((resolve, reject) => {
        let index = 1
        // 均摊其他费用
        const fees = mathJs.divide(dialogForm.fees, dialogForm.children.length)
        for (const item of dialogForm.children) {
          //利润置位0
          // item.profits = 0
          if (item.unitId === '' || item.specieId === '') {
            reject()
            break
          }
          // 选择批次id
          const curSpecieId = item.specieId
          const selSpecieData = item.specieData.find(v => v.id === curSpecieId)
          if (!selSpecieData) {
            showMessage('error', `出库库产品第${index}项。批次不存在！`)
            reject('批次不存在')
            break
          }
          // 选择批次成本价格
          const speciCost = selSpecieData.cost
          // 选择批次数量单位
          const specieUnitId = selSpecieData.unitId
          //比较选择的批次计量单位与 选择的数量单位是否一致
          const unit1Id = Array.isArray(item.unitId) ? item.unitId.at(-1) : item.unitId
          //  equal：单位是否一致 ；totalPrie：成本价格
          const { equal, totalPrice } = equalUnitRoot(state.unitData, unit1Id, specieUnitId, speciCost, item.amount)
          if (!equal) {
            showMessage('error', `出库库产品第${index}项。批次数量单位与出库数量单位不一致！`)
            reject('批次数量单位与出库数量单位不一致，无法转换 不可出库')
            break
          }
          // 计算利润 = 总价格 - 成本
          item.profits = item.totalPrice - totalPrice

          //单位最后一位
          item.unitId = unit1Id //Array.isArray(item.unitId) ? item.unitId.at(-1) : item.unitId;
          // 出库产品id
          item.categoryId = Array.isArray(item.categoryId) ? item.categoryId.at(-1) : item.categoryId
          // 均摊其他费用
          item.fees = fees

          index++
        }
        resolve()
      })
    }
    // // 监听出库产品 计算利润总额
    // watch(
    //   () => [...dialogForm.children],
    //   (value) => {
    //     console.log("变化 watch", JSON.stringify(value))
    //     caculateOutboundTotalprofits(false)
    //   },
    //   {
    //     deep: true
    //   })

    const methods = {
      /**
       * 选择的采购单
       */
      async selectedPurchase(selRow) {
        state.exportVisible = false
        showMessage('success', '导入成功')
        // 将采购的产品合并到明细
        dialogForm.children = []
        let index = 0
        for (const item of selRow.children) {
          dialogForm.children.push({
            categoryId: item.categoryId,
            repoId: item.repoId,
            specieId: item.specieId,
            unitId: item.unitId,
            amount: item.amount,
            specieData: [],
            totalPrice: mathJs.multiply(item.amount, item.price), //总售价
            profits: 0, // 利润
            stock: '', //库存量
            price: item.price, //单价
            grnPrice: '', //进价
            stockLoading: false, //计算总价格loading
            grnPriceLoading: false,
            profitsLoading: false // 利润loading
          })
          // 加载批次--计算利润等
          this.getGrnDetailSpecie(dialogForm.children[index].categoryId, index, false)
          index++
        }

        // 计算总价格
        //计算出的总价格
        let totalPriceOutbound = dialogForm.children.reduce(
          (total, cur) => (total = mathJs.add(cur.totalPrice, total)),
          0
        )
        // 出库产品总价
        state.totalPriceOutbound = totalPriceOutbound
        //  利润 - 其他费用
        const toatlProfits = mathJs.subtract(totalPriceOutbound, dialogForm.fees)
        state.toatlProfits = toatlProfits
        // 总价格 = 各个产品价格 - 费用
        dialogForm.totalPrice = mathJs.subtract(totalPriceOutbound, dialogForm.fees)
      },
      // 通过出库t申请单导入产品
      showPurchaseModal() {
        state.exportVisible = true
      },
      /**
       * 显示出库明细
       */
      getTblTemplate(tblItems) {
        return tblItems
          .map(
            v =>
              v.repoName +
              ' 出库 <span class="category-name">' +
              v.categoryName +
              '</span> ' +
              v.amount +
              '/' +
              v.unitName +
              '【进价：' +
              v.specieCost +
              '/' +
              v.costUnitName +
              ' 售价：' +
              v.price +
              '/' +
              v.unitName +
              '】'
          )
          .join('<br />')
      },
      /**
       * 计算利润
       */
      caculateOutboundTotalprofits(index) {
        const item = dialogForm.children[index]
        item.profits = ''
        item.profitsLoading = true
        //利润置位0
        dialogForm.children[index].profits = 0
        if (item.unitId === '' || item.specieId === '' || item.specieData.length === 0) {
          item.profitsLoading = false
          return
        }
        // 选择批次id
        const curSpecieId = item.specieId
        const selSpecieData = item.specieData.find(v => v.id === curSpecieId)
        if (!selSpecieData) {
          showMessage('error', `出库产品批次不存`)
          item.profitsLoading = false
          return
        }
        // 选择批次成本价格
        const speciCost = selSpecieData.cost
        // 选择批次数量单位
        const specieUnitId = selSpecieData.unitId
        //比较选择的批次计量单位与 选择的数量单位是否一致
        const unit1Id = Array.isArray(item.unitId) ? item.unitId.at(-1) : item.unitId
        //  equal：单位是否一致 ；totalPrie：成本价格
        const { equal, totalPrice } = equalUnitRoot(state.unitData, unit1Id, specieUnitId, speciCost, item.amount)
        if (!equal) {
          showMessage('error', `出库产品第${index + 1}项，批次数量单位与出库数量单位不一致！！！`)
          item.unitId = ''
          item.profitsLoading = false
          return
        }
        // 计算利润 = 总价格 - 成本
        item.profits = item.totalPrice - totalPrice

        item.profitsLoading = false
        console.log(item)
        // 根据出库单位将库存进行单位的转换
        const convertedAmount = convertedQuantityUnit(item.stockUnitId, unit1Id, item.stock, state.unitData)
        const untiName = getTreeDataById(state.unitData, unit1Id)
        item.stock = convertedAmount
        item.stockUnitId = untiName.id
        item.stockUnitName = untiName.name
        // 产品进价修改为当前出库单位价格
        item.grnPrice = totalPrice // + '/' + untiName.name
        // 计算总利润 = 各个产品利润 - 其他费用
        this.getTotalProfits()
      },
      getTotalProfits() {
        let toatlProfits = dialogForm.children.reduce((total, cur) => (total = mathJs.add(cur.profits, total)), 0)
        //  利润 - 其他费用
        toatlProfits = mathJs.subtract(toatlProfits, dialogForm.fees)
        state.toatlProfits = toatlProfits
      },
      getTotalPrice(index) {
        const curOutDetail = dialogForm.children[index]
        dialogForm.children[index].totalPrice = mathJs.multiply(curOutDetail.amount, curOutDetail.price)
        // 计算出库产品明细 各个产品总价
        // setGrnDetailTotalPrice();
        //计算出的总价格
        let totalPriceOutbound = dialogForm.children.reduce(
          (total, cur) => (total = mathJs.add(cur.totalPrice, total)),
          0
        )
        // 出库产品总价
        state.totalPriceOutbound = totalPriceOutbound
        //总价格= 产品售价-其他费用
        totalPriceOutbound = mathJs.subtract(totalPriceOutbound, dialogForm.fees)
        dialogForm.totalPrice = totalPriceOutbound
        // 已付款
        dialogForm.realCo = totalPriceOutbound
        // 计算利润
        this.caculateOutboundTotalprofits(index)
      },

      //其他费用[自付费用 需要当做成本计算]
      setTotalPrice() {
        const totalPriceOutbound = mathJs.subtract(state.totalPriceOutbound, dialogForm.fees)
        dialogForm.totalPrice = totalPriceOutbound
        // 已付款
        dialogForm.realCo = totalPriceOutbound
        // 利润
        this.getTotalProfits()
      },
      /**
       * 批次change
       */
      specieChanged(index) {
        const getOutboundChildren = dialogForm.children[index]
        specieId = getOutboundChildren.specieId
        getOutboundChildren.grnPrice = ''
        Array.isArray(specieId) && (specieId = specieId.at(-1))
        // 当前批次 进货价格
        const currentSpecieData = getOutboundChildren.specieData
        const findSpecie = currentSpecieData.find(v => v.id === getOutboundChildren.specieId)
        if (findSpecie) {
          getOutboundChildren.grnPrice = findSpecie.cost + ' / ' + findSpecie.unitName
          // 产品进价
          getOutboundChildren.grnPriceObj = {
            cost: findSpecie.cost,
            unitId: findSpecie.unitId
          }
        }
      },
      /**
       * 获取出库产品库存量--批次改变、产品进价
       * @param {*} index 出库明细索引
       */
      getCategoryStock(index) {
        const getOutboundChildren = dialogForm.children[index]
        getOutboundChildren.stock = '0'
        // getOutboundChildren.grnPrice = '';
        let categoryId = getOutboundChildren.categoryId,
          repoId = getOutboundChildren.repoId,
          specieId = getOutboundChildren.specieId

        Array.isArray(categoryId) && (categoryId = categoryId.at(-1))
        Array.isArray(repoId) && (repoId = repoId.at(-1))
        Array.isArray(specieId) && (specieId = specieId.at(-1))

        // 当前批次 进货价格
        /*  const currentSpecieData = getOutboundChildren.specieData;
         const findSpecie = currentSpecieData.find(v => v.id === getOutboundChildren.specieId);
         if (findSpecie) {
           getOutboundChildren.grnPrice = findSpecie.cost + " / " + findSpecie.unitName;
           // 产品进价
           getOutboundChildren.grnPriceObj = {
             cost: findSpecie.cost,
             unitId: findSpecie.unitId
           }
         } */

        // 如果 产品、批次、仓库都已选择
        if (categoryId && repoId && specieId) {
          getOutboundChildren.stockLoading = true
          getInventoryAllList({
            categoryId,
            repoId,
            specieId
          })
            .then(res => {
              const resData = Array.isArray(res.message) ? res.message : []
              // 保存库存量、以及出库数量单位（）
              if (res.code === 200 && resData.length) {
                getOutboundChildren.stock = resData[0].stock
                getOutboundChildren.stockUnitName = resData[0].unitName
                getOutboundChildren.unitId = resData[0].minUnitId
                // 库存单位id
                getOutboundChildren.stockUnitId = resData[0].minUnitId
              }
              // 计算利润
              this.caculateOutboundTotalprofits(index)
            })
            .finally(() => {
              getOutboundChildren.stockLoading = false
            })
        }
      },
      /**
       * 新增 选择完客户之后 将名称赋值给配送人姓名
       */
      setDistributionName(id) {
        // 查找客户数据
        const findCustomeData = state.customerData.find(v => v.id === id)
        if (findCustomeData) {
          dialogForm.distributionName = findCustomeData.name
          dialogForm.distributionPhone = findCustomeData.phone //配送联系电话
          dialogForm.distributionAddress = findCustomeData.address //收货地址
        }
      },
      /**
       * 导出
       */
      handleExport() {
        const params = []
        for (const key in state.queryForm) {
          params.push(key + '=' + state.queryForm[key])
        }
        const url = process.env.VUE_APP_URL_API + '/outbound/exportGrnList?' + params.join('&')
        downLoadFile(url)
      },
      /**
       * 配送消息切换
       */
      resetDistribution(value) {
        dialogForm.distributionPhone = '' //配送联系电话
        dialogForm.distributionAddress = '' //收货地址
        dialogForm.distributionRemarks = '' //配送备注
        dialogForm.distributionName = '' //配送联系人
      },
      /**
       * 移除出库明细
       */
      removeGrnDetail(index) {
        dialogForm.children.splice(index, 1)
      },
      /**
       * 出库产品明细 出库产品change事件
       * 获取产品批次数
       */
      async getGrnDetailSpecie(value, index, isClear = true) {
        const item = dialogForm.children[index]
        //之前选择批次清除【非编辑状态】
        // if (!state.isEdit) {
        if (isClear) {
          item.specieId = ''
          item.specieData = []
          item.grnPrice = ''
          item.stock = '0' // 库存
        }
        if (value == null) return
        const categoryId = Array.isArray(value) ? value.at(-1) : value
        item.grnPriceLoading = true
        let params = { categoryIds: categoryId }
        //编辑添加批次id
        !isClear && (params.id = item.specieId)
        const res = await getListByCategoryId(params).finally(() => {
          item.grnPriceLoading = false
        })
        res.code === 200 && (item.specieData = res.message)
        // 非编辑状态
        if (isClear) {
          // 批次清空
          item.specieId = ''
          // 进价清空
          item.grnPrice = ''
          //默认选中第一个
          if (res.code === 200 && res.message.length) {
            item.specieId = res.message[0].id
            // 产品进价
            item.grnPrice = res.message[0].cost + ' / ' + res.message[0].unitName
            // 保存进价数据
            item.grnPriceObj = {
              cost: res.message[0].cost,
              unitId: res.message[0].unitId
            }
          }
        }

        // 获取产品库存量
        this.getCategoryStock(index)
      },
      /**
       * 新增出库产品明细
       * 添加一个子级明细
       */
      addGrnDetailList() {
        dialogForm.children.push(getOutboundChildrenList())
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
        params.minDebt = params.minDebts ? 0 : null

        //产品id如果是数组取最后一位
        Array.isArray(params.categoryId) && (params.categoryId = params.categoryId.map(v => v.at(-1)).join(','))

        console.log(params)
        const res = await getOutboundList(params)
        res.code === 200 && (state.tableData = res.message.records) && (state.total = res.message.total)
        state.loadTable = false
      },
      /**
       * 修改
       */
      handlerEdit(item) {
        item = JSON.parse(JSON.stringify(toRaw(item)))
        state.isEdit = true
        state.dialogVisible = true
        state.currentEditData = item
        nextTick(() => {
          dialogRef.value.resetFields()
          for (const key in dialogForm) {
            // 出库产品明细
            if (key === 'children') {
              let index = 0
              for (const itemc of item.children) {
                !dialogForm.children[index] && (dialogForm.children[index] = getOutboundChildrenList())
                dialogForm.children[index].id = ''
                for (const iterator in itemc) {
                  Reflect.has(dialogForm.children[index], iterator) &&
                    (dialogForm.children[index][iterator] = itemc[iterator])
                }
                // 加载批次
                this.getGrnDetailSpecie(dialogForm.children[index].categoryId, index, false)
                // 加载库存
                index++
              }
              // 计算总价格
              //计算出的总价格
              let totalPriceOutbound = dialogForm.children.reduce(
                (total, cur) => (total = mathJs.add(cur.totalPrice, total)),
                0
              )
              // 出库产品总价
              state.totalPriceOutbound = totalPriceOutbound
              //  利润 - 其他费用
              const toatlProfits = mathJs.subtract(totalPriceOutbound, dialogForm.fees)
              state.toatlProfits = toatlProfits
            } else if (Reflect.has(dialogForm, key)) {
              dialogForm[key] = item[key]
            }
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
        state.saveLoading = false
        //商品总价格
        state.totalPriceOutbound = 0
        // 总利润
        state.toatlProfits = 0
        nextTick(() => {
          dialogRef.value.resetFields()
          dialogForm.code = 'OUT' + moment(new Date()).format('YYYYMMDDHHmmss')
          dialogForm.date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          //出库明细
          dialogForm.children = [getOutboundChildrenList()]
          state.currentEditData = item
        })
      },
      /**
       * 删除
       */
      async handlerDelete(item) {
        const loading = globalLoading()
        const updateGrn = JSON.parse(JSON.stringify(toRaw(item)))
        //将库存清零
        for (const itemc of updateGrn.children) {
          itemc.amount = 0
        }
        const prams = {
          grn: updateGrn,
          grnId: item.id,
          grnDetailIds: item.children.map(v => v.id)
        }
        const resDel = await deleteGrnList(prams)
        loading.close()
        showMessage(resDel.code === 200 ? 'success' : 'error', resDel.message)
        resDel.code === 200 && this.getTableData()
      },
      //保存
      handlerSava() {
        dialogRef.value.validate(async valid => {
          if (valid) {
            //出库产品 修改单价 产品单位id
            await setGrnDetailTotalPrice()
            const params = Object.assign({}, dialogForm)
            //添加操作人姓名
            params.agentName = state.agentData.find(v => v.id === params.agentId).name
            //客户姓名
            params.customerName = state.customerData.find(v => v.id === params.customerId).name
            //欠款
            params.debt = mathJs.subtract(params.totalPrice, params.realCo)
            //修改参数添加id
            state.isEdit && (params.id = state.currentEditData.id)
            state.saveLoading = true
            const responseData = state.isEdit ? await updateOutbound(params) : await addOutbound(params)
            state.saveLoading = false
            // 刷新表格
            responseData.code === 200 && this.getTableData()
            //显示提示信息
            showMessage(responseData.code === 200 ? 'success' : 'error', responseData.message.message)
            responseData.code === 200 && (state.dialogVisible = false)
          } else {
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
      const res = await Promise.all([
        getCategoryTree(),
        userList(),
        customerList({ pageSize: 20, pageNo: 1 }),
        getRepoList({ name: '' }),
        getUnitList()
      ]).finally(() => {
        state.loadignData = false
      })

      res[0].code === 200 && (state.categoryData = res[0].message) // 产品
      res[1].code === 200 && (state.agentData = res[1].message.data) // 用户
      res[2].code === 200 && (state.customerData = res[2].message.records) // 客户
      res[3].code === 200 && (state.repoData = res[3].message) // 仓库
      res[4].code === 200 && (state.unitData = res[4].message) // 数量单位
      console.log(JSON.stringify(state.unitData))
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
      remoteCustomeData
    }
  }
}
</script>
<style lang="scss" scoped>
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
  display: inline-block;
  margin-right: 15px;
  font-size: 25px;
  color: #409eff;
}
.tableFields-con {
  padding: 10px;
  box-sizing: border-box;
  .tableFields-item {
    display: block;
  }
}
</style>
