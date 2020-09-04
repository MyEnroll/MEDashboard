<template>
  <div>
    <div>
      <transition name="fade">
        <v-container>
          <v-slide-x-reverse-transition>
            <template v-if="allRepsLoaded">
              <v-btn
                fixed
                class="mt-5"
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
            :downloadDialog="downloadDialog"
            @opendetails="handleDetails"
          />
        </v-container>
      </transition>
    </div>
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
    <v-slide-x-reverse-transition>
      <template v-if="!allRepsLoaded">
        <v-card class="loadingCard">
          <v-scale-transition>
            <template v-if="!allRepsLoaded">
              <v-btn
                absolute
                depressed
                fab
                right
                small
                color="deep-purple accent-4"
                class="mt-2"
                dark
                @click="allRepsLoaded = true"
              >
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </template>
          </v-scale-transition>
          <v-card-title>Loading Reports...</v-card-title>
          <v-card-subtitle>While these reports are loading, you can hide this card.</v-card-subtitle>
          <v-card-text>
            <v-list dense disabled>
              <v-list-item-group>
                <v-list-item v-for="(item, index) in reportGroups" :key="index">
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
                    <v-list-item-title v-html="item.report"></v-list-item-title>
                    <v-list-item-subtitle v-html="item.report_sub" class="red--text text-wrap"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </template>
    </v-slide-x-reverse-transition>
    <template>
      <div class="text-center">
        <v-dialog v-model="downloadDialog" hide-overlay persistent width="350">
          <v-card color>
            <v-card-text>
              <v-window v-model="dlStep">
                <v-window-item :value="1">
                  <div class="text-h6 mb-4">Preparing to download your file</div>
                  <v-progress-linear indeterminate color="deep-purple accent-4" class="mb-0"></v-progress-linear>
                  <div class="mt-4">
                    <v-btn @click="cancelRequest" block outlined color="red accent-4">Cancel</v-btn>
                  </div>
                </v-window-item>

                <v-window-item :value="2">
                  <v-card-text>
                    <div class="text-h6 mb-2">File Ready for download</div>
                    <div class="text-caption font-weight-bold mb-1">Chosen Report</div>
                    <div class="text-caption mb-3">{{ fileDLPrep }}</div>
                    <v-container fluid class="pa-0">
                      <v-row>
                        <v-col>
                          <v-btn @click="exportCSV" outlined color="deep-purple accent-4">Download</v-btn>
                        </v-col>
                        <v-col>
                          <v-btn @click="resetDL" text color="pink accent-4">Close</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-window-item>
                <v-window-item :value="3">
                  <v-card-text>
                    <div class="text-h6 mb-2 red--text">Error with Download</div>

                    <div class="text-caption font-weight-bold mb-1">
                      An error occurred while attempting to download the following report:
                      <p class="mt-2 font-weight-bold red--text">{{ fileDLPrep }}</p>
                    </div>
                    <div
                      class="text-caption font-weight-bold my-2"
                    >Try again by closing this dialog and clicking the report again.</div>
                    <v-container fluid class="pa-0">
                      <v-row>
                        <v-col>
                          <v-btn @click="resetDL" outlined color="deep-purple accent-4">Ok</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </div>
