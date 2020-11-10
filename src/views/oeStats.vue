<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="auto">
        <v-select
          v-model="procYear"
          :items="years"
          label="Processing Year"
        ></v-select>
      </v-col>
    </v-row>
    <v-fade-transition mode="out-in">
      <template v-if="procYear != ''">
        <v-row>
          <v-col cols="12">
            <v-slide-y-transition>
              <template v-if="procYear != ''">
                <v-card :loading="dataLoading">
                  <v-card-title key="year">
                    {{ procYear }} Vs. {{ Number(procYear) - 1 }}
                  </v-card-title>

                  <v-card-text class="text-center justify-center">
                    <template v-if="oeData.length > 0">
                      <fusioncharts
                        key="datachart"
                        ref="oeChart"
                        :type="oeChart.type"
                        :width="oeChart.width"
                        :height="oeChart.height"
                        :dataformat="oeChart.dataFormat"
                        :dataSource="oeChart.dataSource"
                      ></fusioncharts>
                    </template>
                    <template v-else-if="oeData.length == 0 && dataLoading">
                      <v-progress-circular
                        key="loadingcircle"
                        color="deep-purple accent-4"
                        width="10"
                        indeterminate
                        size="72"
                      ></v-progress-circular>
                    </template>
                  </v-card-text>
                </v-card>
              </template>
            </v-slide-y-transition>
          </v-col>
          <v-col cols="12">
            <v-slide-y-transition>
              <template v-if="procYear != ''">
                <v-card :loading="dataLoading">
                  <v-card-title>
                    {{ procYear }} Vs. {{ Number(procYear) - 1 }} Details
                    <v-spacer></v-spacer>
                    <template v-if="!dataLoading">
                      <v-text-field
                        v-model="tableFilter"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </template>
                  </v-card-title>
                  <v-card-text class="text-center justify-center">
                    <v-fade-transition mode="out-in">
                      <template v-if="oeData.length > 0 && !dataLoading">
                        <v-data-table
                          hide-default-footer
                          disable-pagination
                          :headers="headers"
                          :items="filtered"
                          :search="tableFilter"
                        ></v-data-table
                      ></template>
                      <template v-else-if="oeData.length == 0 && dataLoading">
                        <v-progress-circular
                          key="loadingcircle"
                          color="deep-purple accent-4"
                          width="10"
                          indeterminate
                          size="72"
                        ></v-progress-circular>
                      </template>
                    </v-fade-transition>
                  </v-card-text>
                </v-card>
              </template>
            </v-slide-y-transition>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row justify="center" align="center" key="needyear">
          <v-col cols="12" class="justify-center text-center">
            <v-icon size="100" color="primary"> mdi-magnify </v-icon>
            <h5 class="text-h5">Choose a Processing Year to get started</h5>
          </v-col>
        </v-row>
      </template>
    </v-fade-transition>
  </v-container>
</template>

