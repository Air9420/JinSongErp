/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-02 23:47:09
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-13 08:47:16
 * @FilePath: \my-vue-app\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import * as path from "path";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron/renderer";
import polyfillExports from "vite-plugin-electron/polyfill-exports";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      electron({
        main: {
          entry: "electron-main/index.ts", // 主进程文件
        },
        preload: {
          input: path.join(__dirname, "./electron-preload/index.ts"), // 预加载文件
        },
      }),
      electronRenderer(),
      polyfillExports(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    esbuild: {
      drop: command === "build" ? ["console", "debugger"] : [],
    },
    build: {
      emptyOutDir: false, // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录
    },
    server: {
      proxy: {
        "/api": {
          target: "http://192.168.31.168:3000", // 实际请求地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
