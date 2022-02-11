<!--  -->
 <template>
  <div class="not-found-main">
    <div class="text-magic" data-word="你没有权限访问系统">
    </div>
    <div class="infos">
      请联系管理员添加权限
      <br> <br> <br>
      <p>
        <router-link to="/login" style="color:#ffffff">去登陆<el-icon style="vertical-align: middle;">
            <arrow-right-bold />
          </el-icon>
        </router-link>
      </p>
    </div>
  </div>
</template>
  <script setup>
console.log('%cQQ：1069722589', 'color:red')
</script>
  <style lang="scss" scoped>
.infos {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px 15px;
  box-sizing: border-box;
  text-align: center;
  font-size: 15px;
}
.not-found-main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 35px;
  color: #d9d9d9;
  background-color: #0e5093;
}
.text-magic {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 120px;
  font-size: 50px;
  text-align: center;
  color: transparent;
}

.text-magic::before {
  content: attr(data-word);
  position: absolute;
  top: 0;
  left: 0;
  height: 90px;
  width: 100%;
  color: red;
  overflow: hidden;
  z-index: 2;
  filter: contrast(200%);
  text-shadow: 1px 0 0 red;
  animation: move 0.95s infinite;
}

.text-magic::after {
  content: attr(data-word);
  position: absolute;
  top: 0;
  left: -1px;
  height: 36px;
  width: 100%;

  color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  z-index: 3;
  color: cyan;
  filter: contrast(200%);
  text-shadow: -1px 0 0 cyan;
  mix-blend-mode: lighten;
  animation: move 1.1s infinite -0.5s;
}

@keyframes move {
  10% {
    top: -0.4px;
    left: -1.1px;
  }

  20% {
    filter: hue-rotate(-90deg);
    top: 0.4px;
    left: -0.2px;
  }

  30% {
    filter: hue-rotate(0);
    left: 0.5px;
  }

  40% {
    top: -0.3px;
    left: -0.7px;
  }

  50% {
    filter: blur(1px);
    left: 0.2px;
  }

  60% {
    filter: blur(0);
    top: 1.8px;
    left: -1.2px;
  }

  70% {
    top: -1px;
    left: 0.1px;
  }

  80% {
    top: -0.4px;
    left: -0.9px;
  }

  90% {
    left: 1.2px;
  }

  100% {
    left: -1.2px;
  }
}
</style>