<script>
import Vue from "vue";
import VueFusionCharts from "vue-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
import ZuneTheme from "fusioncharts/themes/fusioncharts.theme.zune";
import CarbonTheme from "fusioncharts/themes/fusioncharts.theme.carbon";
// import _ from "lodash";
import axios from "axios";
Vue.use(
  VueFusionCharts,
  FusionCharts,
  Column2D,
  FusionTheme,
  CandyTheme,
  ZuneTheme,
  CarbonTheme
);
export default {
  name: "oeStats",
  data() {
    return {
      procYear: "",
      tableFilter: "",
      dataLoading: false,
      years: [2020, 2019, 2018, 2017, 2016, 2015],
      oeData: [],
      selAcct: "",
      totalComp: "",
      oeChart: {
        type: "msline",
        width: "100%",
        height: "450",
        dataFormat: "json",

        dataSource: {
          chart: {
            animation: "1",
            defaultAnimation: "1",
            valueBorderRadius: 20,
            shadowAlpha: "50",
            yaxisname: "Enrollments Completed",
            plottooltext:
              "<div style='display:flex;justify-content:space-between;align-items-center;min-width:115px'><b>$seriesName</b> <span>$value</span></div>",
            showZeroPlane: "1",
            showhovereffect: "1",
            showLabels: "1",
            drawcrossline: "1",
            labelDisplay: "rotate",
            slantLabel: "1",
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
      headers: [
        {
          text: "Date",
          align: "start",
          sortable: false,
          value: "ON_DATE",
        },

        { text: "", value: "COMPLETED" },
        { text: "", value: "PREVIUOSYEARCOMPLETED" },
        { text: "Started - Not Finished", value: "STARTED_NOT_FINISHED" },
      ],
    };
  },
  methods: {
    getData() {
      var self = this;
      self.dataLoading = true;
      if (self.domain == 1) {
        self.oeData = [];
        self.dataLoading = true;
        setTimeout(function () {
          axios
            .get("/data/oesample.json")
            .then(function (response) {
              self.oeData = response.data;
            })
            .finally(function () {
              self.setChartCategories(self.dates);
              self.setChartData();
              self.dataLoading = false;
            });
        }, 2000);
      } else {
        axios
          .post(
            "/web_projects/MyEnrollWebService/TemplateWebMethod.aspx/for_job_eo_stat_1",
            {
              processing_year: self.procYear,
              account_number: self.selAcct,
            }
          )
          .fail(function () {
            alert("data retrieval failed");
          })
          .then(function (response) {
            self.oeData = JSON.parse(response.data.d);
            self.dataLoading = false;
          });
      }
    },
    setChartCategories(r) {
      var self = this;
      self.oeChart.dataSource.categories[0].category = [];
      r.forEach(function (n) {
        self.oeChart.dataSource.categories[0].category.push({ label: n });
      });
    },
    setTrendLine() {
      var self = this;
      self.oeChart.dataSource.trendlines[0].line[0].endvalue =
        self.minMax.current.max;
      self.oeChart.dataSource.trendlines[0].line[0].startvalue =
        self.minMax.current.min;
    },
    setChartData() {
      var self = this;
      self.oeChart.type = "";
      self.oeChart.dataSource.dataset = [];
      self.headers[2].text = Number(self.procYear) - 1;
      self.headers[1].text = Number(self.procYear);

      setTimeout(function () {
        self.oeChart.dataSource.dataset = [self.currentYear, self.previousYear];
        self.oeChart.type = "msline";
      }, 1);
    },
  },
  computed: {
    minMax() {
      var self = this;
      return {
        current: {
          min: Math.min(
            ...self.currentYear.data.map(function (n) {
              return n.value;
            })
          ),
          max: Math.max(
            ...self.currentYear.data.map(function (n) {
              return n.value;
            })
          ),
        },
        previous: {
          min: Math.min(
            ...self.previousYear.data.map(function (n) {
              return n.value;
            })
          ),
          max: Math.max(
            ...self.previousYear.data.map(function (n) {
              return n.value;
            })
          ),
        },
      };
    },
    currentYear() {
      var self = this;
      return {
        seriesname: "Current Year",
        data: self.oeData
          .filter(function (m) {
            return Object.prototype.hasOwnProperty.call(m, "ON_DATE");
          })
          .map(function (n) {
            return {
              value: n.COMPLETED,
            };
          }),
      };
    },
    previousYear() {
      var self = this;
      return {
        seriesname: "Previous Year",
        data: self.oeData.map(function (n) {
          return {
            value:
              n.PREVIUOSYEARCOMPLETED === undefined
                ? 0
                : n.PREVIUOSYEARCOMPLETED,
          };
        }),
      };
    },
    dates() {
      var self = this;
      return self.oeData
        .filter(function (m) {
          return Object.prototype.hasOwnProperty.call(m, "ON_DATE");
        })
        .map(function (m) {
          return m.ON_DATE;
        });
    },
    filtered() {
      var self = this;
      return self.oeData.filter(function (n) {
        return Object.prototype.hasOwnProperty.call(n, "ON_DATE");
      });
    },
    domain() {
      return location.href.toLowerCase().indexOf("localhost") > -1 ? 1 : 0;
    },
  },

  watch: {
    procYear() {
      var self = this;
      self.getData();
    },
  },
};
</script>

<style>
</style>