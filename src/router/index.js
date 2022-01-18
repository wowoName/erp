import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
const routes = [
  {
    path: '/',
    name: 'index',
    meta: {
      title: '系统主页',
    },
    component: () => import(/* webpackChunkName: "index" */ '../views/index.vue'),
    children: [{
      path: '/',
      name: 'home',
      meta: {
        title: '系统主页',
      },
      component: () => import(/* webpackChunkName: "home" */ '../views/home.vue')
    }, {
      path: '/user',
      name: 'user',
      meta: {
        title: '用户管理',
      },
      component: () => import(/* webpackChunkName: "user" */ '../views/user.vue')
    }, {
      path: '/customer',
      name: 'customer',
      meta: {
        title: '客户管理',
      },
      component: () => import(/* webpackChunkName: "customer" */ '../views/customer.vue')
    }, {
      path: '/customerAnalysis',
      name: 'customerAnalysis',
      meta: {
        title: '客户购买行为统计',
      },
      component: () => import(/* webpackChunkName: "customer" */ '../views/customerAnalysis.vue')
    }, {
      path: '/category',
      name: 'category',
      meta: {
        title: '商品管理',
      },
      component: () => import(/* webpackChunkName: "category" */ '../views/category.vue')
    }, {
      path: '/specie',
      name: 'specie',
      meta: {
        title: '批次管理',
      },
      component: () => import(/* webpackChunkName: "specie" */ '../views/specie.vue')
    }, {
      path: '/unitManager',
      name: 'unitManager',
      meta: {
        title: '单位管理',
      },
      component: () => import(/* webpackChunkName: "uit" */ '../views/unit.vue')
    }, {
      path: '/repoManager',
      name: 'repoManager',
      meta: {
        title: '仓库管理',
      },
      component: () => import(/* webpackChunkName: "repo" */ '../views/repo.vue')
    }, {
      path: '/supplierManage',
      name: 'supplierManage',
      meta: {
        title: '供应商管理',
      },
      component: () => import(/* webpackChunkName: "supplier" */ '../views/supplier.vue')
    }, {
      path: '/grnManage',
      name: 'grnManage',
      meta: {
        title: '入库管理',
      },
      component: () => import(/* webpackChunkName: "grnManage" */ '../views/grnManage.vue')
    }, {
      path: '/grnTotal',
      name: 'grnTotal',
      meta: {
        title: '入库统计',
      },
      component: () => import(/* webpackChunkName: "grnTotal" */ '../views/grnTotal.vue')
    }, {
      path: '/grnSumarry',
      name: 'grnSumarry',
      meta: {
        title: '入库总汇',
      },
      component: () => import(/* webpackChunkName: "grnSumarry" */ '../views/grnSumarry.vue')
    }, {
      path: '/outboundManage',
      name: 'outboundManage',
      meta: {
        title: '出库管理',
      },
      component: () => import(/* webpackChunkName: "outboundManage" */ '../views/outboundManage.vue')
    }, {
      path: '/outboundSumarry',
      name: 'outboundSumarry',
      meta: {
        title: '出库汇总',
      },
      component: () => import(/* webpackChunkName: "outboundSumarry" */ '../views/outboundSumarry.vue')
    }, {
      path: '/outboundTotal',
      name: 'outboundTotal',
      meta: {
        title: '出库统计',
      },
      component: () => import(/* webpackChunkName: "outboundTotal" */ '../views/outboundTotal.vue')
    }, {
      path: '/inventory',
      name: 'inventory',
      meta: {
        title: '库存盘点',
      },
      component: () => import(/* webpackChunkName: "inventory" */ '../views/inventory.vue')
    }]
  },

  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue')
  },

  {
    path: '/403',
    name: '403',
    meta: {
      title: '403',
    },
    component: () => import(/* webpackChunkName: "error" */ '../views/403.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "error" */ '../views/404.vue'),
    meta: {
      title: '404',
    },
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

//添加守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  const role = store.state.userInfos
  if (!role && to.path !== '/login') {
    next('/login');
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === 'admin' ? next() : next('/403');
  } else {
    next();
  }
});

export default router
