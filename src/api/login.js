import httpFetch from '@/utils/https'
/** 登录 */
export const login = (data = {}) => {
    return httpFetch.post('user/login', data, {
        params: data
    })
}
/** 注册用户 */
export const register = (data = {}) => {
    return httpFetch.post('user/register?username=' + data.username + '&password=' + data.password, data)
}

// 退出登录
export const logout = (data = {}) => {
    return httpFetch.post('user/logout', data)
}
