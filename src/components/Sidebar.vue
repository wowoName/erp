<template>
  <div class="sidebar">

    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
      text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index">
            <template #title>
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
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
    </el-menu>

  </div>
</template>

<script>
import { computed, readonly } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  setup() {
    const items = readonly([
      {
        icon: "homeFilled",
        index: "/",
        title: "系统主页",
      },
      {
        icon: "User",
        index: "/user",
        title: "用户管理",
      },
      {
        icon: "UserFilled",
        title: "客户管理",
        index: "customerCom",
        subs: [
          {
            icon: "List",
            index: "/customer",
            title: "客户管理",
          },
          {
            icon: "Grid",
            index: "/customerAnalysis",
            title: "购买统计",
          }
        ]
      },
      {
        icon: "Goods",
        index: "/category",
        title: "商品管理"
      },
      {
        icon: "Shop",
        index: "/specie",
        title: "批次管理"
      }, {
        icon: "Coin",
        index: "/unitManager",
        title: "单位管理"
      }, {
        icon: "OfficeBuilding",
        index: "/repoManager",
        title: "仓库管理"
      },
      {
        icon: "Van",
        index: "/supplierManage",
        title: "供应商管理"
      },
      {
        icon: "SoldOut",
        index: "7",
        title: "入库管理",
        subs: [
          {
            icon: "List",
            index: "/grnManage",
            title: "入库管理",
          },
          {
            icon: "Grid",
            index: "/grnTotal",
            title: "入库统计",
          },
          {
            icon: "Grid",
            index: "/grnSumarry",
            title: "入库总汇",
          },
        ],
      },
      {
        icon: "Sell",
        index: "8",
        title: "出库管理",
        subs: [
          {
            index: "/outboundManage",
            title: "出库管理",
          }, {
            index: "/outboundTotal",
            title: "出库统计",
          },
          {
            index: "/outboundSumarry",
            title: "出库汇总",
          },
        ],
      },
      {
        icon: "Collection",
        index: "/inventory",
        title: "库存盘点"
      },
    ]);

    const route = useRoute();

    const onRoutes = computed(() => {
      return route.path;
    });

    const store = useStore();
    const collapse = computed(() => store.state.collapse);

    return {
      items,
      onRoutes,
      collapse,
    };
  },
};
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
