<template>
  <div class="tag-box">
    <div class="tag-list">
      <ul ref="tagList" :style="{left: -nowLeft + 'px'}">
        <li v-for="(item, index) in list" :key="index" :ref="'li'+ index">
          <span class="tag" :class="{'tag-active': id === item.id}">
            {{ item.tag_name }}
          </span>
        </li>
      </ul>
    </div>
    <a-icon type="left" class="icon-lf" v-show="showLf" @click="handleLeft" />
    <a-icon type="right" class="icon-rt" v-show="showRt" @click="handleRight" />
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, nextTick } from 'vue'
export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const data = reactive({
      list: [
        { id: 0, tag_name: '全部' },
        { id: 1, tag_name: '其他1' },
        { id: 2, tag_name: '其他2其他2' },
        { id: 9, tag_name: '其他' },
        { id: 3, tag_name: '其他3其他3' },
        { id: 4, tag_name: '其他4其' },
        { id: 5, tag_name: '其他5' },
        { id: 6, tag_name: '其他6其他3' },
        { id: 7, tag_name: '其他7' },
        { id: 8, tag_name: '其他8' }
      ],
      id: 0,
      nowNum: 0, // 滚动了几次
      showLf: false, // 左侧按钮 显隐
      showRt: false, // 右侧按钮 显隐
      allWidth: 0, // 内容总宽
      nowLeft: 0,
      nowIndex: 0 // 显示部分的第一个index
    })

    const methods = {
      handleLeft() {
        if (this.nowLeft > 0) {
          this.nowNum--
          this.showRt = true
          if (this.nowNum > 0) {
            let nw = 0
            for (let j = this.list.length; j >= 0; j--) {
              if (j < this.nowIndex) {
                nw += this.$refs['li' + j][0].offsetWidth
                if (nw >= 220) {
                  nw -= this.$refs['li' + j][0].offsetWidth
                  this.nowLeft -= nw
                  this.nowIndex = j + 1
                  break
                }
              }
            }
          } else {
            this.nowLeft = 0
            this.nowIndex = 0
            this.showLf = false
          }
        }
      },
      handleRight() {
        if (this.nowLeft + 220 < this.allWidth) {
          this.nowNum++
          this.showLf = true
          let nw = 0
          for (let i = 0; i < this.list.length; i++) {
            if (i >= this.nowIndex) {
              nw += this.$refs['li' + i][0].offsetWidth
              if (nw > 220) {
                nw -= this.$refs['li' + i][0].offsetWidth
                this.nowLeft += nw
                this.nowIndex = i
                break
              }
            }
          }
          if (this.nowLeft + 220 >= this.allWidth) {
            this.showRt = false
          }
        }
      }
    }
    nextTick(() => {
      this.allWidth = proxy.$el.offsetWidth
      if (this.allWidth > 220) { // 220为固定宽度
        this.showRt = true
      }
    })
    return {
      ...toRefs(data),
      ...methods
    }
  }

}
</script>

<style lang="scss" scoped>
.tag-box {
  width: 260px;
  padding: 0 20px;
  height: 28px;
  position: relative;
  .tag-list {
    width: 220px;
    height: 100%;
    overflow: hidden;
    position: relative;
    ul {
      transition-duration: 0.3s;
      position: absolute;
      top: 0px;
      left: 0px;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: nowrap;
      li {
        white-space: nowrap;
        display: inline-block;
        white-space: nowrap;
        padding: 0 10px;
      }
      li:first-child {
        padding-left: 0;
      }
      li:last-child {
        padding-right: 0;
      }
    }
    .tag {
      cursor: pointer;
      display: inline-block;
      height: 28px;
      line-height: 28px;
      transition: border-color 0.2s;
      &:hover {
        color: #e72521;
      }
    }
    .tag-active {
      color: #e72521;
    }
  }
  .icon-lf {
    cursor: pointer;
    line-height: 28px;
    position: absolute;
    left: 5px;
    top: 2px;
  }
  .icon-rt {
    line-height: 28px;
    cursor: pointer;
    position: absolute;
    right: 5px;
    top: 2px;
  }
}
</style>