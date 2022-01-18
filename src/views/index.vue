<template>
  <div class="about">
    <v-header />
    <v-sidebar />
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <v-tags></v-tags>
      <div class="content">
        <Suspense>
          <template #default>
            <router-view v-slot="{ Component,route }">
              <!-- <transition name="move" mode="out-in"> -->
              <!-- <keep-alive :include="tagsList"> -->
              <component :is="Component" :key="route.name" />
              <!-- </keep-alive> -->
              <!-- </transition> -->
            </router-view>
          </template>
          <template #fallback> 加载中... </template>
        </Suspense>
        <!-- <el-backtop target=".content"></el-backtop> -->
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
import vHeader from "../components/Header.vue";
import vSidebar from "../components/Sidebar.vue";
import vTags from "../components/Tags.vue";
import "@/style/color-dark.css";
export default {
  name: 'index',
  components: {
    vHeader,
    vSidebar,
    vTags,
  },
  setup() {
    const store = useStore();
    const tagsList = computed(() =>
      store.state.tagsList.map((item) => item.name)
    );
    const collapse = computed(() => store.state.collapse);
    return {
      tagsList,
      collapse,
    };
  },
};
</script>
<style lang="scss" scoped>
.move-enter-active,
.move-leave-active {
  transition: opacity 0.1s ease;
}

.move-enter-from,
.move-leave-to {
  opacity: 0;
}
.content {
  // background-color: #f0f2f5;
}
</style>
