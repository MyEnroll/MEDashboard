<template>
  <v-container fluid>
    <v-scroll-x-transition>
      <template v-if="!allRepsLoaded">
        <v-card class="loadingCard">
          <v-scale-transition>
            <template v-if="!allRepsLoaded">
              <v-btn absolute icon top right class="m-2" @click="allRepsLoaded = true">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-scale-transition>
          <v-card-title>Loading Reports...</v-card-title>
          <v-card-text>
            <v-list dense disabled>
              <v-list-item-group>
                <v-list-item v-for="(item,index) in reportGroups" :key="index">
                  <v-list-item-icon style="width:24px">
                    <v-scale-transition leave-absolute>
                      <template v-if="item.loaded == 0">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </template>
                    </v-scale-transition>
                    <v-scale-transition leave-absolute>
                      <template v-if="item.loaded == 1">
                        <v-icon color="success">mdi-check</v-icon>
                      </template>
                    </v-scale-transition>
                    <v-scale-transition leave-absolute>
                      <template v-if="item.loaded == 2">
                        <v-icon color="error">mdi-close</v-icon>
                      </template>
                    </v-scale-transition>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.report}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </template>
    </v-scroll-x-transition>
    <v-row>
      <v-col>
        <div>
          <transition name="fade">
            <v-container>
              <v-slide-x-reverse-transition>
                <template v-if="allRepsLoaded">
                  <v-btn
                    fixed
                    class="mt-15 mr-5"
                    top
                    right
                    text
                    color="deep-purple accent-4"
                    @click="allRepsLoaded = false"
                  >Status</v-btn>
                </template>
              </v-slide-x-reverse-transition>

              <acaquicktable
                v-for="(item, index) in reports"
                :key="index"
                :reports="item.details"
                :reporthdr="item.report_group"
                @opendetails="detailsDialog"
              />
              <v-dialog v-model="dialog" persistent max-width="290">
                <v-card>
                  <v-card-title class="headline">Sample Data</v-card-title>
                  <v-card-text>The data presented in this application is for demo purposes only.</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialog = false">I Understand</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-row justify="center">
                <v-dialog v-model="detailDialog" max-width="800px" top>
                  <v-card>
                    <v-card-title>
                      <span class="headline pr-5">{{ detailTitle }}</span>
                      <v-spacer></v-spacer>
                      <v-btn @click="detailDialog = !detailDialog" icon absolute top right>
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <template v-if="detailDialog">
                        <fusionchart
                          :chartdata="chartData"
                          :chartType="chartType"
                          ref="fusionchart"
                        />
                        <fusionwidget ref="fusionwidget" />
                      </template>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-row>
            </v-container>
          </transition>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="detailDialog" max-width="800px" top>
        <v-card>
          <v-card-title>
            <span class="headline pr-5">{{ detailTitle }}</span>
            <v-spacer></v-spacer>
            <v-btn @click="detailDialog = !detailDialog" icon absolute top right>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <template v-if="detailDialog">
              <fusionchart :chartdata="chartData" :chartType="chartType" ref="fusionchart" />
              <fusionwidget ref="fusionwidget" />
            </template>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<style scoped>
.me-top-right {
  position: absolute;
  top: -15px;
  right: 20px;
}
.loadingCard {
  position: fixed;
  top: 75px;
  right: 20px;
  max-width: 350px;
  z-index: 999;
}
</style>
<script>
import Vue from "vue";
import $ from "jquery";
import acaquicktable from "@/components/acaquicktable.vue";
import fusionchart from "@/components/fusionChart.vue";
import fusionwidget from "@/components/fusionWidget.vue";
import VueFusionCharts from "vue-fusioncharts";
import FusionWidgets from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

