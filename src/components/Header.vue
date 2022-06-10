<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <!-- <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i> -->
      <el-icon>
        <component :is="collapse ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
    <!-- 【Q:1069722589】 -->
    <div class="logo">进销存管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../assets/img/baby.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userName }}
            <i class="el-icon-caret-bottom"></i>
          </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item divided command="editInfo"
                >修改信息</el-dropdown-item
              >
              <el-dropdown-item divided command="loginout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-icon color="#ffffff" class="header-setting" @click="drawer = true">
      <setting />
    </el-icon>

    <!-- 主题色 -->
    <el-drawer v-model="drawer" title="设置">
      <el-form :label-width="130">
        <el-form-item label="导航栏背景色：">
          <el-color-picker
            v-model="defaultThemeColor"
            @change="changeThemeStyle"
          />
        </el-form-item>
        <el-form-item label="导航栏字体颜色：">
          <el-color-picker
            v-model="defaultThemeFontColor"
            @change="changeThemeFontStyle"
          />
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 修改用户信息 -->
    <el-dialog
      v-model="userDailog"
      width="500px"
      title="修改用户信息"
      :before-close="resetDialogForm"
    >
      <el-form
        size="small"
        ref="passDialogRef"
        :label-width="100"
        :model="userDialogForm"
        :rules="userDialogFormRules"
        class="demo-form-inline"
      >
        <el-form-item label="用户姓名：" prop="name">
          <el-input
            v-model="userDialogForm.name"
            clearable
            placeholder="请输入用户姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户手机：" prop="phone">
          <el-input
            v-model="userDialogForm.phone"
            clearable
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="旧密码：&emsp;" prop="oldPwd">
          <el-input
            v-model="userDialogForm.oldPwd"
            autocomplete="off"
            clearable
            show-password
            placeholder="请输入密码"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="新密码：&emsp;" prop="newPwd">
          <el-input
            v-model="userDialogForm.newPwd"
            autocomplete="off"
            clearable
            show-password
            placeholder="请再次输入密码"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="agPwd">
          <el-input
            v-model="userDialogForm.agPwd"
            autocomplete="off"
            clearable
            show-password
            placeholder="请再次输入密码"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="role">
          <el-radio-group v-model="userDialogForm.role">
            <el-radio-button label="guanli">管理员</el-radio-button>
            <el-radio-button label="caigou">采购员</el-radio-button>
            <el-radio-button label="lingshou">销售员</el-radio-button>
            <el-radio-button label="cangku">仓库管理员</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="userDailog = false">关闭</el-button>
          <el-button
            size="small"
            :loading="saveLoading"
            type="primary"
            @click="saveEditPwd()"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { computed, reactive, toRefs, ref, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { logout } from '@/api/login'
import { colorRgb } from '@/utils'
import * as api from '@/api/user.js'
import { ElMessage, ElLoading } from "element-plus";

export default {
  setup() {
    const validatePassEdit = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (data.userDialogForm.agPwd !== '') {
          passDialogRef.value.validateField('agPwd');
        }
        callback();
      }

    };
    const validatePassEdit2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== data.userDialogForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const data = reactive({
      drawer: false,
      defaultThemeColor: '#242f42',
      defaultThemeFontColor: '#bfcbd9',
      userDailog: false,
      saveLoading: false,
      userDialogForm: {
        name: '',
        phone: '',
        oldPwd: '',
        newPwd: '',
        agPwd: '',
        role: 'guanli',
      },
      userDialogFormRules: {
        name: [{
          required: true, message: '请输入用户姓名', trigger: 'blur',
        }],
        phone: [
          { required: true, message: '请输入手机号', trigger: "blur" },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '手机号码格式错误', trigger: "blur" }
        ],
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
    const passDialogRef = ref();

    const store = useStore();
    console.log(store.state.userInfos)
    const collapse = computed(() => store.state.collapse);
    const userName = computed(() => store.state.userInfos.name);
    // 侧边栏折叠
    const collapseChage = () => {
      store.commit("handleCollapse", !collapse.value);
    };

    const resetDialogForm = (done) => {
      data.saveLoading = false
      data.userDailog = true;
      done()
    }
    /**
     * 修改用户信息保存
     */
    const saveEditPwd = () => {
      passDialogRef.value.validate((valid) => {
        if (valid) {
          handlerSavePwd()
        } else {
          console.log('error submit!!')
          return false
        }
      });
    }
    const handlerSavePwd = async () => {
      data.saveLoading = true
      const userInfo = store.getters['userInfos']
      const params = {
        guanli: false,
        caigou: false,
        lingshou: false,
        cangku: false,
        id: userInfo.id,
        password: data.userDialogForm.agPwd + '',
        oldPwd: data.userDialogForm.oldPwd + '',
        name: data.userDialogForm.name,
        phone: data.userDialogForm.phone,
      }
      // 当前选择的角色
      const currentRole = data.userDialogForm.role;
      params[currentRole] = true

      const response = await api.editUserInfos(params)
      data.saveLoading = false
      if (response.code == 200) {
        //关闭dialog
        data.editPassDialog = false
        ElMessage.success(response.message);
        // 重新登录
        router.push("/login");
      } else {
        ElMessage.error(response.message);
      }

    }
    onMounted(() => {
      if (document.body.clientWidth < 1500) {
        collapseChage();
      }
    });

    // 用户名下拉菜单选择事件
    const router = useRouter();
    const handleCommand = async (command) => {
      if (command === "loginout") {
        await logout()
        router.push("/login");
      } else if (command === 'editInfo') { // 修改个人信息
        // 获取存储的个人信息
        const userInfo = store.getters['userInfos']
        data.userDailog = true
        nextTick(() => {
          passDialogRef.value.resetFields()
          data.userDialogForm.name = userInfo.name
          data.userDialogForm.phone = userInfo.phone
          // 当前用户角色 caigou 、cangku、guanli、lingshou、xiaoshou
          const role = Object.keys(userInfo).filter(v => typeof userInfo[v] === 'boolean' && userInfo[v])
          data.userDialogForm.role = role.length ? role[0] : 'guanli'
        })
      }
    };
    /**
     * 主题色 color Picker
     */
    const changeThemeStyle = color => {
      let root = document.querySelector(":root");
      const opacityColor = colorRgb(color, 0.8)
      const activeMenuItem = colorRgb(color, 0.3)
      root.style.setProperty("--sliderColor", color);
      root.style.setProperty("--activeMenuItem", activeMenuItem);
      root.style.setProperty("--themeColor", opacityColor);
    }
    /**
     * 主题色 字体
     */
    const changeThemeFontStyle = color => {
      let root = document.querySelector(":root");
      root.style.setProperty("--sliderFont", color);
      root.style.setProperty("--el-menu-text-color", color);
    }


    return {
      ...toRefs(data),
      userName,
      collapse,
      passDialogRef,
      saveEditPwd,
      collapseChage,
      handleCommand,
      changeThemeStyle,
      changeThemeFontStyle
    };
  },
};
</script>
<style scoped  lang="scss">
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.header-setting {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  // width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
  cursor: pointer;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
