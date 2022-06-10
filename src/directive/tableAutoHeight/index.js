import tableHeight from './table-height'

const install = function (Vue) {
    // 绑定v-adaptive指令
    Vue.directive('tableHeight', tableHeight)
}

// if (window.Vue) {
//     window['tableHeight'] = tableHeight
//     // eslint-disable-next-line no-undef
//     Vue.use(install)
// }

tableHeight.install = install

export default tableHeight
