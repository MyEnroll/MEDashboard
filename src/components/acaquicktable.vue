<template>
  <v-container fluid dense>
    <v-row>
      <v-col>
        <transition name="fade">
          <v-card v-if="show" outlined>
            <v-card-title>{{ reporthdr }}</v-card-title>
            <v-data-table
              @click:row="detailExpose"
              class="elevation-0"
              disable-sort
              :headers="headers"
              :items="reports"
              :search="search"
              hide-default-footer
            >
              <template v-slot:[`item.report_title`]="{ item }">
                <span v-html="item.report_title"></span>
                <template v-if="item.report_help != ''">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn color="grey" v-on="on" icon>
                        <v-icon>mdi-information</v-icon>
                      </v-btn>
                    </template>
                    <v-card style="max-width: 350px">
                      <v-card-text v-html="item.report_help"></v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </template>
              <template v-slot:[`item.loc_count`]="{ item }">
                <template v-if="item.loc_count != ''">
                  {{ numberWithCommas(item.loc_count) }}
                </template>
                <template v-else>N/A</template>
              </template>
              <template v-slot:[`item.ee_count`]="{ item }">
                <template v-if="item.ee_count != ''">
                  {{ numberWithCommas(item.ee_count) }}
                </template>
                <template v-else>N/A</template>
              </template>
            </v-data-table>
          </v-card>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: 0.5s ease-in-out;
  opacity: 1;
  top: 0;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  top: -20px;
}
.v-data-table__mobile-row__cell {
  max-width: 70% !important;
}
.v-data-table__wrapper tr {
  cursor: pointer;
}
@media only screen and (min-width: 600px) {
  .v-data-table__wrapper tr td:first-child {
    width: 80%;
  }
}
.v-data-table__mobile-row {
  height: auto !important;
}
</style>
<script>
export default {
  name: "acaquicktable",
  data() {
    return {
      search: "",

      show: false,
      headers: [
        {
          text: "Issue",
          value: "report_title",
        },
        { text: "Location Count", value: "loc_count" },
        { text: "Employee Count", value: "ee_count" },
      ],
    };
  },
  methods: {
    numberWithCommas: function (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    detailExpose: function (value) {
      if (!this.downloadDialog) {
        this.$emit(
          "opendetails",
          value.report_title,
          value.loc_count,
          value.ee_count,
          true,
          value.chart_type,
          value.detail_rpt_id
        );
      }
    },
  },
  mounted: function () {
    var self = this;
    self.show = true;
  },
  props: ["reporthdr", "reports", "downloadDialog"],
};
</script>
