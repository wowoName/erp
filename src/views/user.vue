<!--  -->
 <template>
  <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
    <el-form-item label="姓名：">
      <el-input v-model="formInline.name" @keyup.native.enter="onQuery()" clearable placeholder="请输入用户姓名">
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" icon="Search" @click="onQuery()">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button icon="Plus" @click="addUser()">新增</el-button>
    </el-form-item>
  </el-form>
  <!-- 表格 -->
  <el-table :data="tableData" v-loading="loadingTbl" style="width: 100%" border empty-text="暂无数据">
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="phone" label="手机号" />
    <el-table-column fixed="right" label="操作" width="220">
      <template #default="scope">
        <el-button icon="Edit" size="mini" v-if="scope.row.name!=='admin'"
          @click.prevent="editPassword(scope.$index, scope.row)">
          修改密码
        </el-button>
        <template v-if="scope.row.name!=='admin'">
          <el-popconfirm title="确定要删除吗?" @confirm="deleteUser(scope.row)" confirm-button-text="确定"
            cancel-button-text="取消">
            <template #reference>
              <el-button type="danger" icon="Delete" size="mini">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </template>
    </el-table-column>
  </el-table>

  <!-- 新增用户 dialog -->
  <el-dialog v-model="userDailog" width="500px" title="添加用户" :before-close="resetDialogForm">
    <el-form size="small" ref="userDialogRef" :model="userDialogForm" :rules="userDialogFormRules"
      class="demo-form-inline">
      <el-form-item label="用户姓名：" prop="name">
        <el-input v-model="userDialogForm.name" clearable placeholder="请输入用户姓名"></el-input>
      </el-form-item>
      <el-form-item label="用户手机：" prop="phone">
        <el-input v-model="userDialogForm.phone" clearable placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="登录密码：" prop="password">
        <el-input v-model="userDialogForm.password" autocomplete="off" clearable show-password placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="password1">
        <el-input v-model="userDialogForm.password1" autocomplete="off" clearable show-password placeholder="请再次输入密码">
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="userDailog = false">关闭</el-button>
        <el-button size="small" :loading="saveLoading" type="primary" @click="saveUser()">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="editPassDialog" width="500px" title="修改密码">
    <el-form size="small" ref="passDialogRef" :model="passForm" :rules="pwdDialogRules" class="demo-form-inline">

      <el-form-item label="旧密码：&emsp;" prop="oldPwd">
        <el-input v-model="passForm.oldPwd" autocomplete="off" clearable show-password placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item label="新密码：&emsp;" prop="newPwd">
        <el-input v-model="passForm.newPwd" autocomplete="off" clearable show-password placeholder="请再次输入密码">
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="agPwd">
        <el-input v-model="passForm.agPwd" autocomplete="off" clearable show-password placeholder="请再次输入密码">
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="editPassDialog = false">关闭</el-button>
        <el-button size="small" :loading="saveLoading" type="primary" @click="saveEditPwd()">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

  <script>
