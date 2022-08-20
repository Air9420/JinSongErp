<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-02 23:47:09
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-13 06:48:31
 * @FilePath: \my-vue-app\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="AppView">
    <!-- 顶部导航栏 -->
    <header class="headerView" v-show="router?.currentRoute?.name != 'Login'">
      <el-page-header
        icon=""
        @back="1"
        :title="header.title"
        content="劲松电器进销存管理系统"
      ></el-page-header>
      <el-button
        type=""
        color="rgb(51,126,204)"
        size="default"
        icon="CircleClose"
        round
        @click="logOut"
        >退出登录</el-button
      >
    </header>
    <div class="contentView">
      <el-menu
        :default-active="menuOption.defaultActive"
        :default-openeds="defaultOpeneds"
        class="menuView"
        :style="{
          width: router?.currentRoute?.name != 'Login' ? '200px' : '0px',
        }"
        :router="true"
      >
        <component is="el-menu-item" />
        <template v-for="(i, index) in menuOption.items" :key="index">
          <el-menu-item
            v-if="i.componentName == 'el-menu-item'"
            :index="i.path"
            @click="menuClickHandle(i)"
          >
            <template #title>
              <el-icon><component :is="i.icon" /></el-icon>
              <span>{{ i.name }}</span>
            </template>
          </el-menu-item>
          <el-sub-menu index="商品" v-if="i.componentName == 'el-sub-menu'">
            <template #title>
              <el-icon><component :is="i.icon" /></el-icon>
              <span>{{ i.name }}</span>
            </template>
            <el-menu-item
              v-for="(ii, iindex) in i.child"
              :key="index"
              :index="ii.path"
            >
              <template #title>
                <el-icon><component :is="ii.icon" /></el-icon>
                <span>{{ ii.name }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </template>
        <!-- <el-menu-item
          :index="i.path"
          v-for="(i, index) in menuOption.items"
          :key="index"
          @click="menuClickHandle(i)"
        >
          <template #title>
            <el-icon><component :is="i.icon" /></el-icon>
            <span>{{ i.name }}</span>
          </template>
        </el-menu-item> -->
      </el-menu>

      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter, useRoute } from "vue-router";
import { reactive, watch, ref, nextTick, getCurrentInstance } from "vue";
import { useIpcRenderer } from "@vueuse/electron";
import { useUserInfo } from "./stores/counter";
const userInfo = useUserInfo();
const router = reactive(useRouter());
const route = useRoute();
const header = reactive({ title: "首页" });
let defaultOpeneds = ref<string[]>();
const { proxy } = getCurrentInstance() as any;
if (!!window.require) {
  const ipcRenderer = useIpcRenderer();
  ipcRenderer.send("window-new", "im render"); // 向主进程通信
}

// 菜单参数
const menuOption = reactive({
  defaultActive: "/",
  items: [
    {
      name: "首页",
      icon: "DataAnalysis",
      path: "/",
      componentName: "el-menu-item",
    },
    {
      name: "打印账单",
      icon: "Tickets",
      path: "/PrintBillView",
      componentName: "el-menu-item",
    },
    {
      name: "商品",
      icon: "Box",
      path: "/Goods",
      componentName: "el-sub-menu",
      child: [
        { name: "添加类目", id: "", path: "/CategoryAdmin", icon: "FolderAdd" },
      ],
    },
    {
      name: "退出登录",
      icon: "CircleClose",
      path: "/Login",
      componentName: "el-menu-item",
      click: logOut,
    },
  ],
});

// 获取商品列表
function getGoodsList() {
  proxy.$api
    .get_goods_list({ id: 1 })
    .then((res: any) => {
      userInfo.goodsArr = res.data.list.map((i: any) => {
        i.is_Submit = true;
        i.create_time = i.create_time.split("T").join(" ").split(".")[0];
        return i;
      });
    })
    .catch((err: any) => {
      console.log(err);
    });
}
// 退出登录
function logOut() {
  const userInfo = useUserInfo();
  userInfo.setUserInfo({
    role: "tourist",
  });
  router.push("/Login");
}

// 获取类目列表
function get_category_list() {
  proxy.$api
    .get_category_list()
    .then(({ data: { list } }: any) =>
      userInfo.setCategoryArr(
        list.map((i: any) => {
          i.is_Submit = true;
          i.create_time = i.create_time.split("T").join(" ").split(".")[0];
          i.path = "/Goods?id=" + i.id;
          return i;
        })
      )
    )
    .catch((err: any) => {
      console.log(err);
    });
}

// 菜单点击事件
function menuClickHandle(item: any) {
  if (item?.child) defaultOpeneds.value = ["商品"];
  item?.name != "退出登录" && (header.title = item?.name);
  item?.click?.();
}
watch(
  () => userInfo.categoryArr,
  () => {
    menuOption.items.find((i, index) => {
      if (i.name == "商品") {
        let len: any = menuOption.items[index].child?.length;
        menuOption.items[index].child?.splice(1, len - 1);
        menuOption.items[index].child?.push(...userInfo.categoryArr);
      }
    });
  }
);
watch(
  () => route.fullPath,
  (newValue, oldValue) => {
    getGoodsList();
    get_category_list();
    let item: any;
    menuOption.items.forEach((i: any) => {
      if (i.path == newValue) {
        item = i;
        menuOption.defaultActive = newValue;
      } else {
        i?.child?.forEach((ii: any) => {
          if (ii.path == newValue) {
            menuOption.defaultActive = ii.path;
            item = ii;
          }
        });
      }
    });
    item && menuClickHandle(item);
  },
  { immediate: true }
);
</script>

<style lang="scss">
.AppView {
  > .headerView {
    background: #7eb4ff;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    .el-page-header__left {
      color: #fff;
      .el-page-header__title {
        font-size: 22px;
        font-weight: bold;
      }
    }
    .el-page-header__content {
      color: #fff;
      font-size: 18px;
    }
  }
  .contentView {
    display: flex;
    height: calc(100vh - 60px);
    .menuView {
      width: 200px;
      height: 100%;
      overflow-y: scroll;
      background: #fff;
      &::-webkit-scrollbar {
        display: none;
      }
      .el-menu-item {
        a {
          color: #333;
        }
      }
      .el-menu--inline {
        overflow-y: scroll;
        max-height: 300px;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
}
</style>
