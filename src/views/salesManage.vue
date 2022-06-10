<!--  -->
 <template>
  <el-form :inline="true" :model="queryForm" label-width="100px" size="small" class="demo-form-inline">
    <el-form-item label="单号：">
      <el-input v-model="queryForm.code" @keyup.enter.native="getTableData()" clearable placeholder="请输入申请单号">
      </el-input>
    </el-form-item>
    <el-form-item label="开始时间：" prop="startDate">
      <el-date-picker v-model="queryForm.startDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间：" prop="endDate">
      <el-date-picker v-model="queryForm.endDate" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime" placeholder="结束时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="商品类型：" prop="categoryId">
      <el-cascader v-model="queryForm.categoryId" :options="categoryData" placeholder="选择查询商品" :props="cascaderOptions"
        collapse-tags clearable />
    </el-form-item>

    <el-form-item label="申请人：" prop="agentId">
      <el-select v-model="queryForm.applyId" filterable clearable placeholder="选择申请人">
        <el-option v-for="item in agentData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="审核人" prop="agentId">
      <el-select v-model="queryForm.checkUserId" filterable clearable placeholder="选择审核人">
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
      <el-button icon="Plus" @click="handlerAdd()">新增出库通知单</el-button>
    </el-form-item>

  </el-form>
  <el-table :data="tableData" v-loading="loadTable" v-tableHeight row-key="id" border
    :tree-props="{ children: 'childrens' }">

    <el-table-column type="expand">
      <template #default="props">
        <div class="grn-detail-list">
          <el-table :data="props.row.children">
            <el-table-column prop="categoryName" label="产品名称"></el-table-column>
            <el-table-column prop="amount" label="出库数量">
              <template #default="propsc">
                {{propsc.row.amount}} / {{propsc.row.unitName}}
              </template>
            </el-table-column>

            <el-table-column prop="amount" label="进价">
              <template #default="propsc">
                {{propsc.row.specieCost}} / {{propsc.row.costUnitName}}
              </template>
            </el-table-column>

            <el-table-column prop="amount" label="售价">
              <template #default="propsc">
                {{propsc.row.price}} / {{propsc.row.unitName}}
              </template>
            </el-table-column>

            <el-table-column prop="totalPrice" label="总价"></el-table-column>

            <el-table-column prop="repoName" label="出库仓库"></el-table-column>

          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column type="index" width="50" />
    <el-table-column prop="code" label="出库通知单号" width="180" />
    <el-table-column prop="statusName" label="审核状态" width="120">
      <template #default="scope">
        <span :class="['status-'+scope.row.status]">{{scope.row.statusName}}</span>
      </template>
    </el-table-column>
    <el-table-column label="出库产品" min-width="400">
      <template #default="props">
        <div v-html="getTblTemplate(props.row.children)"> </div>
      </template>
    </el-table-column>
    <el-table-column prop="applyDate" label="申请日期" width="160" />
    <el-table-column prop="applyUserName" label="申请人" min-width="120" />
    <el-table-column prop="remarks" label="申请人备注" min-width="200" />

    <el-table-column prop="checkUserName" label="审核人" min-width="120" />
    <el-table-column prop="auditDate" label="审核日期" width="160" />
    <el-table-column prop="checkRemarks" label="审核人备注" min-width="120" />

    <el-table-column prop="totalPrice" label="总价" min-width="100" />
    <el-table-column prop="realCo" label="已付款" min-width="100" />
    <el-table-column prop="debt" label="待付款" min-width="100" sortable />
    <el-table-column prop="fees" label="其他费用" min-width="100" />

    <el-table-column label="操作" width="280" fixed="right">
      <template #default="scope">

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
  <el-dialog v-model="dialogVisible" width="800px" fullscreen :title="isEdit?'修改出库通知单':'新增出库通知单'"
    :before-close="resetDialogForm">
    <el-form size="small" ref="dialogRef" label-width="120px" :model="dialogForm" :rules="dialogFormRules"
      class="demo-form-inline">

      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="通知单号：" prop="code">
            <span v-if="isEdit">{{dialogForm.code}}</span>
            <el-input v-else v-model.trim="dialogForm.code" :maxlength="20" @keyup.enter.native="handlerSava()"
              clearable placeholder="请输入出通知单号">
            </el-input>

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
          <el-form-item label="申请日期：" prop="applyDate">
            <span v-if="isEdit">{{dialogForm.applyDate}}</span>
            <el-date-picker v-else v-model="dialogForm.applyDate" format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="请选择申请日期" style="width:100%">
            </el-date-picker>
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item label-width='0'>
        <el-divider> <span class="grn-detail-title">出库通知单明细</span> </el-divider>
      </el-form-item>
      <el-form-item label-width='0'>
        <el-table :data="dialogForm.children">
          <el-table-column label="产品名称：" min-width="220px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.categoryId'"
                :rules="dialogFormRules.categoryId">
                <el-cascader v-model="props.row.categoryId" filterable @change="v=>getGrnDetailSpecie(v,props.$index)"
                  size="mini" :options="categoryData" placeholder="请选择产品" :props="{ value: 'id', label: 'name' }"
                  collapse-tags clearable style="width:100%" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="产品批次" min-width="220px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.specieId'"
                :rules="dialogFormRules.specieId">
                <el-select v-model="props.row.specieId" filterable clearable :disabled="props.row.specieData.length==0"
                  @change="getCategoryStock(props.$index)" placeholder="请选择产品批次">
                  <el-option v-for="item in props.row.specieData" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="仓库：" min-width="220px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.repoId'" :rules="dialogFormRules.repoId">
                <el-select v-model="props.row.repoId" @change="getCategoryStock(props.$index)" filterable clearable
                  placeholder="请选择仓库地址" style="width:100%">
                  <el-option v-for="item in repoData" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
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
                <span v-else>{{props.row.stock}}</span>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="出库数量" min-width="200px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.amount'" :rules="dialogFormRules.amount">
                <el-input-number v-model.number="props.row.amount" @change="getTotalPrice(props.$index)" :min="0"
                  style="width:100%" clearable placeholder="请输入出库通知单数量">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="数量单位" min-width="200px">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.unitId'" :rules="dialogFormRules.unitId">
                <el-cascader v-model="props.row.unitId" filterable
                  :props="{ value: 'id', label: 'name', checkStrictly: true }" :options="unitData" clearable
                  placeholder="请选择数量单位" style="width:100%" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="单价" min-width="200px" fixed="right">
            <template #default="props">
              <el-form-item label-width="0" :prop="'children.'+props.$index+'.price'" :rules="dialogFormRules.price">
                <el-input-number v-model.number="props.row.price" @change="getTotalPrice(props.$index)" :min="0"
                  style="width:100%" clearable placeholder="请输入单价">
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="总价格" prop="cost" min-width="100px" fixed="right">
            <template #default="props">
              <el-form-item label-width="0">
                {{props.row.totalPrice}}
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
        <el-button type="text" size="medium" icon="CirclePlus" @click="addGrnDetailList()">添加产品</el-button>
      </el-form-item>
      <el-divider border-style="dashed"></el-divider>
      <el-row>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-form-item label="其他费用：" prop="fees">
            <el-input-number v-model="dialogForm.fees" @change="setTotalPrice()" :precision="2" :min="0" clearable
              placeholder="请输入其他费用" style="width:100%">
            </el-input-number>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-form-item label="总价：" prop="totalPrice">
            <el-input-number v-model="dialogForm.totalPrice" :precision="2" clearable placeholder="请输入总价"
              style="width:100%">
            </el-input-number>
            <el-tooltip class="item" effect="dark" content="商品总价格" placement="top-start">
              <span style="cursor:pointer">商品总价格：{{totalPriceOutbound}}
                <el-icon color="#7ca0d5">
                  <info-filled />
                </el-icon>
              </span>
            </el-tooltip>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
          <el-form-item label="已付款：" prop="realCo">
            <el-input-number v-model="dialogForm.realCo" :precision="2" clearable placeholder="请输入已付款"
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

        <template v-if="dialogForm.distribution==='0'">
          <el-col :span="24">
            <el-row>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="联系人：" prop="distributionPhone">
                  <el-input v-model="dialogForm.distributionName" :maxlength="11" clearable placeholder="请输入联系人">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="联系电话：" prop="distributionPhone">
                  <el-input v-model="dialogForm.distributionPhone" :maxlength="11" clearable placeholder="请输入手机号">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="收货地址：" prop="distributionAddress">
                  <el-input v-model.trim="dialogForm.distributionAddress" type="textarea" :rows="2" show-word-limit
                    maxlength="50" clearable placeholder="请输入收货地址">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="备注信息：" prop="distributionRemarks">
                  <el-input v-model.trim="dialogForm.distributionRemarks" type="textarea" :rows="2" show-word-limit
                    maxlength="50" clearable placeholder="请输入备注信息">
                  </el-input>
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

  <el-dialog fullscreen :title="dialogType==='audit'?'审核出库通知单':'查看出库通知单'" v-model="auditVisible">
    <el-form size="small" label-width="120px" class="demo-form-inline" ref="auditFormRef" :model="auditForm">
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="通知单编号：">
            {{dialogForm.code}}
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="申请人：">
            {{currentEditData.applyUserName}}
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="申请日期：">
            {{dialogForm.applyDate}}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label-width='0'>
            <el-table :data="dialogForm.children">
              <el-table-column label="产品名称" prop="categoryName"> </el-table-column>

              <el-table-column label="出库数量" prop="amount">
                <template #default="scope">
                  {{scope.row.amount}} / {{scope.row.unitName}}
                </template>
              </el-table-column>
              <el-table-column label="单价" prop="price"></el-table-column>
              <el-table-column label="总价" prop="amount">
                <template #default="scope">
                  {{scope.row.price*scope.row.amount}}
                </template>
              </el-table-column>
              <el-table-column label="仓库名称" prop="repoName"></el-table-column>
            </el-table>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="其他费用：">
            <span class="status-2"> {{dialogForm.fees}}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="总价：">
            <span class="status-1"> {{dialogForm.totalPrice}}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item label="已付款：">
            <span class="status-3"> {{dialogForm.realCo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
            {{dialogForm.remarks}}
          </el-form-item>
        </el-col>

        <template v-if="dialogForm.distribution==='0'">
          <el-divider> 配送信息</el-divider>
          <el-col :span="24">
            <el-row>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="联系人：" prop="distributionPhone">
                  <span>{{dialogForm.distributionName}}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="联系电话：" prop="distributionPhone">
                  <span>{{dialogForm.distributionPhone}}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="收货地址：" prop="distributionAddress">
                  <span>{{dialogForm.distributionAddress}}</span>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
                <el-form-item label="备注信息：" prop="distributionRemarks">
                  <span>{{dialogForm.distributionRemarks}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </template>

        <el-divider>
          <h3>{{dialogType==='audit'?'审核':'审核结果'}}</h3>
        </el-divider>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item :label="dialogType==='audit'?'审核':'审核结果'" prop="status">
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
            <el-input v-if="dialogType==='audit'" v-model.trim="auditForm.checkRemarks" type="textarea" :rows="4"
              show-word-limit maxlength="50" clearable placeholder="请输入备注信息">
            </el-input>
            <span v-else>{{auditForm.checkRemarks}}</span>
          </el-form-item>

        </el-col>

      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="auditVisible = false">关闭</el-button>
        <el-button size="small" v-if="dialogType==='audit'" :loading="saveLoading" type="primary"
          @click="handlerSaveAudit()">保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

  <script>
import { reactive, toRefs, ref, nextTick, toRaw, watch, readonly } from 'vue'
import moment from 'moment'
import {
  addDeliveryNotice, updateDeliveryNotice, auditDeliveryNotice, deleteDeliveryNotice, getDeliveryNoticeList, customerList, getRepoList, getListByCategoryId, getCategoryTree, getUnitList
  , getInventoryAllList
} from '@/api/common'
import { userList } from '@/api/user'
import { globalLoading, showMessage, equalUnitRoot, downLoadFile } from '@/utils'
import mathJs from '@/utils/math'
import _ from 'lodash'
import remoteMix from '@/mixin/remote'
export default {
  name: 'outboundManage',
  setup(props, context) {
    const deliveryNoticeList = ({
      categoryId: '',
      repoId: '',
      specieId: '',
      unitId: '',
      amount: 1,
      specieData: [],
      totalPrice: 0,//总售价
      stock: '',//库存量
      price: 0,// 销售单价
      stockLoading: false,//计算总价格loading
      grnPriceLoading: false,
    })
    const state = reactive({
      tableData: [],
      dialogVisible: false,// 修改、新增dialog
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
        startDate: moment(new Date(+new Date() - 3 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
        endDate: '',
        categoryId: '',// 商品id
        checkUserId: '',// 审核人
        applyId: '',// 申请人
        status: 0,// 审核状态
      },
      cascaderOptions: { value: 'id', label: 'name', multiple: true },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loadTable: false,
      totalPriceOutbound: 0,//计算出的出库商品总加个
      // 审核状态
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
      auditVisible: false,
      dialogType: 'audit',// 审核或者查看标识
    })

    const auditFormRef = ref(null)

    let auditForm = reactive({
      status: 1,// 审核状态
      checkRemarks: '',// 审核备注
    })
    /**
     * 出库通知单产品参数
     */
    function getdeliveryNoticeChildrenList() {
      return _.cloneDeep(deliveryNoticeList);
    }
    // 新增、修改form
    let dialogForm = reactive({
      code: '' + moment(new Date()).format('YYYYMMDDHHmmss'),//出库通知单单编号
      applyDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),//出库通知单日期
      applyId: '',// 申请人
      totalPrice: 0,// 总价
      realCo: 0, // 已付款 
      fees: 0,//其他费用
      remarks: '', // 备注信息
      distribution: '1',//是否需要配送
      distributionPhone: '',//配送联系电话
      distributionAddress: '',//收货地址
      distributionRemarks: '',//配送备注
      distributionName: '',//配送联系人
      children: [getdeliveryNoticeChildrenList()]
    })

    // 新增、修改formRules
    const dialogFormRules = {
      code: [{
        required: true, message: '请输入出库通知单单编号', trigger: 'blur',
      }],
      applyDate: [{
        required: true, message: '请选择出库通知单日期', trigger: 'change',
      }],
      applyId: [{
        required: true, message: '请选择申请人', trigger: 'change',
      }],

      categoryId: [{
        required: true, message: '请选择出库通知单产品', trigger: 'blur',
      }],
      amount: [{
        required: true, message: '请输入出库通知单数量', trigger: 'blur',
      }, {
        type: 'number',
        min: 1,
        message: '出库通知单数量最小为1',
        trigger: 'blur',
      }],
      unitId: [{
        required: true, message: '请选择数量单位', trigger: 'blur',
      }],
      repoId: [{
        required: true, message: '请选择仓库', trigger: 'blur',
      }],
      specieId: [{
        required: true, message: '请选择批次', trigger: 'blur',
      }],
      categoryId: [{
        required: true, message: '请选择出库通知单产品', trigger: 'blur',
      }],
      price: [{
        required: true, message: '请输入单价', trigger: 'blur',
      }, {
        type: 'number',
        min: 0,
        message: '单价最小为0',
        trigger: 'blur',
      }]
    }
    // 新增、修改dialog ref
    const dialogRef = ref(null)
    /**
  * 出库通知单产品 计算利润  切换展示 产品id 、 单位id
  */
    function setDeliveryNoticeChildren(changeId = true) {
      return new Promise((resolve, reject) => {
        let index = 1;
        // 均摊其他费用
        const fees = mathJs.divide(dialogForm.fees, dialogForm.children.length);
        for (const item of dialogForm.children) {
          if (item.unitId === "" || item.specieId === "") {
            reject();
            break;
          }
          // 选择批次id
          const curSpecieId = item.specieId;
          const selSpecieData = item.specieData.find(v => v.id === curSpecieId)
          if (!selSpecieData) {
            showMessage('error', `出库库产品第${index}项。批次不存在！`)
            reject("批次不存在")
            break
          }
          // 选择批次成本价格
          const speciCost = selSpecieData.cost;
          // 选择批次数量单位 
          const specieUnitId = selSpecieData.unitId
          //比较选择的批次计量单位与 选择的数量单位是否一致
          const unit1Id = Array.isArray(item.unitId) ? item.unitId.at(-1) : item.unitId;
          //  equal：单位是否一致 ；totalPrie：成本价格
          const { equal, totalPrice } = equalUnitRoot(state.unitData, unit1Id, specieUnitId, speciCost, item.amount)
          if (!equal) {
            showMessage('error', `出库库产品第${index}项。批次数量单位与出库数量单位不一致！`)
            reject("批次数量单位与出库数量单位不一致，无法转换 不可出库")
            break
          }
          //单位最后一位
          item.unitId = unit1Id
          // 出库通知单产品id 
          item.categoryId = Array.isArray(item.categoryId) ? item.categoryId.at(-1) : item.categoryId;
          // 均摊其他费用
          item.fees = fees
          index++;
        }
        resolve()
      })
    }

    const methods = {
      /**
       * 表格操作
       * @param {*} type  操作类型
       * @param {*} item 当前行数据
       */
      handleCommand(type, item) {
        switch (type) {
          case 'edit':
            this.handlerEdit(item);
            break;
          case 'audit':
            this.handlerAudit(item);
            break;
          case 'delete':
            this.handlerDelete(item);
            break;
          case 'print':
            this.handlerPrint(item);
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
        window.open('#print-sales?id=' + item.id, '_blank')
      },
      /**
    * 保存审核
    */
      async handlerSaveAudit() {
        const res = await auditDeliveryNotice({
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
       * 进行审核或者查看
       * @param {*} item  当前行数据
       * @param {*} type 类型：审核或者查看
       */
      handlerAudit(item, type = 'audit') {
        state.dialogType = type
        item = JSON.parse(JSON.stringify(toRaw(item)));
        state.currentEditData = item
        state.auditVisible = true
        nextTick(() => {
          auditFormRef.value.resetFields()
          for (const key in dialogForm) {
            if (key === 'children') {
              for (const itemc of item.children) {
                itemc.specieData = []
              }
            }
            dialogForm[key] = item[key]
          }

        })
      },
      /**
       * 显示出库明细
       */
      getTblTemplate(tblItems) {
        return tblItems.map(v => v.repoName + ' 出库 <span class="category-name">' + v.categoryName + '</span> ' + v.amount + '/' + v.unitName + '【' + " 售价：" + v.price + '/' + v.unitName + '】').join('<br />')
      },
      getTotalPrice(index) {
        const curOutDetail = dialogForm.children[index]
        dialogForm.children[index].totalPrice = mathJs.multiply(curOutDetail.amount, curOutDetail.price)
        //计算出的总价格
        let totalPriceOutbound = dialogForm.children.reduce((total, cur) => total = mathJs.add(cur.totalPrice, total), 0);
        // 出库产品总价
        state.totalPriceOutbound = totalPriceOutbound
        //总价格= 产品售价-其他费用
        totalPriceOutbound = mathJs.subtract(totalPriceOutbound, dialogForm.fees)
        dialogForm.totalPrice = totalPriceOutbound
        // 已付款
        dialogForm.realCo = totalPriceOutbound
      },

      //其他费用[自付费用 需要当做成本计算]
      setTotalPrice() {
        const totalPriceOutbound = mathJs.subtract(state.totalPriceOutbound, dialogForm.fees)
        dialogForm.totalPrice = totalPriceOutbound
        // 已付款
        dialogForm.realCo = totalPriceOutbound
      },
      /**
       * 获取出库产品库存量--批次改变、产品进价
       * @param {*} index 出库明细索引
       */
      getCategoryStock(index) {
        dialogForm.children[index].stock = ''
        dialogForm.children[index].grnPrice = ''
        const getOutboundChildren = dialogForm.children[index]
        let categoryId = getOutboundChildren.categoryId,
          repoId = getOutboundChildren.repoId,
          specieId = getOutboundChildren.specieId;

        Array.isArray(categoryId) && (categoryId = categoryId.at(-1));
        Array.isArray(repoId) && (repoId = repoId.at(-1));
        Array.isArray(specieId) && (specieId = specieId.at(-1));

        // 当前批次 进货价格
        const currentSpecieData = dialogForm.children[index].specieData;
        const findSpecie = currentSpecieData.find(v => v.id === dialogForm.children[index].specieId);
        findSpecie && (dialogForm.children[index].grnPrice = findSpecie.cost + " / " + findSpecie.unitName);

        // 如果 产品、批次、仓库都已选择
        if (categoryId && repoId && specieId) {
          dialogForm.children[index].stockLoading = true
          getInventoryAllList({
            categoryId,
            repoId,
            specieId
          }).then(res => {

            const resData = Array.isArray(res.message) ? res.message : [];
            res.code === 200 && resData.length > 0 && (dialogForm.children[index].stock = resData[0].stock + '' + resData[0].unitName)

          }).finally(() => {
            dialogForm.children[index].stockLoading = false
          })

        }
      },

      /**
       * 配送消息切换
       */
      resetDistribution(value) {
        dialogForm.distributionPhone = ''//配送联系电话
        dialogForm.distributionAddress = ''//收货地址
        dialogForm.distributionRemarks = ''//配送备注
        dialogForm.distributionName = ''//配送联系人
      },
      /**
       * 移除出库通知单明细
       */
      removeGrnDetail(index) {
        dialogForm.children.splice(index, 1)
      },
      /**
       * 出库通知单产品明细 出库通知单产品change事件
       * 获取产品批次数
       */
      async getGrnDetailSpecie(value, index) {
        //之前选择批次清除【非编辑状态】
        if (!state.isEdit) {
          dialogForm.children[index].specieId = '';
          dialogForm.children[index].specieData = []
          dialogForm.children[index].grnPrice = ''
        }
        if (value == null) return;
        const categoryId = Array.isArray(value) ? value.at(-1) : value;
        dialogForm.children[index].grnPriceLoading = true
        const res = await getListByCategoryId({ categoryIds: categoryId }).finally(() => {
          dialogForm.children[index].grnPriceLoading = false
        })
        res.code === 200 && (dialogForm.children[index].specieData = res.message)
        // 非编辑状态
        if (!state.isEdit) {
          //默认选中第一个
          res.code === 200 && res.message.length > 0 && (dialogForm.children[index].specieId = res.message[0].id) && (dialogForm.children[index].cost = res.message[0].cost + "" + res.message[0].unitName)
          // 显示产品进价
          res.code === 200 && res.message.length > 0 && (dialogForm.children[index].grnPrice = res.message[0].cost + " / " + res.message[0].unitName)
        }

        // 获取产品库存量
        this.getCategoryStock(index)


      },
      /**
       * 新增出库通知单产品明细
       * 添加一个子级明细
       */
      addGrnDetailList() {
        dialogForm.children.push(getdeliveryNoticeChildrenList())
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

        //产品id如果是数组取最后一位
        Array.isArray(params.categoryId) && (params.categoryId = params.categoryId.map(v => v.at(-1)).join(','))

        const res = await getDeliveryNoticeList(params)
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
        nextTick(() => {
          dialogRef.value.resetFields()
          for (const key in dialogForm) {
            // 出库通知单产品明细
            if (key === 'children') {
              let index = 0;
              for (const itemc of item.children) {
                !dialogForm.children[index] && (dialogForm.children[index] = getdeliveryNoticeChildrenList());
                dialogForm.children[index].id = "";
                for (const iterator in itemc) {
                  Reflect.has(dialogForm.children[index], iterator) && (dialogForm.children[index][iterator] = itemc[iterator])
                }
                // 加载批次
                this.getGrnDetailSpecie(dialogForm.children[index].categoryId, index)
                // 计算当前总价
                dialogForm.children[index].totalPrice = mathJs.multiply(itemc.amount, itemc.price)
                // 加载库存
                index++
              }

              //计算出的总价格
              let totalPriceOutbound = dialogForm.children.reduce((total, cur) => total = mathJs.add(cur.totalPrice, total), 0);
              // 出库产品总价
              state.totalPriceOutbound = totalPriceOutbound

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
        nextTick(() => {
          dialogRef.value.resetFields()
          dialogForm.code = 'OUTA' + moment(new Date()).format('YYYYMMDDHHmmss')
          dialogForm.applyDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          //出库明细
          dialogForm.children = [getdeliveryNoticeChildrenList()]
          state.currentEditData = item
        })
      },
      /**
       * 删除
       */
      async handlerDelete(item) {
        const loading = globalLoading()
        const prams = {
          id: item.id,
          status: state.currentEditData.status
        }
        const resDel = await deleteDeliveryNotice(prams)
        loading.close()
        showMessage(resDel.code === 200 ? 'success' : 'error', resDel.message)
        resDel.code === 200 && this.getTableData()
      },
      //保存
      handlerSava() {
        dialogRef.value.validate(async (valid) => {
          if (valid) {
            //出库产品 修改单价 产品单位id
            await setDeliveryNoticeChildren()
            const params = Object.assign({}, dialogForm)
            //添加申请人姓名
            params.applyUserName = state.agentData.find(v => v.id === params.applyId).name

            //欠款
            params.debt = mathJs.subtract(params.totalPrice, params.realCo)
            //修改参数添加id
            state.isEdit && (params.id = state.currentEditData.id)
            state.saveLoading = true
            const responseData = state.isEdit ? await updateDeliveryNotice(params) : await addDeliveryNotice(params);
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
.tableFields-con {
  padding: 10px;
  box-sizing: border-box;
  .tableFields-item {
    display: block;
  }
}
</style>