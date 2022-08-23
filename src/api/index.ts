/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-09 12:01:31
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-23 15:39:05
 * @FilePath: \my-vue-app\src\api\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Axios from "./init";
import Vrouter from "../router";
const router: any = Vrouter;

interface sign_in_params {
  username: string;
  password: string;
}
interface get_goods_list_params {
  page: number;
  limit: number;
}
let apis = {
  sign_in: (params: sign_in_params) => Axios.post("/api/sign_in", params),
  get_goods_list: () =>
    Axios.get("/api/get_goods_list", {
      params: { category_id: router.currentRoute.value?.query?.id || 0 },
    }),
  add_goods: (params: any) =>
    Axios.post("/api/add_goods", {
      ...params,
      category_id: router.currentRoute.value?.query?.id,
    }),
  modify_goods: (params: any) => Axios.post("/api/modify_goods", params),
  del_goods: (params: any) => Axios.post("/api/del_goods", params),
  get_category_list: () => Axios.get("/api/get_category_list"),
  add_category: (params: any) => Axios.post("/api/add_category", params),
  del_category: (params: any) => Axios.post("/api/del_category", params),
  created_bill: (params: any) => Axios.post("/api/created_bill", params),
  upload_bill_img: (params: any) => Axios.post("/api/upload_bill_img", params),
  get_bill_list: (params: any) => Axios.post("/api/get_bill_list", params),
};

const $api = {
  install(app: any, options: any) {
    app.config.globalProperties.$api = apis;
  },
};

export default $api;
