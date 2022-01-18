import httpFetch from '@/utils/https'
/** 注册用户 */
export const addUser = (data = {}) => {
    return httpFetch.post('user/register', data)
}

/** 注册用户 */
export const updateUser = (data = {}) => {
    return httpFetch.post('user/update', data)
}

/** 用户列表 */
export const userList = (data = {}) => {
    return httpFetch.post('user/list', data)
}

/** 修改密码 */
export const editPwd = (data = {}, userId) => {
    return httpFetch.post('user/resetUserPassword', {}, {
        params: data
    })
}

/** 删除 */
export const deleteUser = (userId) => {
    return httpFetch.post('user/delete?id=' + userId)
}