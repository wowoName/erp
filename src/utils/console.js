/**
 * 禁止打开控制台
 */
window.onkeydown = window.onkeyup = window.onkeypress = function (event) {
    // 判断是否按下F12，F12键码为123 
    if (event.keyCode === 123) {
        event.preventDefault(); // 阻止默认事件行为  
        window.event.returnValue = false;
    }
}
// 为右键添加自定义事件，可以禁用  
window.oncontextmenu = function (event) {
    event.preventDefault(); // 阻止默认事件行为  
    return false;
}
var threshold = 160; // 打开控制台的宽或高阈值  
// 每秒检查一次  
window.setInterval(function () {
    if (window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold) {
        window.open("", "_self").close()
        window.open("about:blank", "_self").close()
        window.close()
    }
}, 1e3);