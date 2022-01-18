<template>
  <div class="tags" v-if="showTags">
    <!-- <ul>
      <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
        <router-link :to="item.path" class="tags-li-title">{{item.title}}</router-link>
        <span class="tags-li-icon" @click="closeTags(index)" v-if="item.name!=='home'">
          <el-icon>
            <close-bold />
          </el-icon>
        </span>
      </li>
    </ul> -->
    <div class="route-tag-con">
      <el-tabs v-model="editableTabsValue" class="header-tabs" @tab-remove="closeTags">
        <el-tab-pane v-for="item in tagsList" :closable="item.name!=='home'" :key="item.title"
          :class="{'item-home':item.name==='home'}" :label="item.title" :name="item.name">
          <template #label>
            <router-link :to="item.path" class="tags-li-title">{{item.title}}</router-link>

            <el-icon v-if="item.name=='home'" style="vertical-align: middle;">
              <coffee-cup />
            </el-icon>

          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini">
          操作
          <el-icon>
            <arrow-down-bold />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isActive = (path) => {
      return path === route.fullPath;
    };

    const editableTabsValue = computed(() => route.name)

    const store = useStore();
    const tagsList = computed(() => store.state.tagsList);
    const showTags = computed(() => tagsList.value.length > 0);
    console.log(tagsList, "===============")

    /**
     * 关闭单个标签 
     */
    const closeTags = tabName => {
      const index = tagsList.value.findIndex(v => v.name === tabName)
      if (!~index) return;
      const delItem = tagsList.value[index];
      store.commit("delTagsItem", { index });
      const item = tagsList.value[index]
        ? tagsList.value[index]
        : tagsList.value[index - 1];
      if (item) {
        delItem.path === route.fullPath && router.push(item.path);
      } else {
        router.push("/");
      }
    };

    // 设置标签
    const setTags = (route) => {
      const isExist = tagsList.value.some((item) => {
        return item.path === route.fullPath;
      });
      if (!isExist) {
        // if (tagsList.value.length >= 8) {
        //   store.commit("delTagsItem", { index: 0 });
        // }
        store.commit("setTagsItem", {
          name: route.name,
          title: route.meta.title,
          path: route.fullPath,
        });
      }
    };
    /**
     * 设置标签
     */
    setTags(route);
    onBeforeRouteUpdate((to) => {
      console.log("路由更新：", to)
      setTags(to);
    });

    // 关闭全部标签
    const closeAll = () => {
      store.commit("clearTags");
      router.push("/");
    };
    // 关闭其他标签
    const closeOther = () => {
      const curItem = tagsList.value.filter((item) => {
        return item.path === route.fullPath || item.path === '/';
      });
      store.commit("closeTagsOther", curItem);
    };
    const handleTags = (command) => {
      command === "other" ? closeOther() : closeAll();
    };

    // 关闭当前页面的标签页
    // store.commit("closeCurrentTag", {
    //     $router: router,
    //     $route: route
    // });

    return {
      isActive,
      tagsList,
      showTags,
      closeTags,
      handleTags,
      editableTabsValue
    };
  },
};
</script>


<style scoped lang="scss">
::v-deep .header-tabs {
  height: 30px;

  .el-tabs__nav {
    // display: flex;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 30px;
  }

  .el-tabs__item {
    height: 23px;
    padding: 0 5px 0 12px !important;
    background: #f8f8f8;
    border: 1px solid #e9eaec;
    background: #fff;
    line-height: 23px;
    margin: 4px 5px 2px 3px;
    border-radius: 3px;
    font-size: 12px;
    // min-width: 120px;
    &:nth-child(0) {
      color: red !important;
      .el-icon {
        display: none !important;
      }
    }
  }
  .el-tabs__nav-wrap {
    &::after {
      content: "";
      background-color: transparent;
    }
  }
  .el-tabs__active-bar {
    display: none;
  }
  .is-active {
    border: 1px solid #409eff;
    background-color: #409eff;
    color: #ffffff;
    a {
      color: #ffffff;
    }
  }
}
.tags {
  position: relative;
  // height: 30px;
  overflow: hidden;
  background: #fff;
  padding-right: 120px;
  box-shadow: 0 5px 10px #ddd;
}

.tags .route-tag-con {
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
</style>
