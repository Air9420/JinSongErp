/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-03 17:22:28
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-13 05:02:58
 * @FilePath: \my-vue-app\src\router\indes.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
// 全局存储
import { useUserInfo } from "../stores/counter";
const AppName = "劲松电器进销存管理系统";
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "Home",
      meta: {
        title: `${AppName}-首页`,
        permission: ["admin", "user"],
      },
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/Login",
      name: "Login",
      meta: {
        title: `${AppName}-微信扫码登录`,
        permission: ["tourist"],
      },
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/Goods",
      name: "Goods",
      meta: {
        title: `${AppName}-商品和规格管理`,
        permission: ["admin", "user"],
      },
      component: () => import("../views/GoodsView.vue"),
    },
    {
      path: "/PrintBillView",
      name: "PrintBillView",
      meta: {
        title: `${AppName}-打印账单`,
        permission: ["admin", "user"],
      },
      component: () => import("../views/PrintBillView.vue"),
    },
    {
      path: "/CategoryAdmin",
      name: "CategoryAdmin",
      meta: {
        title: `${AppName}-类目管理`,
        permission: ["admin", "user"],
      },
      component: () => import("../views/CategoryAdmin.vue"),
    },
  ],
});

router.beforeEach((to: any, from: any, next) => {
  const userInfo = useUserInfo();
  window.document.title = to.meta.title;

  if (to.meta.permission?.includes(userInfo?.userInfo?.role)) {
    next();
  } else {
    if (to.name != "Login") return next({ name: "Login" });
    next();
  }
});

export default router;
