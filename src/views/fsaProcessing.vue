<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="12" md="4">
        <v-menu
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              label="Date range"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker range v-model="dateRange" no-title></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" class="headline mt-3">Daily Performance</v-col>
      <v-col cols="12" md="7">
        <v-card :loading="initLoading || dlProgress > 0" min-height="450">
          <v-card-text>
            <v-overlay :value="initLoading" absolute>
              <v-progress-circular
                :indeterminate="dlProgress == 0"
                :rotate="-90"
                size="72"
                :value="dlProgress"
              >{{ dlProgress }}</v-progress-circular>
            </v-overlay>
            <v-fade-transition mode="out-in">
              <template v-if="dateRangeText2 != '' || sample.length > 0">
                <fusioncharts
                  key="loaded"
                  ref="timeline"
                  :type="timeline.type"
                  :width="timeline.width"
                  :height="timeline.height"
                  :dataformat="timeline.dataFormat"
                  :dataSource="timeline.dataSource"
                ></fusioncharts>
              </template>
            </v-fade-transition>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card min-height="450" :loading="initLoading || dlProgress > 0">
          <v-card-text>
            <v-overlay :value="initLoading" absolute>
              <v-progress-circular
                :indeterminate="dlProgress == 0"
                :rotate="-90"
                size="72"
                :value="dlProgress"
              >{{ dlProgress }}</v-progress-circular>
            </v-overlay>
            <fusioncharts
              :type="spread.type"
              :width="spread.width"
              :height="spread.height"
              :dataFormat="spread.dataFormat"
              :dataSource="spread.dataSource"
            ></fusioncharts>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-slide-x-transition mode="out-in">
      <template v-if="sample.length > 0">
        <v-row key="metrics">
          <v-col
            cols="12"
            class="headline mt-3"
          >Claims Processed between {{ startDate }} and {{ endDate }}</v-col>
          <v-col cols="12" md="4" sm="6" v-for="item in procTotalsProc" :key="item.label">
            <v-card>
              <v-card-title>
                <span>{{ item.label }}</span>
                <v-spacer></v-spacer>
                <v-avatar size="36" :color="item.color" dark>
                  <v-icon dark>mdi-account-circle</v-icon>
                </v-avatar>
              </v-card-title>
              <v-card-text
                class="text-center pa-5 display-md-2 display-1 font-weight-light"
              >{{ numberWithCommas(item.value) }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-slide-x-transition>
    <v-slide-x-transition mode="out-in">
      <template v-if="sample.length > 0">
        <v-row key="metrics">
          <v-col
            cols="12"
            class="headline mt-3"
          >Claims Detail between {{ startDate }} and {{ endDate }}</v-col>
          <template>
            <v-data-table
              :headers="Object.keys(sample[0])"
              :items="sample"
              :items-per-page="perPage"
              class="elevation-1"
            ></v-data-table>
          </template>
        </v-row>
      </template>
    </v-slide-x-transition>
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
    procTotalsProc() {
      var self = this;
      self.spread.dataSource.data = self.procTotalsProc;
    },
    dateRangeText2() {
      var self = this;
      if (self.dateRangeText2 != "") {
        self.getSample(self.dateRangeText1, self.dateRangeText2);
      }
    },
    dates() {
      var self = this;
      self.setCategories(self.dates);
    },
    theme() {
      if (this.theme) {
        this.timeline.dataSource.chart.bgColor = "#1e1e1e";
        this.timeline.dataSource.chart.toolTipBgColor = "#1e1e1e";
        this.timeline.dataSource.chart.baseFontColor = "#ffffff";
        this.spread.dataSource.chart.bgColor = "#1e1e1e";
        this.spread.dataSource.chart.toolTipBgColor = "#1e1e1e";
        this.spread.dataSource.chart.baseFontColor = "#ffffff";
      } else {
        this.timeline.dataSource.chart.bgColor = "#ffffff";
        this.timeline.dataSource.chart.toolTipBgColor = "#ffffff";
        this.timeline.dataSource.chart.baseFontColor = "#1e1e1e";
        this.spread.dataSource.chart.bgColor = "#ffffff";
        this.spread.dataSource.chart.toolTipBgColor = "#ffffff";
        this.spread.dataSource.chart.baseFontColor = "#1e1e1e";
      }
    },
    sample() {
      var self = this;
      self.setChartData();
    },
  },
  data: () => ({
    dtlHeaders: [],
    dtlItems: [],
    perPage: 10,
    initLoading: false,
    queryLoad: false,
    dlProgress: 0,
    dateRange: [],
    sample: [],
    processors: ["Paulette", "Chau", "Kaitlyn"],
    spread: {
      type: "",
      width: "100%",
      height: "450",
      dataFormat: "json",
      dataSource: {
        chart: {
          animation: "1",
          defaultAnimation: "1",
          bgColor: "#ffffff",
          baseFontColor: "#1e1e1e",
          showLabels: "0",
          showpercentvalues: "1",
          defaultcenterlabel: "Claims Processed",
          decimals: "1",
          plottooltext:
            "<b>$percentValue</b> of claims were processed by <b>$label</b>",
          centerlabel: "Claims Processed: $value",
          theme: "fusion",
        },
        data: [],
      },
    },
    timeline: {
      type: "",
      width: "100%",
      height: "450",
      dataFormat: "json",
      dataSource: {
        chart: {
          animation: "1",
          defaultAnimation: "1",
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
            '<div style="display: flex;justify-content:space-between;width:100px"><b>$dataValue</b><span>$seriesName</span></div>',
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
  }),
  created: function () {
    var self = this;
    var dt = new Date();
    var dtSub = dt.setDate(dt.getDate() - 10);
    var dtLess = new Date(dtSub).toISOString().substr(0, 10);
    var dtForm = new Date().toISOString().substr(0, 10);
    self.dateRange = [dtLess, dtForm];

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
    dateRangeText1() {
      var self = this;
      if (self.dateRange.length > 0) {
        return (
          self.dateRange[0].substr(5, 2) +
          "/" +
          self.dateRange[0].substr(8, 2) +
          "/" +
          self.dateRange[0].substr(0, 4)
        );
      } else {
        return "";
      }
    },
    dateRangeText2() {
      var self = this;
      if (self.dateRange.length > 1) {
        return (
          self.dateRange[1].substr(5, 2) +
          "/" +
          self.dateRange[1].substr(8, 2) +
          "/" +
          self.dateRange[1].substr(0, 4)
        );
      } else {
        return "";
      }
    },
    dateRangeText() {
      var self = this;
      if (self.dateRange[1] == undefined) {
        return [];
      } else {
        return self.dateRangeText1 + " ~ " + self.dateRangeText2;
      }
    },
    startDate() {
      var self = this;
      return (
        self.dateRange[0].substr(5, 2) +
        "/" +
        self.dateRange[0].substr(8, 2) +
        "/" +
        self.dateRange[0].substr(0, 4)
      );
    },
    endDate() {
      var self = this;
      return (
        self.dateRange[1].substr(5, 2) +
        "/" +
        self.dateRange[1].substr(8, 2) +
        "/" +
        self.dateRange[1].substr(0, 4)
      );
    },
    chau() {
      var self = this;
      return {
        seriesname: "Chau",
        anchorBgColor: "#5D62B5",
        data: self.test.map(function (n) {
          return {
            value: n.chau.toString(),
          };
        }),
      };
    },
    kaitlyn() {
      var self = this;
      return {
        seriesname: "Kaitlyn",
        anchorBgColor: "#29C3BE",
        data: self.test.map(function (n) {
          return {
            value: n.kaitlyn.toString(),
          };
        }),
      };
    },
    paulette() {
      var self = this;
      return {
        seriesname: "Paulette",
        anchorBgColor: "#F2726F",
        data: self.test.map(function (n) {
          return {
            value: n.paulette.toString(),
          };
        }),
      };
    },
    total() {
      var self = this;
      return {
        seriesname: "Total",
        anchorBgColor: "#ffc533",
        data: self.test.map(function (n) {
          return {
            value: n.total.toString(),
          };
        }),
      };
    },

    test() {
      var self = this;
      return _.sortBy(
        _.map(_.countBy(self.sample, "ADD_DATE_SIMPLIFIED"), (val, key) => ({
          date: key,
          total: val,
          chau: self.sample.filter(function (a) {
            return a.LOCKED_USERID == "LeCha" && a.ADD_DATE_SIMPLIFIED == key;
          }).length,
          kaitlyn: self.sample.filter(function (a) {
            return a.LOCKED_USERID == "IncKai" && a.ADD_DATE_SIMPLIFIED == key;
          }).length,
          paulette: self.sample.filter(function (a) {
            return a.LOCKED_USERID == "PauPry" && a.ADD_DATE_SIMPLIFIED == key;
          }).length,
        })),
        "date"
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
        return n.label != "Total";
      });
    },
    procTotals() {
      var self = this;
      return self.timeline.dataSource.dataset
        .map(function (n) {
          return n.seriesname;
        })
        .map(function (n) {
          var x = self.timeline.dataSource.dataset.filter(function (m) {
            return m.seriesname == n;
          })[0];

          return {
            label: n,
            value: _.sumBy(x.data, function (l) {
              return Number(l.value);
            }),
            color: x.anchorBgColor,
          };
        });
    },
  },
  methods: {
    numberWithCommas: function (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    getSample(r, s) {
      var self = this;
      self.initLoading = true;
      self.dlProgress = 0;
      axios
        .post(
          "/web_projects/MyEnrollWebService/FSAMetricWebMethod.aspx/GET_FSA_PaperClaim_Metrics",
          {
            begin_date: r,
            end_date: s,
          },
          {
            onDownloadProgress: function (downloadEvent) {
              self.dlProgress = Math.round(
                (downloadEvent.loaded / downloadEvent.total) * 100
              );
            },
          }
        )
        .then(function (response) {
          self.sample = JSON.parse(response.data.d);
          setTimeout(function () {
            self.dlProgress = 0;
            self.initLoading = false;
          }, 1000);
        })
        .catch(function () {
          self.dlProgress = 0;
          self.initLoading = false;
          alert("error getting data");
        });
    },
    setChartData() {
      var self = this;
      self.timeline.type = "";
      self.spread.type = "";
      self.timeline.dataSource.dataset = [
        self.chau,
        self.kaitlyn,
        self.paulette,
        self.total,
      ];
      self.timeline.type = "msspline";
      self.spread.type = "doughnut2d";
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
