<template>
  <div class="s-canvas" @click="reset()">
    <canvas
      id="s-canvas"
      :width="contentWidth"
      :height="contentHeight"
    ></canvas>
  </div>
</template>
<script >
import { reactive, onMounted, toRefs } from 'vue'
export default {
  name: "SIdentify",
  props: {
    fontSizeMin: {
      type: Number,
      default: 16
    },
    fontSizeMax: {
      type: Number,
      default: 40
    },
    backgroundColorMin: {
      type: Number,
      default: 180
    },
    backgroundColorMax: {
      type: Number,
      default: 240
    },
    colorMin: {
      type: Number,
      default: 50
    },
    colorMax: {
      type: Number,
      default: 160
    },
    lineColorMin: {
      type: Number,
      default: 40
    },
    lineColorMax: {
      type: Number,
      default: 180
    },
    dotColorMin: {
      type: Number,
      default: 0
    },
    dotColorMax: {
      type: Number,
      default: 255
    },
    contentWidth: {
      type: Number,
      default: 100
    },
    contentHeight: {
      type: Number,
      default: 38
    }
  },
  setup(props) {
    const data = reactive({
      identifyCode: "",
      contentWidth: props.contentWidth,
      contentHeight: props.contentHeight
    })
    const methods = {
      // 生成一个随机数
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      // 生成一个随机的颜色
      randomColor(min, max) {
        let r = this.randomNum(min, max);
        let g = this.randomNum(min, max);
        let b = this.randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
      },
      drawPic() {
        data.identifyCode = (Math.random() * (36 - 1) + 1).toString(32).substring(5, 9);
        let canvas = document.getElementById("s-canvas");
        let ctx = canvas.getContext("2d");
        ctx.textBaseline = "bottom";
        // 绘制背景
        ctx.fillStyle = this.randomColor(
          props.backgroundColorMin,
          props.backgroundColorMax
        );
        ctx.fillRect(0, 0, data.contentWidth, data.contentHeight);
        // 绘制文字
        for (let i = 0; i < data.identifyCode.length; i++) {
          this.drawText(ctx, data.identifyCode[i], i);
        }
        //   this.drawLine(ctx);
        this.drawDot(ctx);
      },
      drawText(ctx, txt, i) {
        ctx.fillStyle = this.randomColor(props.colorMin, props.colorMax);
        ctx.font = "30px SimHei";
        let x = (i + 1) * (data.contentWidth / (data.identifyCode.length + 2));
        let y = data.contentHeight; //this.randomNum(this.fontSizeMax, this.contentHeight - 5);
        // var deg = this.randomNum(-45, 45)
        // 修改坐标原点和旋转角度
        ctx.translate(x, y);
        // ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0);
        // 恢复坐标原点和旋转角度
        // ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y);
      },
      drawLine(ctx) {
        // 绘制干扰线
        for (let i = 0; i < 2; i++) {
          ctx.strokeStyle = this.randomColor(
            props.lineColorMin,
            props.lineColorMax
          );
          ctx.beginPath();
          ctx.moveTo(
            this.randomNum(0, data.contentWidth),
            this.randomNum(0, data.contentHeight)
          );
          ctx.lineTo(
            this.randomNum(0, data.contentWidth),
            this.randomNum(0, data.contentHeight)
          );
          ctx.stroke();
        }
      },
      drawDot(ctx) {
        // 绘制干扰点
        for (let i = 0; i < 15; i++) {
          ctx.fillStyle = this.randomColor(0, 255);
          ctx.beginPath();
          ctx.arc(
            this.randomNum(0, data.contentWidth),
            this.randomNum(0, data.contentHeight),
            1,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      }
    }
    const reset = () => {
      methods.drawPic();
    }
    onMounted(() => {
      methods.drawPic();
    })
    return {
      reset,
      ...toRefs(data)
    }
  }
};
</script>
<style lang="scss"  scoped>
.s-canvas {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 5px;
}
</style>