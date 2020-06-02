<template>
  <v-row>
    <v-col>
      <transition name="fade">
        <v-card v-if="show">
          <v-card-title>{{ reporthdr }}</v-card-title>
          <v-data-table
            disable-sort
            :headers="headers"
            :items="reports"
            :search="search"
            hide-default-footer
          >
            <template v-slot:item.report_title="{ item }">
              {{item.report_title}}
              <template v-if="item.report_help != ''">
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on" icon>
                      <v-icon>mdi-information</v-icon>
                    </v-btn>
                  </template>
                  <v-card style="max-width:350px">
                    <v-card-text v-text="item.report_help"></v-card-text>
                  </v-card>
                </v-menu>
              </template>
            </template>
            <template v-slot:item.loc_count="{ item }">
              <template v-if="item.loc_count != ''">{{numberWithCommas(item.loc_count)}}</template>
              <template v-else>N/A</template>
            </template>
            <template v-slot:item.ee_count="{ item }">
              <template v-if="item.ee_count != ''">{{numberWithCommas(item.ee_count)}}</template>
              <template v-else>N/A</template>
            </template>
          </v-data-table>
        </v-card>
      </transition>
    </v-col>
  </v-row>
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
          value: "report_title"
        },
        { text: "Location Count", value: "loc_count" },
        { text: "Employee Count", value: "ee_count" }
      ]
    };
  },
  methods: {
    numberWithCommas: function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  mounted: function() {
    var self = this;
    self.show = true;
  },
  props: ["reporthdr", "reports", "acctSelection"]
};
</script>