</template>
<style>
th {
  font-weight: 800 !important;
  font-size: 1rem !important;
}
.loadingCard {
  position: fixed;
  top: 75px;
  right: 20px;
  max-width: 350px;
}
</style>
<script>
import acaquicktable from "@/components/acaquicktable.vue";
import $ from "jquery";
import { mapGetters } from "vuex";
export default {
  name: "quickView",

  components: {
    acaquicktable,
  },
  computed: {
    ...mapGetters(["accountNumber"]),
  },
  watch: {
    accountNumber() {
      this.initRun();
    },
    goDark: function () {
      var self = this;
      if (self.goDark) {
        this.$vuetify.theme.dark = true;
        this.selTheme = "Dark";
      } else {
        this.$vuetify.theme.dark = false;
        this.selTheme = "Light";
      }
    },
    reportGroups: {
      deep: true,
      handler: function () {
        var self = this;
        if (
          self.reportGroups.filter(function (n) {
            return n.loaded > 0;
          }).length == 6
        ) {
          setTimeout(function () {
            self.allRepsLoaded = true;
          }, 2000);
        }
      },
    },
  },
  data: () => ({
    fileDLPrep: "",
    dlStep: 1,
    downloadDialog: false,
    dlRequest: "",
    reportGroups: [
      {
        report: "Carrier Data Reconciliations",
        report_sub: "",
        loaded: 0,
        id: 6,
      },
      {
        report: "Special Features Issues",
        report_sub: "",
        loaded: 0,
        id: 5,
      },
      {
        report: "Hours Issues",
        report_sub: "",
        loaded: 0,
        id: 2,
      },
      {
        report: "Account Setup Issues",
        report_sub: "",
        loaded: 0,
        id: 1,
      },
      {
        report: "Benefit Plan Assignment Issues",
        report_sub: "",
        loaded: 0,
        id: 4,
      },
      {
        report: "Hours File Upload Issues",
        report_sub:
          "This is a big report and might take about a minute to load",
        loaded: 0,
        id: 3,
      },
    ],
    allRepsLoaded: false,
    reportIds: [1, 2, 3, 4, 5, 6],
    drawer: true,
    goDark: false,
    acctName: "Test Account",
    selTheme: "Light",
    dialog: false,
    reports: [],
    reportsDetails: [],
  }),
  methods: {
    exportCSV: function () {
      var self = this;
      var ShowLabel = true;
      var dt = new Date();
      var todayDt =
        ((dt.getMonth() + 1).toString().length == 1
          ? "0" + (dt.getMonth() + 1).toString()
          : dt.getMonth() + 1) +
        "-" +
        (dt.getDate().toString().length == 1
          ? "0" + dt.getDate().toString()
          : dt.getDate()) +
        "-" +
        dt.getFullYear();
      var arrData =
        typeof self.reportsDetails != "object"
          ? JSON.parse(self.reportsDetails[0])
          : self.reportsDetails[0];
      var CSV = "";
      if (ShowLabel) {
        var row = "";
        for (var index in arrData[0]) {
          row += index + ",";
        }
        row = row.slice(0, -1);
        CSV += row + "\r\n";
      }
      for (var i = 0; i < arrData.length; i++) {
        var row2 = "";
        for (var index2 in arrData[i]) {
          row2 += '"' + arrData[i][index2] + '",';
        }
        row2.slice(0, row2.length - 1);
        CSV += row2 + "\r\n";
      }
      if (CSV == "") {
        alert("Invalid data");
        return;
      }
      var fileName = "";
      fileName += self.fileDLPrep.replace(/ /g, "_") + "_" + todayDt;
      var uri = "data:text/csv;charset=utf-8," + escape(CSV);
      var link = document.createElement("a");
      link.href = uri;
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    resetDL() {
      var self = this;
      self.downloadDialog = false;
      self.dlStep = 1;
      self.reportsDetails = [];
    },
    handleDetails: function (...value) {
      var self = this;
      self.downloadDialog = true;
      self.fileDLPrep = value[0];
      self.dlRequest = $.ajax({
        type: "POST",
        url:
          "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReportData",
        data: JSON.stringify({
          group_id: 206,
          report_id: value[5],
        }),
        contentType: "application/json; charset=utf-8",
      })
        .done(function (n) {
          self.reportsDetails.push(JSON.parse(n.d));
          self.dlStep = 2;
        })
        .fail(function () {
          self.dlStep = 3;
        });
    },
    cancelRequest() {
      var self = this;
      self.dlRequest.abort();
      self.resetDL();
    },
    testDataExport: function (r) {
      $.ajax({
        type: "POST",
        url:
          "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReportData",
        data: JSON.stringify({
          group_id: 206,
          report_id: r,
        }),
        contentType: "application/json; charset=utf-8",
      }).done(function (n) {
        // self.reportsDetails.push(JSON.parse(n.d));
        console.log(n.d);
      });
    },
    recordVisit: function () {
      $.ajax({
        type: "POST",
        url:
          "/web_projects/MyEnrollWebService/TemplateWebMethod.aspx/SavePageHistory",
        data: JSON.stringify({
          page_id: "2687",
        }),
        contentType: "application/json; charset=utf-8",
      });
    },

    getData: function (e) {
      var self = this;
      $.ajax({
        type: "POST",
        url:
          "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReportData",
        data: JSON.stringify({
          group_id: 205,
          report_id: e,
        }),
        contentType: "application/json; charset=utf-8",
      })
        .done(function (n) {
          self.reports.push(JSON.parse(n.d)[0]);
          var tempX = JSON.parse(n.d);
          self.reportGroups.filter(function (r) {
            return r.report == tempX[0].report_group;
          })[0].loaded = 1;
        })
        .fail(function () {
          console.log("report id " + e + " fail");
          self.reportGroups.filter(function (r) {
            return r.id == e;
          })[0].loaded = 2;
        });
    },
    initRun() {
      var self = this;
      self.allRepsLoaded = false;
      if (
        window.location.href.toLowerCase().indexOf("bastest.com") > -1 ||
        window.location.href.toLowerCase().indexOf("myenroll.com") > -1
      ) {
        self.reports = [];
        $.each(self.reportIds, function (key, value) {
          self.getData(value);
        });
      } else {
        self.dialog = true;

        $.getJSON("./data/quickTableSample.json", function (data) {
          self.reports = data.reports;
        });
      }
    },
  },
  created: function () {
    this.recordVisit();
  },
  mounted: function () {
    var self = this;
    self.initRun();
  },
};
</script>
