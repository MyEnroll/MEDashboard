<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <acaquicktable
          v-for="(item, index) in reports"
          :key="index"
          :reports="item.details"
          :reporthdr="item.report_group"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import $ from "jquery";
import acaquicktable from "@/components/acaquicktable.vue";
export default {
  name: "acaDashboard",
  components: {
    acaquicktable
  },
  data: () => ({
    reports: []
  }),
  created: function() {
    this.getData();
  },
  methods: {
    getData: function() {
      var self = this;
      $.ajax({
        type: "POST",
        url: "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
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
        url: "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
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
        url: "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
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
        url: "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
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
        url: "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
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
        url: "/web_projects/MyEnrollWebService/ACAWebMethod.aspx/GetACAReport",
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
    }
  }
};
</script>
