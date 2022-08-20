<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-07 04:18:17
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-12 14:32:17
 * @FilePath: \my-vue-app\src\views\GoodsView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="GoodsPage" ref="GoodsPageRef">
    <el-table
      ref="tableRef"
      :data="
        tabState.goodsArrFilter.length
          ? tabState.goodsArrFilter
          : userInfo.goodsArr.concat(unSubmitGoods)
      "
      border
      :style="{ width: '100%' }"
      @cell-click="1"
      @header-click="headerClick"
      @selection-change="selectHandle"
    >
      <el-table-column type="selection" v-slot="scope">
        <template v-if="!(scope.row.id > 0)"> </template>
      </el-table-column>
      <el-table-column
        label="货号"
        width="60"
        header-align="center"
        align="center"
        prop="id"
      >
        <template v-slot="scope">
          <el-tooltip
            v-if="!(typeof scope.row.id == 'number')"
            effect="dark"
            content="提交后自动生成"
            placement="left"
          >
            <span :style="{ whiteSpace: 'nowrap' }">{{ scope.row.id }}</span>
          </el-tooltip>
          <span v-else>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称"
        min-width="100"
        header-align="center"
        align="center"
        prop="name"
      >
        <template #header>
          <span v-if="tabState.headerSearch || tabState.headerSearchValue">
            <el-input
              v-model="tabState.headerSearchValue"
              ref="headerSearchRef"
              size="small"
              placeholder="Type to search"
              @blur="tabState.headerSearch = false"
              @input="headerSearchHandle"
            />
          </span>
          <span v-else>商品名称</span>
        </template>
        <template v-slot="scope">
          <span v-if="tableClickToThisRow(scope) || !isSubmit(scope)">
            <el-input
              ref="inputRef"
              v-model="scope.row.name"
              maxlength="100"
              :placeholder="`请输入${scope.column.label}`"
              @blur="1"
            />
          </span>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="进货价"
        width="100"
        header-align="center"
        align="center"
        prop="buying_price"
      >
        <template v-slot="scope">
          <span v-if="tableClickToThisRow(scope) || !isSubmit(scope)">
            <el-input
              ref="inputRef"
              v-model="scope.row.buying_price"
              maxlength="100"
              :placeholder="`请输入${scope.column.label}`"
              @blur="1"
            />
          </span>
          <span v-else>￥{{ scope.row.buying_price }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单位"
        width="60"
        header-align="center"
        align="center"
        prop="unit"
      >
        <template v-slot="scope">
          <span v-if="tableClickToThisRow(scope) || !isSubmit(scope)">
            <el-input
              ref="inputRef"
              v-model="scope.row.unit"
              maxlength="100"
              :placeholder="`请输入${scope.column.label}`"
              @blur="1"
            />
          </span>
          <span v-else>{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="销量"
        width="80"
        header-align="center"
        align="center"
        prop="sales_stats"
      >
        <template v-slot="scope">
          <el-tooltip
            v-if="!(typeof scope.row.id == 'number')"
            effect="dark"
            content="提交后自动生成"
            placement="left"
          >
            <span :style="{ whiteSpace: 'nowrap' }">{{ scope.row.id }}</span>
          </el-tooltip>
          <span v-else>{{ scope.row.sales_stats }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="添加时间"
        min-width="100"
        header-align="center"
        align="center"
        prop="create_time"
      >
        <template v-slot="scope">
          <el-tooltip
            v-if="!(typeof scope.row.id == 'number')"
            effect="dark"
            content="提交后自动生成"
            placement="left"
          >
            <span :style="{ whiteSpace: 'nowrap' }">{{ scope.row.id }}</span>
          </el-tooltip>
          <span v-else>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="100"
        header-align="center"
        align="center"
      >
        <template v-slot="scope">
          <div class="operation">
            <template v-if="!isSubmit(scope)">
              <el-button
                class="preservation"
                style="margin-left: 0"
                type=""
                text
                @click="isSubmit(scope) ? '' : submitGoods(scope)"
              >
                提交商品
              </el-button>
              <el-button
                style="margin-left: 0"
                type=""
                text
                @click="delGoods(scope)"
              >
                删除
              </el-button>
            </template>
            <template v-else>
              <el-button
                style="margin-left: 0"
                type=""
                text
                v-if="tableClickToThisRow(scope)"
                @click="cancelSubmit(scope)"
              >
                取消
              </el-button>
              <el-button
                class="preservation"
                style="margin-left: 0"
                type=""
                text
                v-if="tableClickToThisRow(scope)"
                @click="modify_goods(scope)"
              >
                保存
              </el-button>
              <el-button
                style="margin-left: 0"
                type=""
                text
                @click="editRow(scope)"
                v-else
              >
                编辑
              </el-button>

              <el-button
                style="margin-left: 0"
                type=""
                text
                @click="delGoods(scope)"
              >
                删除
              </el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="buttonView">
      <el-button
        type=""
        color="rgb(51,126,204)"
        size="default"
        icon="Delete"
        round
        @click="delAllSelect"
      >
        删除
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch, nextTick, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import { useUserInfo } from "../stores/counter";
const route = useRoute();
const userInfo = useUserInfo();
const { proxy } = getCurrentInstance() as any;
const tableRef = ref();
const GoodsPageRef = ref();
const headerSearchRef = ref();
// 所选中的商品 index 数组 number类型
const selectGoodsIndex = ref<number[]>([]);
// 未提交数据
const unSubmitGoods = ref<any[]>([]);
interface tableIndex {
  rowIndex: null | number;
  columnIndex: null | number;
  headerSearch: boolean;
  headerSearchValue: string;
  goodsArrFilter: any[];
}
const tabState = reactive<tableIndex>({
  rowIndex: null,
  columnIndex: null,
  headerSearch: false,
  headerSearchValue: "",
  goodsArrFilter: [],
});
// 表头搜索处理
function headerSearchHandle(str: string) {
  tabState.goodsArrFilter = userInfo.goodsArr.filter(
    (i) => !str || i.name.toLowerCase().includes(str.toLowerCase())
  );
  let len = tabState.goodsArrFilter.length;
  len
    ? str && ElMessage.success(`搜索到${tabState.goodsArrFilter.length}条数据`)
    : str && ElMessage.warning("没有搜索到数据");
}
// 表格表头点击事件
async function headerClick(column: any, event: any) {
  if (column.label == "商品名称") {
    tabState.headerSearch = true;
    await nextTick();
    headerSearchRef.value.focus();
  }
}
// 编辑行
function editRow(scope: any) {
  tabState.rowIndex = scope.$index;
  tabState.columnIndex = scope.column.on;
}
// 点击表格行
function tableClickToThisRow(scope: any) {
  return tabState.rowIndex === scope.$index;
}
// 添加商品
function addGoods() {
  let len = unSubmitGoods.value.length;
  if (len) return;
  unSubmitGoods.value.push({
    id: "提交后自动生成",
    //商品名称
    name: "",
    // 进货价
    buying_price: "",
    //单位
    unit: "",
    //销量
    sales_stats: "提交后自动生成",
    // 添加时间
    create_time: "提交后自动生成",
    // 是否提交
    is_Submit: false,
  });
  // userInfo.goodsArr.push({
  //   id: "提交后自动生成",
  //   //商品名称
  //   name: "",
  //   // 进货价
  //   buying_price: "",
  //   //单位
  //   unit: "",
  //   //销量
  //   sales_stats: "提交后自动生成",
  //   // 添加时间
  //   create_time: "提交后自动生成",
  //   // 是否提交
  //   is_Submit: false,
  // });
  nextTick(() => {
    tableRef.value.scrollTo({
      top: tableRef.value.$el.querySelector(".el-scrollbar__view").scrollHeight,
      behavior: "smooth",
    }); // 缓慢滚动);
  });
}
// 是否提交该商品
function isSubmit(scope: any) {
  return scope.row.is_Submit;
}
// 删除商品
function delGoods(scope: any) {
  ElMessageBox.confirm("是否删除该商品?", "小提示", {
    confirmButtonText: "是的",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      proxy.$api
        .del_goods(scope.row)
        .then((res: any) => {
          getGoodsList();
          userInfo.goodsArr.splice(scope.$index, 1);
          ElMessage({
            type: "success",
            message: res.msg,
          });
        })
        .catch((err: any) => {
          console.log(err);
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消操作",
      });
    });
}
// 获取商品列表
function getGoodsList() {
  proxy.$api
    .get_goods_list()
    .then((res: any) => {
      console.log(res);
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
// 提交商品
function submitGoods(scope: any) {
  let name = scope.row.name;
  ElMessageBox.confirm(`是否添加"${name}"商品?`, "小提示", {
    confirmButtonText: "是的",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      proxy.$api
        .add_goods(scope.row)
        .then((res: any) => {
          getGoodsList();
          unSubmitGoods.value.splice(0, 1);
          ElMessage({
            type: "success",
            message: "提交成功!",
          });
        })
        .catch((err: any) => {
          console.log(err);
          ElMessage({
            type: "warning",
            message: err.msg,
          });
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消操作",
      });
    });
}
// 取消提交
function cancelSubmit(scope: any) {
  tabState.rowIndex = null;
}
// 保存编辑
function modify_goods(scope: any) {
  let id = scope.row.id;
  ElMessageBox.confirm(`是否修改货号为"${id}"的商品?`, "小提示", {
    confirmButtonText: "是的",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      proxy.$api
        .modify_goods(scope.row)
        .then((res: any) => {
          getGoodsList();
          tabState.rowIndex = null;
          ElMessage({
            type: "success",
            message: res.msg,
          });
        })
        .catch((err: any) => {
          console.log(err);
          ElMessage({
            type: "warning",
            message: err.msg,
          });
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消操作",
      });
    });
}
// 删除选中的商品
function delAllSelect(scope: any) {
  let reverse = selectGoodsIndex.value;
  ElMessageBox.confirm("是否删除所选商品?", "小提示", {
    confirmButtonText: "是的",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      proxy.$api
        .del_goods({ id: reverse })
        .then((res: any) => {
          getGoodsList();
          userInfo.goodsArr.splice(scope.$index, 1);
          ElMessage({
            type: "success",
            message: res.msg,
          });
        })
        .catch((err: any) => {
          console.log(err);
          ElMessage({
            type: "warning",
            message: err.msg,
          });
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消操作",
      });
    });

  // reverse.forEach((i) => {
  //   tableData.splice(i, 1);
  // });
}
// 选中时触发
function selectHandle(selection: any) {
  selectGoodsIndex.value = selection.reverse().map((i: any) => i.id);
}

function log(params: any) {
  console.log(params);
}
watch(
  () => route.fullPath,
  (newValue, oldValue) => {
    unSubmitGoods.value.splice(0, 1);
  },
  { immediate: true }
);
</script>
<style lang="scss">
.GoodsPage {
  width: calc(100vw - 200px - 2px);
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  .buttonView {
    padding: 16px;
    display: flex;
    justify-content: center;
  }
}
</style>
