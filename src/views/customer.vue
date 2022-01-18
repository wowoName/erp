<!--  -->
 <template>
  <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
    <el-form-item label="姓名：">
      <el-input v-model="formInline.name" @keyup.native.enter="onQuery()" clearable placeholder="请输入客户姓名">
      </el-input>
    </el-form-item>
    <el-form-item label="电话：">
      <el-input v-model="formInline.phone" @keyup.native.enter="onQuery()" clearable placeholder="请输入客户电话">
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" icon="Search" @click="onQuery()">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button icon="Plus" @click="addCustomer()">新增</el-button>
    </el-form-item>
  </el-form>
  <!-- 表格 -->
  <el-table :data="tableData" v-loading="loadingTbl" style="width: 100%" border empty-text="暂无数据">
    <el-table-column prop="name" label="姓名" width="100" />
    <el-table-column prop="phone" label="手机号" width="120" />
    <el-table-column prop="address" label="地址" />
    <el-table-column prop="remarks" label="备注" />
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button icon="Edit" size="mini" @click.prevent="editCustomer(scope.row)">
          修改
        </el-button>
        <el-popconfirm title="确定要删除吗?" @confirm="deleteCustomer(scope.row)" confirm-button-text="确定"
          cancel-button-text="取消">
          <template #reference>
            <el-button type="danger" size="mini" icon="Delete">
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

  <!-- 新增客户 dialog -->
  <el-dialog v-model="customerDailog" width="500px" :title="isEditCustomer?'修改客户：'+customerDialogForm.name:'新增客户'"
    :before-close="resetDialogForm">
    <el-form size="small" ref="customerDialogRef" :model="customerDialogForm" :rules="customerDialogFormRules"
      class="demo-form-inline">
      <el-form-item label="客户姓名：" prop="name">
        <el-input v-model="customerDialogForm.name" maxlength="10" show-word-limit clearable placeholder="请输入客户姓名">
        </el-input>
      </el-form-item>
      <el-form-item label="客户手机：" prop="phone">
        <el-input v-model="customerDialogForm.phone" :maxlength="11" clearable placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="联系地址：" prop="address">
        <el-input v-model="customerDialogForm.address" maxlength="30" show-word-limit autocomplete="off" :rows="3"
          type="textarea" clearable placeholder="请输入联系地址：">
        </el-input>
      </el-form-item>
      <el-form-item label="备注信息：" prop="remarks">
        <el-input v-model="customerDialogForm.remarks" maxlength="50" show-word-limit autocomplete="off" :rows="3"
          type="textarea" clearable placeholder="请输入备注信息">
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="customerDailog = false">关闭</el-button>
        <el-button size="small" :loading="saveLoading" type="primary" @click="saveCustomer()">保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

  <script>
import { reactive, toRefs, ref, onMounted, nextTick } from 'vue';
import { ElMessage, ElLoading } from "element-plus";
import { globalLoading, showMessage } from '@/utils'
import { addCustomer, updateCustomer, removeCustomer, customerList } from '@/api/common'
export default {
  name: 'customer',
  setup() {
    //新增客户数据
    const getCustomerDialogFormValues = () => {
      return {
        name: '',
        phone: '',
        address: '',
        remarks: ''
      }
    }
    // customerDialog ref
    const customerDialogRef = ref();
    const passDialogRef = ref();
    /**
     * 数据
     */
    let data = reactive({
      /**
       * 查询数据
       */
      formInline: {
        name: '',
        phone: ''
      },
      tableData: [],
      currentPage: 1,//当前页数
      pageSize: 10,
      total: 0,
      loadingTbl: true,
      customerDailog: false,//操作客户dialog

      customerDialogForm: getCustomerDialogFormValues(),
      editCustomerId: '',//当前修改客户id
      isEditCustomer: false,
      saveLoading: false//保存时确定按钮的loading
    });

    /**
        * 新增客户 rules
        */
    const customerDialogRules = reactive({
      customerDialogFormRules: {
        name: [{
          required: true, message: '请输入客户姓名', trigger: 'blur',
        }],
        // phone: [
        //   { required: true, message: '请输入手机号', trigger: "blur" },
        //   { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '手机号码格式错误', trigger: "blur" }
        // ]
      }
    })


    /**
     * 方法
     */
    const methods = {
      /**
       * 查询
       */
      async onQuery() {
        const params = Object.assign({}, data.formInline, {
          pageSize: data.pageSize,
          pageNo: data.currentPage
        })
        data.loadingTbl = true
        const responseData = await customerList(params)
        responseData.code === 200 && (data.tableData = responseData.message.records) && (data.total = responseData.message.total);
        data.loadingTbl = false
      },
      /**
       * 编辑客户
       * @param {*} customerData 当前客户数据
       */
      editCustomer(customerData) {
        data.isEditCustomer = true
        data.customerDialogForm = Object.assign({}, customerData)
        data.editCustomerId = customerData.id;
        data.customerDailog = true;
      },
      /**
       * 删除客户
       */
      async deleteCustomer(customerData) {
        const loading = globalLoading()
        let res = await removeCustomer({ id: customerData.id });
        loading.close()
        showMessage(res.code === 200 ? 'success' : 'error', res.message)
        //删除成功进行查询
        res.code === 200 && this.onQuery()
      },
      /**
       * 新增客户
       */
      addCustomer() {
        data.customerDailog = true;
        data.isEditCustomer = false;
        handlerResetDialogForm()
      },
      /**
       * 关闭dialog 之前 重置form
       */
      resetDialogForm(done) {
        handlerResetDialogForm()
        done()
      },
      /**
       * 保存客户
       */
      saveCustomer() {
        customerDialogRef.value.validate((valid) => {
          if (valid) {
            handlerSaveCustomer()
          } else {
            console.log('error submit!!')
            return false
          }
        });
      },

      /**
       * 分页记录数改变
       */
      handleSizeChange(value) {
        data.pageSize = value
        methods.onQuery()
      },
      /**
       * 分页页数改变
       */
      handleCurrentChange(value) {
        data.currentPage = value
        methods.onQuery()
      }
    }
    /**
     * 保存客户信息
     */
    const handlerSaveCustomer = async () => {
      data.saveLoading = true
      //根据标识判断是新增还是修改
      const response = data.isEditCustomer ? await updateCustomer(data.customerDialogForm) : await addCustomer(data.customerDialogForm);
      data.saveLoading = false
      if (response.code === 200) {
        ElMessage.success(response.message);
        //刷新表格
        methods.onQuery()
        //关闭dialog
        data.customerDailog = false
      } else {
        ElMessage.error(response.message);
      }

    }
    const handlerResetDialogForm = () => {
      nextTick(() => {
        customerDialogRef.value.resetFields()
        data.saveLoading = false
      })
    }
    onMounted(() => {
      //查询客户数据
      methods.onQuery()

    })
    return {
      ...toRefs(data),
      ...methods,
      ...toRefs(customerDialogRules),
      customerDialogRef
    }
  }
}
  </script>
  <style lang='scss' scoped></style>