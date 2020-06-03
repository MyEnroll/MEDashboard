<template>
  <fusioncharts
    :type="type"
    :width="width"
    :height="height"
    :dataFormat="dataFormat"
    :dataSource="dataSource"
  ></fusioncharts>
</template>
<script>
import Vue from "vue";

Vue.component("fusioncharts");

export default {
  name: "detailChart",
  props: ["chartdata", "chartType"],
  data() {
    return {
      type: this.chartType,
      renderAt: "chart-container",
      width: "100%",
      height: "500",
      dataFormat: "json",
      dataSource: {
        chart: {
          yaxisname: "Count",
          theme: "fusion"
        },
        data: this.chartdata
      }
    };
  }
};
</script>

