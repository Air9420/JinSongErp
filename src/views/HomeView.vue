<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-03 17:23:58
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-15 16:39:21
 * @FilePath: \my-vue-app\src\views\HomeView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="HomePage">
    <div ref="testRef" class="test"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);
let testRef = ref();
onMounted(() => {
  console.log(testRef.value);
  let myChart = echarts.init(testRef.value);
  myChart.setOption({
    xAxis: {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  });
});
</script>
<style lang="scss">
.HomePage {
  width: 100%;
  height: 100%;
  .test {
    width: 100%;
    height: 400px;
  }
}
</style>
