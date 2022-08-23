/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-03 19:10:44
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-23 22:15:54
 * @FilePath: \my-vue-app\src\stores\counter.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from "pinia";

export const useUserInfo = defineStore("userInfo", {
  state: () => {
    return {
      userInfo: { role: "tourist" },
      token: "",
      goodsArr: [] as any[],
      categoryArr: [] as any[],
      billArr: [] as any[],
      tableData: [
        {
          //商品名称
          name: "",
          //规格
          specifications: "",
          // 进货价
          buying_price: "0",
          //单位
          unit: "",
          //数量
          count: "1",
          //单价
          unitPrice: "0",
          //总价
          Price: "",
        },
      ] as any[],
    };
  },
  persist: {
    storage: sessionStorage,
    paths: ["userInfo", "token"],
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo;
    },
    setCategoryArr(arr: any[]) {
      this.categoryArr = arr;
    },
    setbillArr(arr: any[]) {
      this.billArr = arr;
    },
    initAll() {
      this.userInfo.role = "tourist";
      this.token = "";
      this.goodsArr = [];
      this.categoryArr = [];
    },
  },
});
