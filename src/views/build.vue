<!--  -->
 <template>
  <div class="build-container">
    <img src="@/assets/img/78.8d70efa4.png" alt="" width="260">
    <span>开发中</span>
  </div>
</template>

  <script>

export default {
  setup(props, context) {

  },
}
  </script>
  <style lang='scss' scoped>
.build-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  span {
    display: inline-block;
    font-size: 30px;
    letter-spacing: 5px;
    text-indent: 5px;
    margin-top: 25px;
    color: #5297a4;
  }
}
</style>