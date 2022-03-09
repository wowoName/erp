<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <!-- <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i> -->
      <el-icon>
        <component :is="collapse?'Expand':'Fold'" />
      </el-icon>
    </div>
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
            {{userName}}
            <i class="el-icon-caret-bottom"></i>
          </span>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-icon color="#ffffff" class="header-setting" @click="drawer=true">
      <setting />
    </el-icon>

    <!-- 主题色 -->
    <el-drawer v-model="drawer" title="设置">
      <el-form :label-width="130">
        <el-form-item label="导航栏背景色：">
          <el-color-picker v-model="defaultThemeColor" @change="changeThemeStyle" />
        </el-form-item>
        <el-form-item label="导航栏字体颜色：">
          <el-color-picker v-model="defaultThemeFontColor" @change="changeThemeFontStyle" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>

</template>
<script>
import { computed, onMounted, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { logout } from '@/api/login'
import { colorRgb } from '@/utils'
export default {
  setup() {
    const data = reactive({
      drawer: false,
      defaultThemeColor: '#242f42',
      defaultThemeFontColor: '#bfcbd9'
    })
    const store = useStore();
    console.log(store.state.userInfos)
    const collapse = computed(() => store.state.collapse);
    const userName = computed(() => store.state.userInfos.name);
    // 侧边栏折叠
    const collapseChage = () => {
      store.commit("handleCollapse", !collapse.value);
    };

    onMounted(() => {
      if (document.body.clientWidth < 1500) {
        collapseChage();
      }
    });

    // 用户名下拉菜单选择事件
    const router = useRouter();
    const handleCommand = async (command) => {
      if (command == "loginout") {

        await logout()
        router.push("/login");
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
