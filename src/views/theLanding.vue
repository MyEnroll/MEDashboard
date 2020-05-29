<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h3 class="title">Dashboard Launchpad</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p
          class="body-1"
        >Here you'll find all of your available dashboards. Use either to below cards or the navigation list to the left to view your latest dashboard.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(item,index) in availDash" :key="index" cols="12" md="4">
        <v-hover v-slot:default="{ hover }">
          <v-card
            outlined
            @click="changeRt(item.name)"
            :elevation="hover ? 4 : 0"
            style="height:100%"
          >
            <v-card-title v-text="item.name"></v-card-title>
            <v-card-text v-text="item.desc"></v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import dashboards from "@/router/dashboardListing.js";
export default {
  name: "theLanding",
  data: () => ({
    dashboardsList: dashboards.dashboards
  }),
  computed: {
    availDash: function() {
      var self = this;
      return self.dashboardsList.filter(function(n) {
        return n.active == 1;
      });
    }
  },
  methods: {
    changeRt(r) {
      var router = this.$router;
      router.push({ name: r });
    }
  }
};
</script>