import { reactive, toRefs, ref, onMounted, nextTick } from 'vue';
import { ElMessage, ElLoading } from "element-plus";
import * as api from '@/api/user.js'
export default {
  name: 'user',
  setup() {
    //新增用户数据
    const getUserDialogFormValues = () => {
      return {
        name: '',
        phone: '',
        password: '',
        password1: ''
      }
    }
    // userDialog ref
    const userDialogRef = ref();
    const passDialogRef = ref();
    /**
     * 数据
     */
    let data = reactive({
      formInline: {
        name: ''
      },
      tableData: [],
      loadingTbl: true,
      userDailog: false,//操作用户dialog
      editPassDialog: false,//修改密码
      userDialogForm: getUserDialogFormValues(),
      passForm: {
        oldPwd: '',
        newPwd: '',
        agPwd: ''
      },
      editUserId: '',//当前修改用户id
      saveLoading: false//保存时确定按钮的loading
    });
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (data.userDialogForm.password1 !== '') {
          userDialogRef.value.validateField('password1');
        }
        callback();
      }

    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== data.userDialogForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    /**
        * 新增用户 rules
        */
    const userDialogRules = reactive({
      userDialogFormRules: {
        name: [{
          required: true, message: '请输入用户姓名', trigger: 'blur',
        }],
        phone: [
          { required: true, message: '请输入手机号', trigger: "blur" },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '手机号码格式错误', trigger: "blur" }
        ],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
        ],
        password1: [{ required: true, message: '请确次输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
        ]
      }
    })

    const validatePassEdit = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (data.passForm.agPwd !== '') {
          passDialogRef.value.validateField('agPwd');
        }
        callback();
      }

    };
    const validatePassEdit2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== data.passForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const pwdDialogRules = reactive({
      pwdDialogRules: {
        oldPwd: [{
          required: true, message: '请输入旧密码', trigger: 'blur',
        }],

        newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
        { validator: validatePassEdit, trigger: 'blur' }
        ],
        agPwd: [{ required: true, message: '请确次输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
        { validator: validatePassEdit2, trigger: 'blur' }
        ]
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
        data.loadingTbl = true
        const responseData = await api.userList(data.formInline)
        responseData.code === 200 && (data.tableData = responseData.message.data);
        data.loadingTbl = false
      },
      /**
       * 编辑用户
       * @param {*} index  索引
       * @param {*} userData 当前用户数据
       */
      editUser(index, userData) {
        data.saveLoading = false
        data.userDialogForm.name = userData.name
        data.userDialogForm.phone = userData.phone
        data.userDialogForm.id = userData.id
        data.userDailog = true;
      },
      /**
       * 删除用户
       */
      async deleteUser(userData) {
        const loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        let res = await api.deleteUser(userData.id);
        loading.close()
        ElMessage.info(res.message)

      },
      /**
       * 新增用户
       */
      addUser() {
        data.saveLoading = false
        data.userDailog = true;
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
       * 保存用户
       */
      saveUser() {
        userDialogRef.value.validate((valid) => {
          if (valid) {
            handlerSaveUser()
          } else {
            console.log('error submit!!')
            return false
          }
        });
      },
      /**
       * 修改用户密码
       * @param {*} index
       * @param {*} userData 用户数据
       */
      editPassword(index, userData) {
        data.passForm = {
          oldPwd: '',
          newPwd: '',
          agPwd: ''
        }
        data.editUserId = userData.id;

        data.editPassDialog = true;
        //清空之前表单数据
        nextTick(() => {
          passDialogRef.value.resetFields()
        })
      },
      /**
       * 修改密码保存
       */
      saveEditPwd() {
        passDialogRef.value.validate((valid) => {
          if (valid) {
            handlerSavePwd()
          } else {
            console.log('error submit!!')
            return false
          }
        });
      }
    }
    /**
     * 保存用户信息
     */
    const handlerSaveUser = async () => {
      data.saveLoading = true
      const response = await api.addUser(data.userDialogForm)
      data.saveLoading = false
      if (response.code == 200) {
        // ElMessage.success(response.message);
        ElMessage.success("此版本新增用户无任何权限！！！");
        //刷新表格
        methods.onQuery()
        //关闭dialog
        data.userDailog = false
      } else {
        ElMessage.error(response.message);
      }

    }
    /**
     * 修改密码保存
     */
    const handlerSavePwd = async () => {
      data.saveLoading = true
      const params = {
        id: data.editUserId,
        password: data.passForm.agPwd + '',
        oldPwd: data.passForm.oldPwd + ''
      }
      const response = await api.editPwd(params)
      data.saveLoading = false
      if (response.code == 200) {
        //刷新表格
        methods.onQuery()
        //关闭dialog
        data.editPassDialog = false
      }
      ElMessage.info(response.message);
    }
    const handlerResetDialogForm = () => {
      nextTick(() => {
        userDialogRef.value.resetFields()
        data.saveLoading = false
      })
    }
    onMounted(() => {
      //查询用户数据
      methods.onQuery()

    })
    return {
      ...toRefs(data),
      ...methods,
      ...toRefs(userDialogRules),
      ...toRefs(pwdDialogRules),
      userDialogRef,
      passDialogRef
    }
  }
}
  </script>
  <style lang='scss' scoped></style>