import { addResizeListener, removeResizeListener } from 'element-plus/lib/utils/resize-event'

// 设置表格高度
const doResize = async (el, binding, vnode) => {
    if (!el.parentNode) return
    // 获取表格Dom对象
    const tableElement = vnode.el;
    const scrollBody = tableElement.querySelector('.el-table__body-wrapper')

    const tableHeaderRect = tableElement.querySelector('.el-table__header-wrapper').getBoundingClientRect()
    // 获取距底部距离（用于展示页码等信息）
    const { value } = binding
    const bottomOffset = (value && value.bottomOffset) || 30

    // 是否分页
    const paginationEle = el.parentNode.querySelector('.el-pagination')
    let paginationHeight = 0;
    if (paginationEle) {
        paginationHeight = paginationEle.getBoundingClientRect().height
    }
    // 计算列表高度并设置
    const height = document.documentElement.clientHeight - el.getBoundingClientRect().top - bottomOffset - paginationHeight

    tableElement.style.maxHeight = height + 'px'
    scrollBody.style.maxHeight = height - tableHeaderRect.height + 'px'
    setTimeout(() => {
        tableElement.classList.add('el-table--scrollable-y')
    })
}


export default function registerDirective(app) {
    app.directive('tableHeight', {
        // 初始化设置
        mounted(el, binding, vnode) {
            // 设置resize监听方法
            el.resizeListener = async () => {
                await doResize(el, binding, vnode)
            }
            // 绑定监听方法到addResizeListener
            addResizeListener(window.document.body, el.resizeListener)
        },
        async updated(el, binding, vnode) {
            await doResize(el, binding, vnode)
        },
        /*  // 绑定默认高度
         async created(el, binding, vnode) {
             await doResize(el, binding, vnode)
         }, */
        // // 销毁时设置
        unmounted(el) {
            // 移除resize监听
            removeResizeListener(el, el.resizeListener)
        }
    })
}
