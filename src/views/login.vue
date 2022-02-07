<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">进销存管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="请输入用户名">
            <template #prepend>
              <el-icon>
                <user />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" show-password v-model="param.password"
            @keyup.enter="submitForm()">
            <template #prepend>
              <el-icon>
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" :loading="loginLoadign" @click="submitForm()">登录</el-button>
        </div>
        <el-form-item>
          <span style="color:#ffffff;font-size:20px">请使用最新google浏览器体验!!!</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <video poster="@/assets/video-cover.jpeg" loop autoplay muted class="login-video">
    <source src="@/assets/night.mp4">
  </video>
</template>

<script>
import { ref, reactive, toRaw } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
export default {
  setup() {
    const store = useStore();
    const param = reactive({
      username: "admin",
      password: "admin!@#$",
      // username: "",
      // password: "",
    });

    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
      ],
    };
    const login = ref(null);
    //登录loading
    const loginLoadign = ref(false)
    const submitForm = () => {
      login.value.validate(async (valid) => {
        if (valid) {
          loginLoadign.value = true
          await store.dispatch("doLogin", {
            username: param.username + '',
            password: param.password + ''
          })
          loginLoadign.value = false
        } else {
          return false;
        }
      });
    };


    store.commit("clearTags");

    return {
      param,
      rules,
      login,
      submitForm,
      loginLoadign
    };
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url(../assets/img/login-bg.jpg); */
  /* background-size: 100%; */
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgb(64, 158, 255, 0.5);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.login-video {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
</style>