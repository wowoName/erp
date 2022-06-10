import { useStore } from "vuex"
// 路由信息
import { routes } from '@/router'
// 菜单
let menu = [
    {
        icon: "homeFilled",
        index: "/",
        title: "系统主页",
    },
    {
        icon: "UserFilled",
        title: "用户管理",
        index: "userList",
        subs: [
            {
                icon: "User",
                index: "/user",
                title: "用户管理",
            },
            {
                icon: "Grid",
                index: "/performance",
                title: "销售业绩",
            }
        ]
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
        title: "供应商管理",
    },
    {
        icon: "SoldOut",
        index: "caigou",
        title: "采购管理",
        subs: [
            {
                icon: "List",
                index: "/purchaseManage",
                title: "采购申请",
            }
        ],
    },
    {
        icon: "Sell",
        index: "sell",
        title: "销售管理",
        subs: [
            {
                icon: "Sell",
                index: "/salesManage",
                title: "出库申请",
            }
        ],
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
    {
        icon: "DataAnalysis",
        index: "/logo",
        title: "登录日志"
    },
    {
        icon: "IceTea",
        index: "/instructions",
        title: "使用说明"
    }

];
export default () => {
    const store = useStore()
    // 获取当前用户
    const userInfos = store.state.userInfos;
    // 权限路由
    const authRoutes = routes[0].children;

    // 根据路由权限 过滤菜单
    const getAuthMenu = () => {
        (function getRenderMenu(menuData) {
            menuData.forEach(v => {
                const menuPath = v.index
                // 查找路由
                const menuRouters = authRoutes.find(ritem => ritem.path === menuPath)
                if (menuRouters) {
                    const routerAuth = menuRouters.meta.auth || []
                    const hasAuth = routerAuth.length > 0 ? routerAuth.some(vv => userInfos[vv]) : true;
                    v.visible = hasAuth
                } else if (Reflect.has(v, 'subs')) {
                    getRenderMenu(v.subs)
                    // 子级不显示上级菜单也不显示
                    v.visible = v.subs.some(vchild => vchild.visible)
                } else {
                    v.visible = true
                }
            })
        })(menu);

        return menu
    }

    return {
        getAuthMenu
    }
}