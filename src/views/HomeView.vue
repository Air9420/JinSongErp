<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-03 17:23:58
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-23 22:42:05
 * @FilePath: \my-vue-app\src\views\HomeView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    class="HomePage"
    v-loading="loading"
    element-loading-text="请求数据中···"
  >
    <div
      class="itemView"
      v-if="userInfo.billArr[0]"
      v-for="i in userInfo.billArr"
    >
      <div class="imgView">
        <el-image
          class="img"
          :src="i.bill_img"
          :preview-src-list="[i.bill_img]"
          :initial-index="4"
          fit="contain"
        />
      </div>
      <el-popover placement="top" width="" effect="light" trigger="hover">
        <template #reference>
          <div class="infoView">
            <span class="price">￥{{ i.price }}</span>
            <span class="time">{{ i.createdAt }}</span>
          </div>
        </template>
        <div :style="{ display: 'flex', justifyContent: 'center' }">
          <el-button
            type=""
            color="rgb(51,126,204)"
            size="default"
            icon="Refresh"
            round
            @click="reset_bill(i.bill_json)"
          >
            重新填写
          </el-button>
          <el-button
            type=""
            color="rgb(245,108,108)"
            size="default"
            icon="Printer"
            round
            :style="{ color: '#fff' }"
            @click="print_bill(i.bill_img)"
          >
            打印
          </el-button>
        </div>
      </el-popover>
      <!-- <el-tooltip content="点击打印当前账单" placement="top">
        <div class="infoView" @click="print_bill(i.bill_img)">
          <span class="price">￥{{ i.price }}</span>
          <span class="time">{{ i.createdAt }}</span>
        </div>
      </el-tooltip> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onActivated, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useUserInfo } from "../stores/counter";
import printJS from "print-js";
const router = useRouter();
const userInfo = useUserInfo();
const { proxy } = getCurrentInstance() as any;
const loading = ref(true);

onActivated(async () => {
  // @ts-ignore
  loading.value = true;
  await get_bill_list();
  loading.value = false;
});
// 获取账单列表
function get_bill_list() {
  return new Promise((resolve, reject) => {
    proxy.$api.get_bill_list().then((res: any) => {
      resolve(1);
      userInfo.setbillArr(res.data.list);
    });
  });
}
// 打印账单
function print_bill(imgurl: string) {
  printJS({
    printable: imgurl, // 标签元素id
    type: "image", // 打印类型，html或pdf
    targetStyles: ["*"],
    style: "@page {margin:0mm 10mm};",
  });
}
// 重新填写账单
function reset_bill(arr: any) {
  userInfo.tableData = arr;
  router.push({ name: "PrintBillView" });
}
</script>
<style lang="scss">
.HomePage {
  width: calc(100vw - 200px);
  height: calc(100vh - 60px - 32px);
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: scroll;
  .itemView {
    width: calc(100% / 4 - (16px * 3 / 4) - 16px);
    display: flex;
    border-radius: 8px;
    flex-direction: column;
    padding: 8px;
    background: rgb(238, 238, 238);
    .imgView {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 120px;
      .img {
        width: 100%;
        height: 120px;
        border-radius: 8px;
        background: rgb(215, 215, 215);
      }
    }
    .infoView {
      display: flex;
      flex-direction: column;
      .price {
        color: rgb(255, 180, 82);
        font-size: 18px;
        font-weight: bold;
      }
      .time {
        color: rgb(111, 111, 111);
      }
    }
  }
}
</style>
