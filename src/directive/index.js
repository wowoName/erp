
/**
 * 自定义指令之 数字逗号分隔    
 */
export default function registerDirective(app) {
    app.directive('num-split', {
        created(el, binding) {
            numFormat(el, binding)
        },
        updated(el, binding) {
            numFormat(el, binding)
        }
    })
}

function numFormat(el, binding) {
    const bindingValue = binding.value || 0
    el.innerHTML = bindingValue.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}