Vue.use(VueFusionCharts, FusionWidgets, Widgets, Charts, FusionTheme);
export default {
  name: "acaDashboard",
  props: ["acctSelection"],
  components: {
    acaquicktable,
    fusionchart,
    fusionwidget
  },
  data: () => ({
    reports: [],
    dialog: false,
    reportGroups: [
      {
        report: "Carrier Data Reconciliations",
        loaded: 0,
        id: 6
      },
      {
        report: "Special Features Issues",
        loaded: 0,
        id: 5
      },
      {
        report: "Hours Issues",
        loaded: 0,
        id: 2
      },
      {
        report: "Account Setup Issues",
        loaded: 0,
        id: 1
      },
      {
        report: "Benefit Plan Assignment Issues",
        loaded: 0,
        id: 4
      },
      {
        report: "Hours File Upload Issues",
        loaded: 0,
        id: 3
      }
    ],
    allRepsLoaded: false,
    reportIds: [1, 2, 3, 4, 5, 6],
    detailDialog: false,
    detailTitle: "",
    detailLocCnt: null,
    detailEECnt: null,
    chartData: [
      {
        label: "Affected Locations",
        value: ""
      },
      {
        label: "Total Locations",
        value: ""
      }
    ],
    chartType: ""
  }),
  created: function() {
    this.getData();
  },
  watch: {
    detailsDialog: function() {
      if (!this.detailDialog) {
        this.chartData[0].value = "";
        this.chartData[1].value = "";
        this.chartType = "";
      }
    }
  },
  methods: {
    detailsDialog(...args) {
      var [w, x, y, z, a] = args;
      var self = this;
      this.detailDialog = z;
      this.detailTitle = w;
      this.detailLocCnt = x;
      this.detailEECnt = y;
      self.chartData[0].value = x;
      self.chartData[1].value = y;
      self.chartType = a;
    },
    getData: function() {
      var self = this;
      if (
        window.location.href.toLowerCase().indexOf("bastest.com") > -1 ||
        window.location.href.toLowerCase().indexOf("myenroll.com") > -1
      ) {
        $.ajax({
          type: "POST",
          url:
            "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
          data: JSON.stringify({
            report_id: 1
          }),
          contentType: "application/json; charset=utf-8"
        })
          .done(function(n) {
            self.reports.push(JSON.parse(n.d)[0]);
          })
          .fail(function() {
            console.log("fail");
          });
        $.ajax({
          type: "POST",
          url:
            "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
          data: JSON.stringify({
            report_id: 2
          }),
          contentType: "application/json; charset=utf-8"
        })
          .done(function(n) {
            self.reports.push(JSON.parse(n.d)[0]);
          })
          .fail(function() {
            console.log("fail");
          });
        $.ajax({
          type: "POST",
          url:
            "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
          data: JSON.stringify({
            report_id: 3
          }),
          contentType: "application/json; charset=utf-8"
        })
          .done(function(n) {
            self.reports.push(JSON.parse(n.d)[0]);
          })
          .fail(function() {
            console.log("fail");
          });
        $.ajax({
          type: "POST",
          url:
            "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
          data: JSON.stringify({
            report_id: 4
          }),
          contentType: "application/json; charset=utf-8"
        })
          .done(function(n) {
            self.reports.push(JSON.parse(n.d)[0]);
          })
          .fail(function() {
            console.log("fail");
          });
        $.ajax({
          type: "POST",
          url:
            "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
          data: JSON.stringify({
            report_id: 5
          }),
          contentType: "application/json; charset=utf-8"
        })
          .done(function(n) {
            self.reports.push(JSON.parse(n.d)[0]);
          })
          .fail(function() {
            console.log("fail");
          });
        $.ajax({
          type: "POST",
          url:
            "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
          data: JSON.stringify({
            report_id: 6
          }),
          contentType: "application/json; charset=utf-8"
        })
          .done(function(n) {
            self.reports.push(JSON.parse(n.d)[0]);
          })
          .fail(function() {
            console.log("fail");
          });
      } else {
        $.getJSON("./data/quickTableSample.json", function(d) {
          self.reports = d.reports;
        });
      }
    }
  }
};
</script>
