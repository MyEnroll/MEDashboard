<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card>
          <v-card-title>Daily Performance</v-card-title>
          <v-card-text>
            <fusioncharts
              ref="timeline"
              :type="timeline.type"
              :width="timeline.width"
              :height="timeline.height"
              :dataformat="timeline.dataFormat"
              :dataSource="timeline.dataSource"
            ></fusioncharts>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="6" v-for="item in procTotalsProc" :key="item.name">
        <v-card>
          <v-card-title>
            <span>{{ item.name }}</span>
            <v-spacer></v-spacer>
            <v-avatar size="36" :color="item.color" dark>
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </v-card-title>
          <v-card-text
            class="text-center pa-5 display-md-2 display-1 font-weight-light"
          >{{ item.value }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Vue from "vue";
import VueFusionCharts from "vue-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import _ from "lodash";
import axios from "axios";

Vue.use(VueFusionCharts, FusionCharts, Column2D, FusionTheme);

export default {
  name: "fsaProcessing",
  watch: {
    dates() {
      var self = this;
      self.setCategories(self.dates);
    },
    theme() {
      if (this.theme) {
        this.timeline.dataSource.chart.bgColor = "#1e1e1e";
        this.timeline.dataSource.chart.toolTipBgColor = "#1e1e1e";
        this.timeline.dataSource.chart.baseFontColor = "#ffffff";
      } else {
        this.timeline.dataSource.chart.bgColor = "#ffffff";
        this.timeline.dataSource.chart.toolTipBgColor = "#ffffff";
        this.timeline.dataSource.chart.baseFontColor = "#1e1e1e";
      }
    },
  },
  data() {
    return {
      sample: [],
      processors: ["Paulette", "Chau", "Kaitlyn"],
      timeline: {
        type: "msspline",
        width: "100%",
        height: "450",
        dataFormat: "json",
        dataSource: {
          chart: {
            bgColor: "#ffffff",
            baseFontColor: "#1e1e1e",
            yaxisname: "Claims Processed",
            showhovereffect: "1",
            showLabels: "1",
            drawcrossline: "1",
            labelDisplay: "rotate",
            slantLabel: "1",
            labelStep: 2,
            plottooltext:
              "<b>$dataValue</b> of claims were processed by $seriesName",
            theme: "fusion",
          },
          categories: [
            {
              category: [],
            },
          ],
          dataset: [],
        },
      },
    };
  },
  created: function () {
    var self = this;
    self.getSample();
    self.setChartData();
    if (this.theme) {
      this.timeline.dataSource.chart.bgColor = "#1e1e1e";
      this.timeline.dataSource.chart.toolTipBgColor = "#1e1e1e";
      this.timeline.dataSource.chart.baseFontColor = "#ffffff";
    } else {
      this.timeline.dataSource.chart.bgColor = "#ffffff";
      this.timeline.dataSource.chart.toolTipBgColor = "#ffffff";
      this.timeline.dataSource.chart.baseFontColor = "#1e1e1e";
    }
  },
  computed: {
    test() {
      var self = this;
      return _.map(
        _.countBy(self.sample, "ADD_DATE_SIMPLIFIED"),
        (val, key) => ({ date: key, total: val })
      );
    },
    dates() {
      var self = this;
      return _.uniq(
        _.map(
          self.sample.map(function (n) {
            return (
              n.ADD_DATE_SIMPLIFIED.substr(5, 2) +
              "/" +
              n.ADD_DATE_SIMPLIFIED.substr(8, 2) +
              "/" +
              n.ADD_DATE_SIMPLIFIED.substr(0, 4)
            );
          })
        )
      ).sort();
    },
    theme() {
      return this.$store.getters.darkTheme;
    },
    procTotalsProc() {
      var self = this;
      return self.procTotals.filter(function (n) {
        return n.name != "Total";
      });
    },
    procTotals() {
      var self = this;
      return self.processors1.map(function (n) {
        var x = self.timeline.dataSource.dataset.filter(function (m) {
          return m.seriesname == n;
        })[0];

        return {
          name: n,
          value: _.sumBy(x.data, function (l) {
            return Number(l.value);
          }),
          color: x.anchorbgcolor,
        };
      });
    },
    processors1() {
      var self = this;
      return self.timeline.dataSource.dataset.map(function (n) {
        return n.seriesname;
      });
    },
  },
  methods: {
    getSample() {
      var self = this;
      axios.get("./data/testfsa.json").then(function (response) {
        self.sample = response.data;
      });
    },
    setChartData() {
      var self = this;
      self.timeline.dataSource.dataset = [
        {
          seriesname: "Kaitlyn",
          anchorbgcolor: "#5D62B5",
          data: [
            { value: "62" },
            { value: "64" },
            { value: "64" },
            { value: "66" },
            { value: "78" },
          ],
        },
        {
          seriesname: "Chau",
          anchorbgcolor: "#29C3BE",
          data: [
            { value: "16" },
            { value: "28" },
            { value: "34" },
            { value: "42" },
            { value: "54" },
          ],
        },
        {
          seriesname: "Paulette",
          anchorbgcolor: "#F2726F",
          data: [
            { value: "20" },
            { value: "22" },
            { value: "27" },
            { value: "22" },
            { value: "29" },
          ],
        },
        {
          seriesname: "Total",
          anchorbgcolor: "#FFC533",
          data: [
            { value: "98" },
            { value: "114" },
            { value: "125" },
            { value: "130" },
            { value: "161" },
          ],
        },
      ];
    },
    setCategories(r) {
      var self = this;
      self.timeline.dataSource.categories[0].category = [];
      r.forEach(function (n) {
        self.timeline.dataSource.categories[0].category.push({ label: n });
      });
    },
  },
};
</script>
