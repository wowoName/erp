<template>
  <div class="sidebar">

    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
      text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.visible">
          <!-- 子级模块 -->
          <template v-if="item.subs">
            <el-sub-menu :index="item.index" :key="item.index">
              <template #title>
                <el-icon>
                  <component :is="item.icon" />
                </el-icon>
                <span>{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <template v-if="subItem.visible">
                  <el-sub-menu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                    <template #title>{{ subItem.title }}</template>
                    <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                      {{threeItem.title}}
                    </el-menu-item>
                  </el-sub-menu>
                  <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                    <el-icon>
                      <component :is="subItem.icon" />
                    </el-icon>
                    {{ subItem.title }}
                  </el-menu-item>
                </template>

              </template>
            </el-sub-menu>

          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <!-- <i class="el-icon-location"></i> -->
              <template #title>{{ item.title }}</template>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>

  </div>
</template>

  <script setup>
import { computed, readonly } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import menuMixin from '@/mixin/menu.js'
const { getAuthMenu } = menuMixin();
const items = getAuthMenu()
const route = useRoute();

const onRoutes = computed(() => {
  return route.path;
});

const store = useStore();
const collapse = computed(() => store.state.collapse);
</script>

<style scoped lang="scss">
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  background-color: #324157;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
</style>
