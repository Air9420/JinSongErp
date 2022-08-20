/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-09 11:50:10
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-15 16:00:05
 * @FilePath: \my-vue-app\src\api\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
import Vrouter from "../router";
const route = Vrouter.currentRoute.value;
const router = Vrouter;

import pinia from "../stores/index";
import { useUserInfo } from "../stores/counter";

const Axios = axios.create({
  // baseURL: "http://192.168.31.168:3000/",
  baseURL: "/api",
  timeout: 2000, // 请求超时时间毫秒
  withCredentials: true, // 异步请求携带cookie
  headers: {
    // 设置后端需要的传参类型
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// 添加请求拦截器
Axios.interceptors.request.use(
  function (config: any) {
    const store = useUserInfo(pinia); // 这里一定要把 pinia传入进去
    config.headers.token = store.token;

    // console.log("请求拦截器", config);

    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    console.log(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
Axios.interceptors.response.use(
  function (response) {
    // console.log("响应拦截器", response);

    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data;
    if (response.data.code === 0) {
      // 对响应数据做点什么
      return dataAxios;
    } else if (response.data.code === 1) {
      router.push({ name: "Login" });
      return Promise.reject(dataAxios);
    } else {
      return Promise.reject(dataAxios);
    }
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log(error);
    return Promise.reject(error);
  }
);

export default Axios;
