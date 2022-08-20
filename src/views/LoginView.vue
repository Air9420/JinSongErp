<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-03 19:01:28
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-11 14:39:27
 * @FilePath: \my-vue-app\src\views\LoginView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="LoginPage">
    <!-- 头部左侧标题 -->
    <el-page-header
      class="title"
      title="登录"
      content="劲松电器进销存管理系统"
      icon=""
    />
    <!-- 居中 -->
    <div class="centerView">
      <!-- 扫码区 -->
      <div class="Box" v-if="loginType">
        <el-image
          style="width: 180px; height: 180px"
          src="https://login.weixin.qq.com/qrcode/oaCeTZYsnA=="
          fit="fill"
        />
        <el-button type="danger" text>使用手机微信扫码登录</el-button>

        <el-button style="margin-left: 0" type="" text @click="loginTypeSwitch"
          >账号密码登录</el-button
        >
      </div>
      <!-- 账号密码 -->
      <div class="Box" v-else>
        <el-form
          ref="loginRef"
          :model="loginForm"
          :rules="LoginRules"
          :hide-required-asterisk="true"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入账号"
              autofocus
              @keyup.enter="loginCheck"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              @keyup.enter="loginCheck"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              round
              :style="{ width: '100%' }"
              type="primary"
              @click="loginCheck"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
        <el-button style="margin-left: 0" type="" text @click="loginTypeSwitch"
          >微信扫码登录</el-button
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useUserInfo } from "../stores/counter";

const { proxy } = getCurrentInstance() as any;
const router = useRouter();

let LoginRules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 5, max: 16, message: "账号长度在 5 到 16 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 5, max: 16, message: "密码长度在 5 到 16 个字符", trigger: "blur" },
  ],
});
let loginForm = reactive({
  username: "",
  password: "",
});
let loginType = ref(true);

function loginTypeSwitch() {
  loginType.value = !loginType.value;
}

function loginCheck() {
  interface resObj {
    code: number;
    msg: string;
    data: any;
  }
  const userInfo = useUserInfo();
  proxy.$api
    .sign_in(loginForm)
    .then((res: resObj) => {
      let {
        msg,
        data: { userToken, role },
      } = res;
      userInfo.setUserInfo({ role });
      userInfo.setToken(userToken);
      console.log(userInfo);

      router.push({ name: "Home" });
      ElMessage.success({
        message: msg,
      });
    })
    .catch((err: { msg: string }) => {
      ElMessage.warning({
        message: err.msg,
      });
    });
}
</script>
<style lang="scss">
.LoginPage {
  background: #8dc2ed;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    position: fixed;
    top: 32px;
    left: 32px;
    font-size: 30px;
    font-weight: bold;
    color: #fff;
  }
  .centerView {
    display: flex;
    justify-content: center;
    .Box {
      display: flex;
      flex-direction: column;
      padding: 32px;
      align-items: center;
      gap: 16px;
      //   width: 260px;
      //   height: 300px;
      background: #fff;
      border-radius: 16px;
    }
  }
}
</style>
