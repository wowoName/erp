import { createStore } from 'vuex'
import { login } from '@/api/login'
import router from '@/router'
import { ElMessage, ElLoading } from "element-plus";


export default createStore({
  state: {
    tagsList: [{
      title: '系统主页',
      path: '/',
      name: 'home'
    }],
    collapse: false,
    userInfos: null
  },
  mutations: {
    /**
     * 设置当前登录用户信息
     * @param {*} state 
     * @param {*} data 
     */
    SET_USE_INFOS(state, data) {
      state.userInfos = data
    },
    delTagsItem(state, data) {
      state.tagsList.splice(data.index, 1);
    },
    setTagsItem(state, data) {
      state.tagsList.push(data)
    },
    clearTags(state) {
      state.tagsList = []
    },
    closeTagsOther(state, data) {
      state.tagsList = data;
    },
    closeCurrentTag(state, data) {
      for (let i = 0, len = state.tagsList.length; i < len; i++) {
        const item = state.tagsList[i];
        if (item.path === data.$route.fullPath) {
          if (i < len - 1) {
            data.$router.push(state.tagsList[i + 1].path);
          } else if (i > 0) {
            data.$router.push(state.tagsList[i - 1].path);
          } else {
            data.$router.push("/");
          }
          state.tagsList.splice(i, 1);
          break;
        }
      }
    },
    // 侧边栏折叠
    handleCollapse(state, data) {
      state.collapse = data;
    }
  },
  actions: {
    doLogin({ commit }, value) {
      const loadingInstance = ElLoading.service({
        lock: true,
        text: '登录中',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      return new Promise(async (resolve) => {
        let loginResult = await login(value).finally(() => {
          loadingInstance.close()
        })
        //登录成功保存用户信息
        if (loginResult.code === 200) {
          //情况用户信息
          sessionStorage.setItem('erp', JSON.stringify(loginResult.message))
          commit('SET_USE_INFOS', loginResult.message)
          router.push("/");
        } else {
          ElMessage.error(loginResult.message)
        }
        resolve(loginResult)
      })
    }
  },
  modules: {}
})