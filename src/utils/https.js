import axios from "axios";
import { ElMessage } from 'element-plus'
import router from '@/router'
//第一个匹配到的 url地址
console.log(process.env)
let targets = Object.keys(process.env).filter(v => v.includes('VUE_APP_URL'))[0]
let proxys = targets.split('_').pop();
console.log('========ajax============');
console.log(process.env[targets], proxys)
const httpRequest = axios.create({
    timeout: 10000, // 请求超时时间
    baseURL: process.env.NODE_ENV === 'production' ? process.env[targets] + "/" : "/" + (proxys.toLowerCase()),//
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        "token": "AZIUYHGDR145LHG",
    },
});
// httpRequest.interceptors.request.use(response => {
//     return response
// }, error => {
//     console.log('错误')
// })
/**
 * 响应拦截
 */
httpRequest.interceptors.response.use(response => {
    /**
     * 200 203 是错误信息
     * 其他为系统错误
     */
    if (response.data.code === 401) {
        // ElMessage({
        //     showClose: true,
        //     message: '你没有权限',
        //     type: 'error',
        // })
        // router.push('/403')
        return response.data//Promise.reject(response.data)
    } else if (response.data.code === 8888) {
        router.push('/login')
    }
    // 301 参数缺失
    else if (![200, 203, 301].includes(response.data.code) || response.status !== 200) {
        ElMessage({
            showClose: true,
            message: '系统错误，请刷新重试',
            type: 'error',
        })
        return Promise.reject(response.data)
    }
    return response.data
}, error => {
    console.log('系统错误--', error)
    return Promise.reject(error)
});
const api = {
    get(url, data, config) {
        return httpRequest.get(url, { params: data }, config)
    },
    post(url, data, config) {
        return httpRequest.post(url, data, config)
    },
}
export default api;