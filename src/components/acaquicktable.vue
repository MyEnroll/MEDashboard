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
          ></v-data-table>
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
  mounted: function() {
    var self = this;
    self.show = true;
  },
  props: ["reporthdr", "reports"]
};
</script>
