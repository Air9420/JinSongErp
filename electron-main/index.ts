/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-02 23:59:37
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-15 15:59:13
 * @FilePath: \my-vue-app\electron-main\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// electron-main/index.ts
import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path from "path";

// ipcMain.on("window-new", (e: Event, data: string) => {
//   console.log(data);
// });

// let menuTemp: object = [];
// 2.根据上述的模板数据生成一个 menu
const menu = Menu.buildFromTemplate([]);
// 3.将上述的自定义菜单添加到 app 里
Menu.setApplicationMenu(menu);

const createWindow = () => {
  const win = new BrowserWindow({
    title: "劲松电器进销存管理系统",
    minWidth: 1000,
    minHeight: 700,
    icon: path.join(__dirname, "../src/assets/logo1.png"),
    webPreferences: {
      contextIsolation: false, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      // preload: path.join(__dirname, "../electron-preload/index.js"), // 需要引用js文件
      webSecurity: false, //是否禁用同源策略(上线时删除此配置)
      devTools: true,
    },
  });

  // 如果打包了，渲染index.html
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../index.html"));
  } else {
    let url = "http://192.168.31.254:3000"; // 本地启动的vue项目路径
    win.loadURL(url);
  }
};
// app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
app.whenReady().then(() => {
  createWindow(); // 创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 关闭窗口
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
