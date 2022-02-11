import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import "./style/main.css";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'
import '@/style/element.theme.scss'
import '@/style/system.scss'


//element图标
import * as ElIcons from '@element-plus/icons'

/**
 * 加载用户信息
 */
const userInfos = sessionStorage.getItem('erp')
userInfos && (store.state.userInfos = JSON.parse(userInfos));

// 指令
import vueDirective from '@/directive'

const app = createApp(App)
// element图标全局挂载
for (const name in ElIcons) {
    app.component(name, ElIcons[name])
}
app.use(store).use(router).use(ElementPlus, { locale }).use(vueDirective)
app.mount('#app')