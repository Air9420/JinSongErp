<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-03 17:23:58
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-15 17:16:50
 * @FilePath: \my-vue-app\src\views\HomeView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="PrintBillView">
    <div class="tableView" ref="tableViewRef" id="table">
      <div class="headerView" v-if="!is_print">
        <span>劲松电器制冷修配总汇</span>
        <QrcodeVue
          class="Qrcode"
          :size="100"
          value="99910774008315904"
        />
      </div>
      <div class="infoView" v-if="!is_print">
        <span>订货电话：0752-3383111</span>
        <span>{{ getNowFormatDate() }}</span>
      </div>
      <el-table
        ref="tableRef"
        :data="tableData"
        show-summary
        sum-text="合计"
        :summary-method="summaryHandle"
        border
        :style="{ width: '100%' }"
        @cell-click="tabClick"
        :row-class-name="tableRowClassName"
        @selection-change="selectHandle"
      >
        <el-table-column type="selection" v-if="is_print" />
        <el-table-column
          label="序号"
          min-width="30"
          header-align="center"
          align="center"
        >
          <template v-slot="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称">
          <template v-slot="scope">
            <span v-if="tableClickToMe(scope)">
              <el-select
                v-model="scope.row.select"
                filterable
                placeholder="Select"
                @visible-change="inputBlur"
                @change="selectChange($event, scope)"
                ref="selectRef"
              >
                <el-option
                  v-for="item in userInfo?.goodsArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
              <!-- <el-input
                ref="inputRef"
                v-model="scope.row.name"
                maxlength="300"
                :placeholder="`请输入${scope.column.label}`"
                size="small"
                @blur="inputBlur"
              /> -->
            </span>
            <span v-else>{{ scope.row?.select?.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="specifications"
          label="规格"
          min-width="30"
          align="center"
        >
          <template v-slot="scope">
            <span v-if="tableClickToMe(scope)">
              <el-input
                ref="inputRef"
                v-model="scope.row.specifications"
                maxlength="300"
                :placeholder="`请输入${scope.column.label}`"
                size="small"
                @blur="inputBlur"
              />
            </span>
            <span v-else>{{ scope.row.specifications }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="buying_price"
          label="进货价"
          min-width="30"
          header-align="center"
          align="center"
          v-if="is_print"
        >
          <template v-slot="scope">
            <span v-if="tableClickToMe(scope)">
              <el-input
                ref="inputRef"
                v-model="scope.row.buying_price"
                maxlength="300"
                :placeholder="`请输入${scope.column.label}`"
                size="small"
                @blur="inputBlur"
              />
            </span>
            <span v-else>￥{{ scope.row.buying_price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位"
          min-width="30"
          header-align="center"
          align="center"
        >
          <template v-slot="scope">
            <span v-if="tableClickToMe(scope)">
              <el-input
                ref="inputRef"
                v-model="scope.row.unit"
                maxlength="300"
                :placeholder="`请输入${scope.column.label}`"
                size="small"
                @blur="inputBlur"
              />
            </span>
            <span v-else>{{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="数量"
          min-width="50"
          align="center"
        >
          <template v-slot="scope">
            <span v-if="tableClickToMe(scope)">
              <el-input
                ref="inputRef"
                v-model="scope.row.count"
                maxlength="300"
                :placeholder="`请输入${scope.column.label}`"
                size="small"
                @blur="inputBlur"
              />
            </span>
            <span v-else>{{ scope.row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="unitPrice"
          label="单价"
          min-width="30"
          align="center"
        >
          <template v-slot="scope">
            <span v-if="tableClickToMe(scope)">
              <el-input
                ref="inputRef"
                v-model="scope.row.unitPrice"
                maxlength="300"
                :placeholder="`请输入${scope.column.label}`"
                size="small"
                @blur="inputBlur"
              />
            </span>
            <span v-else>￥{{ scope.row.unitPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Price"
          label="金额"
          min-width="40"
          align="center"
        >
          <template v-slot="scope">
            <span>{{ totalPriceHandle(scope) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          header-align="center"
          align="center"
          v-if="is_print"
        >
          <template v-slot="scope">
            <div class="operation">
              <el-button
                style="margin-left: 0"
                type=""
                text
                @click="delGoods(scope)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="buttonView">
      <el-button
        type=""
        color="rgb(51,126,204)"
        size="default"
        icon="Delete"
        round
        @click="delAllSelect"
      >
        删除所选商品
      </el-button>
      <el-button
        type=""
        color="rgb(51,126,204)"
        size="default"
        icon="CirclePlusFilled"
        round
        @click="addGoods"
      >
        添加商品
      </el-button>
      <el-button
        type=""
        round
        icon="Printer"
        color="rgb(245,108,108)"
        size="default"
        @click="printTable"
        :style="{ color: '#fff' }"
      >
        生成账单
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 打印插件
import printJS from "print-js";
import html2canvas from "html2canvas";
import { reactive, ref, h, nextTick } from "vue";
import { useUserInfo } from "../stores/counter";
// 二维码组件
import QrcodeVue from "qrcode.vue";
// import { ElImage } from "element-plus";
const userInfo = useUserInfo();
const state = reactive({
  tabClickRowIndex: null, // 点击的横单元格
  tabClickColumnIndex: null, // 点击的纵单元格
  tabClickLabel: "", // 当前点击的列名
});
const tableViewRef = ref();
const tableRef = ref();
const inputRef = ref();
const selectRef = ref();
// 打印时显示的内容
const is_print = ref(true);
// 所选中的商品 index 数组 number类型
const selectGoodsIndex = ref<number[]>([]);
let tableData = reactive<any[]>([
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
]);
// 合计处理
function summaryHandle(params: any) {
  let { data, columns } = params;
  if (data.length === 0) return [];
  let values = data.map((i: any) => i.Price || 0);
  let count = values.reduce(
    (pre: number, cur: number) =>
      Math.ceil(pre * 100) / 100 + Math.ceil(cur * 100) / 100
  );

  let countToReplace = (
    "￥" + parseFloat(Math.ceil(count * 100) / 100).toFixed(2)
  ).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let returnArr = columns.map((i: any, index: number, arr: any) => {
    if (index == 0) return "合计";
    if (i.label == "金额") return countToReplace;
  });
  return returnArr;
}
// 总金额处理
function totalPriceHandle(scope: any) {
  tableData[scope.$index].Price = scope.row.count * scope.row.unitPrice;
  let totalPriceStr =
    "￥" +
    parseFloat(
      (Math.ceil(scope.row.count * scope.row.unitPrice * 100) / 100).toFixed(2)
    );
  return totalPriceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// 添加商品
function addGoods() {
  tableData.push({
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
  });

  // nextTick(() => {
  // tableViewRef.value.scrollTo({
  //   top: tableRef.value.$el.querySelector(".el-scrollbar__view").scrollHeight,
  //   behavior: "smooth",
  // }); // 缓慢滚动);
  // });
}
// 删除商品
function delGoods(scope: any) {
  ElMessageBox.confirm("是否删除该商品?", "小提示", {
    confirmButtonText: "是的",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      tableData.splice(scope.$index, 1);
      ElMessage({
        type: "success",
        message: "删除成功!",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消操作",
      });
    });
}
// 打印表格
async function printTable() {
  inputBlur(false);
  // 关闭非打印项
  is_print.value = false;
  let delIndex = tableData.map((i) => (!i.select ? i.index : null)).reverse();
  delIndex.forEach((i, index) => i != null && tableData.splice(i, 1));
  await nextTick();
  // 先将表格转换为图片
  let img = await html2canvas(tableViewRef.value);
  let imgurl = img.toDataURL("image/png");
  await nextTick();
  // 开启非打印项
  is_print.value = true;
  ElMessageBox({
    title: "点击预览图片",
    message: h(ElImage, {
      style: "width:100%;height:400px;",
      src: imgurl,
      previewSrcList: [imgurl],
      fit: "contain",
    }),
    showCancelButton: true,
    confirmButtonText: "确认打印",
    cancelButtonText: "取消",
    customStyle: "width:800px !important;max-width:800px !important;",
  }).then((action: any) => {
    printJS({
      printable: imgurl, // 标签元素id
      type: "image", // 打印类型，html或pdf
      // header: "劲松电器制冷修配总汇",
      // headerStyle: "font-weight: bold;text-align: center;", // 标题样式
      targetStyles: ["*"],
      style: "@page {margin:0mm 10mm};",
      maxWidth: tableViewRef.value.offsetWidth,
    });
    ElMessage({
      type: "success",
      message: "执行成功",
    });
  });
  return;
  // 关闭非打印项
  // is_print.value = false;
  // let delIndex = tableData.map((i) => (!i.select ? i.index : null)).reverse();
  // delIndex.forEach((i, index) => i != null && tableData.splice(i, 1));
  // nextTick(async () => {
  //   // 先将表格转换为图片
  //   let img = await html2canvas(tableViewRef.value);
  //   let imgurl = img.toDataURL("image/png");
  //   printJS({
  //     printable: imgurl, // 标签元素id
  //     type: "image", // 打印类型，html或pdf
  //     header: "劲松电器制冷修配总汇",
  //     headerStyle: "font-weight: bold;text-align: center;", // 标题样式
  //     targetStyles: ["*"],
  //     style: "@page {margin:0mm 10mm};",
  //     maxWidth: tableViewRef.value.offsetWidth,
  //     // onPrintDialogClose: () => {
  //     //   console.log("打印结束");

  //     //   // 开启非打印项
  //     //   is_print.value = true;
  //     // },
  //     // onError: (err: any) => {
  //     //   console.log(err);
  //     //   console.log("打印出错");
  //     // },
  //   });
  //   nextTick(() => {
  //     // 开启非打印项
  //     is_print.value = true;
  //   });
  // });
}
// 判断是否点击到了自己
function tableClickToMe(scope: any) {
  if (!scope) return false;
  return (
    scope.row.index === state.tabClickRowIndex &&
    scope.column.no === state.tabClickColumnIndex
  );
}
// 把每一行的索引放进row
function tableRowClassName({ row, rowIndex }: any) {
  return (row.index = rowIndex);
}
// 点击表格的时候
async function tabClick(row: any, column: any, cell: any, event: any) {
  if (
    column.no &&
    column.label != "金额" &&
    column.label != "操作" &&
    column.label != "进货价"
  ) {
    let { tabClickRowIndex, tabClickColumnIndex } = state;
    let is_me =
      tabClickRowIndex == row.index && tabClickColumnIndex == column.no;
    state.tabClickRowIndex = row.index;
    state.tabClickColumnIndex = column.no;
    if (column.label == "商品名称") {
      await nextTick();
      selectRef.value.focus();
    } else {
      await nextTick();
      inputRef.value.focus();
      if (!is_me) inputRef.value?.select?.();
    }
  }
}
// 失去焦点初始化
function inputBlur(val: boolean) {
  if (val && typeof val == "boolean") return;
  nextTick(() => {
    state.tabClickRowIndex = null;
    state.tabClickColumnIndex = null;
  });
}
// 下拉框选择改变
function selectChange($event: any, val: any) {
  console.log($event, val);
  tableData[val.$index].unit = $event.unit;
  tableData[val.$index].buying_price = $event.buying_price;
  !tableData[val.$index + 1] && addGoods();
}
// 获取当前年月日时分秒
function getNowFormatDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let date2 = date.getDate();
  let day = new Array(
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  )[date.getDay()];
  let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let second =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return (
    year +
    "-" +
    month +
    "-" +
    date2 +
    " " +
    hour +
    ":" +
    minute +
    ":" +
    second +
    " " +
    day
  );
}
// 删除选中的商品
function delAllSelect(scope: any) {
  let reverse = selectGoodsIndex.value;
  reverse.forEach((i) => {
    tableData.splice(i, 1);
  });
}
// 选中时触发
function selectHandle(selection: any) {
  selectGoodsIndex.value = selection.reverse().map((i: any) => i.index);
}
</script>

<style lang="scss">
.PrintBillView {
  position: relative;
  width: calc(100vw - 200px - 2px);
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  .operation {
    display: flex;
    justify-content: center;
    .preservation {
      color: rgb(255, 78, 78) !important;
    }
    .el-button {
      color: #3496fa;
    }
  }
  .tableView {
    .headerView {
      height: 100px;
      position: relative;
      text-align: center;
      font-size: 40px;
      font-weight: bold;
      padding: 32px 0;
      .Qrcode {
        position: absolute;
        right: 32px;
      }
    }
    .infoView {
      display: flex;
      justify-content: space-between;
      padding: 16px 32px;
    }
  }
  .buttonView {
    z-index: 10;
    width: calc(100% - 32px);
    position: fixed;
    bottom: 0px;
    left: 0px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 16px;
  }
}
</style>
