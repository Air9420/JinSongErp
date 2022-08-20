<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-11 17:10:39
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-11 22:37:41
 * @FilePath: \my-vue-app\src\views\CategoryAdmin.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="CategoryAdmin" ref="CategoryAdminPageRef">
    <el-table
      ref="tableRef"
      :data="
        tabState.goodsArrFilter.length
          ? tabState.goodsArrFilter
          : userInfo.categoryArr
      "
      border
      :style="{ width: '100%' }"
      @cell-click="1"
      @header-click="false && headerClick"
    >
      <el-table-column
        label="唯一标识"
        width="100"
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
        label="类目名称"
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
          <span v-else>类目名称</span>
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
        label="添加时间"
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
      <el-table-column label="操作" header-align="center" align="center">
        <template v-slot="scope">
          <div class="operation">
            <template v-if="!isSubmit(scope)">
              <el-button
                class="preservation"
                style="margin-left: 0"
                type=""
                text
                @click="isSubmit(scope) ? '' : submitCategory(scope)"
              >
                提交类目
              </el-button>
              <el-button
                style="margin-left: 0"
                type=""
                text
                @click="delCategoryLocal(scope)"
              >
                删除
              </el-button>
            </template>
            <template v-else>
              <el-button
                style="margin-left: 0"
                type=""
                text
                @click="delCategory(scope)"
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
        icon="CirclePlusFilled"
        round
        @click="addCategory"
      >
        添加类目
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, nextTick, getCurrentInstance } from "vue";
import { useUserInfo } from "../stores/counter";
const { proxy } = getCurrentInstance() as any;
const userInfo = useUserInfo();
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

// 删除本地类目
function delCategoryLocal(scope: any) {
  userInfo.categoryArr.find((i, index) => {
    if (i.id === scope.row.id && typeof i.id === "number") {
      return userInfo.categoryArr.splice(index, 1);
    } else if (scope.$index === index) {
      return userInfo.categoryArr.splice(index, 1);
    }
  });
}
// 删除商品
function delCategory(scope: any) {
  let name = scope.row.name;
  ElMessageBox.confirm(`是否删除${name}商品?`, "小提示", {
    confirmButtonText: "是的",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      proxy.$api
        .del_category(scope.row)
        .then((res: any) => {
          get_category_list();
          delCategoryLocal(scope);
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
// 提交类目
function submitCategory(scope: any) {
  let name = scope.row.name;
  ElMessageBox.confirm(`确认添加"${name}"的类目?`, "小提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      proxy.$api
        .add_category(scope.row)
        .then((res: any) => {
          get_category_list();
          scope.row.is_Submit = true;
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
// 表格表头点击事件
async function headerClick(column: any, event: any) {
  // if (column.label == "商品名称") {
  //   tabState.headerSearch = true;
  //   await nextTick();
  //   headerSearchRef.value.focus();
  // }
}
// 点击表格行
function tableClickToThisRow(scope: any) {
  return tabState.rowIndex === scope.$index;
}
// 是否提交该商品
function isSubmit(scope: any) {
  return scope.row.is_Submit;
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
// 添加商品
function addCategory() {
  userInfo.categoryArr.push({
    id: "提交后自动生成",
    //商品名称
    name: "",
    // 添加时间
    create_time: "提交后自动生成",
    // 是否提交
    is_Submit: false,
  });
  nextTick(() => {
    // tableRef.value.scrollTo({
    //   top: tableRef.value.$el.querySelector(".el-scrollbar__view").scrollHeight,
    //   behavior: "smooth",
    // }); // 缓慢滚动);
  });
}
get_category_list();
</script>
<style lang="scss">
.CategoryAdmin {
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
