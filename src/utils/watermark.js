export default function watermark(el) {
    const elRect = el.getBoundingClientRect()
    var wrap = document.createElement("div");//创建一个div
    wrap.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;min-height:1000px;pointer-events:none";//给div添加类名
    var wm = document.createElement("canvas");//单个水印画布
    wm.id = "watermark";//给canvas标签添加id
    wm.width = 180;//设置canvas宽
    wm.height = 100;//设置canvas高
    wm.style.display = "none";//设置画布隐藏属性
    wrap.appendChild(wm);//在div中添加画布
    var rwm = document.createElement("canvas");//重复绘制水印画布，用于整个页面
    rwm.id = "repeat-watermark";
    wrap.appendChild(rwm);
    el.appendChild(wrap);
    //绘制单个水印
    var cw = document.getElementById('watermark');
    var ctx = cw.getContext("2d");
    ctx.clearRect(0, 0, 100, 80);//清空矩形
    ctx.font = "25px 黑体";//设置字体
    ctx.rotate(-20 * Math.PI / 180);//逆时针旋转20度
    ctx.fillStyle = "rgba(100,100,100,0.1)";//填充透明度为0.2的灰色
    ctx.fillText("万万没想到集团", -20, 80);//
    //在另一个画布上重复绘制单个水印
    var crw = document.getElementById('repeat-watermark');
    crw.width = elRect.width;//设置画布宽度等于窗口显示宽度
    crw.height = Math.max(elRect.height, document.documentElement.clientHeight);//设置画布高度等于窗口显示高度
    var ctxr = crw.getContext("2d");
    ctxr.clearRect(0, 0, crw.width, crw.height);
    var pat = ctxr.createPattern(cw, "repeat");//在水平和垂直方向重复绘制单个水印
    ctxr.fillStyle = pat;
    ctxr.fillRect(0, 0, crw.width, crw.height);


    // const canvas = document.createElement("canvas");
    // canvas.style.cssText = "position:absolute;top:0;left:0;z-index:0"
    // const ctx = canvas.getContext("2d");
    // const img = new Image();
    // // 开启跨域
    // img.crossOrigin = 'anonymous';
    // img.src = "//gw.alicdn.com/bao/uploaded/i1/i1/2772080898/O1CN01NTDdW61IVKOBKtAyx_!!2-item_pic.png_220x10000.jpg_.webp";;
    // img.onload = function () {
    //     // canvas自适应图片的宽高
    //     canvas.width = document.documentElement.clientWidth
    //     canvas.height = document.documentElement.clientHeight

    //     // let pattern = ctx.createPattern(img, 'repeat');
    //     // // 将新创建的CanvasPattern对象赋值给fillStyle属性
    //     // ctx.fillStyle = pattern;

    //     // // ctx.translate(canvas.width, canvas.height); //设置画布上的(0,0)位置，也就是旋转的中心点
    //     // ctx.rotate(-15 * Math.PI / 180);

    //     // ctx.fillRect(0, 0, canvas.width * 2, canvas.height * 2)


    //     ctx.font = '25em'; // 设置字体大小
    //     // cans.fillStyle = 'rgb(250, 100, 105, 0.2)'; // 设置填充绘画的颜色、渐变或者模式
    //     ctx.fillStyle = 'rgb(0,0,0)'; // 设置填充绘画的颜色、渐变或者模式
    //     ctx.globalAlpha = 0.8; // 透明度
    //     ctx.textAlign = 'left'; // 设置文本内容的当前对齐方式
    //     ctx.textBaseline = 'Middle'; // 设置在绘制文本时使用的当前文本基线
    //     ctx.fillText("我是水印", 100, 100); // 输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置
    //     document.body.appendChild(canvas);
    // }

}

