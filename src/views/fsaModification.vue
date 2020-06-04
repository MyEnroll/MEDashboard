<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn text color="deep-purple" @click="exportCSV(productionFSA,'Report',true)">
          <v-icon>mdi-cloud-download</v-icon>
          <span class="ml-2">Download</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-title>Production Changes</v-card-title>
          <v-card-text>
            <v-data-table :items-per-page="rowsPer" :headers="tableHdr" :items="productionFSA"></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { db } from "../db";
export default {
  name: "fsaModification",
  data: () => ({
    fsaMods: [],
    rowsPer: 15,
    tableHdr: [
      {
        text: "Employee",
        align: "start",
        sortable: true,
        value: "User"
      },
      {
        text: "FSA Type",
        align: "start",
        sortable: true,
        value: "FSA_Type"
      },
      {
        text: "Modification",
        align: "start",
        sortable: true,
        value: "ModType"
      },
      {
        text: "Current Election",
        align: "start",
        sortable: true,
        value: "fsa_annual_election"
      },
      {
        text: "New Cont. Amount",
        align: "start",
        sortable: true,
        value: "NewElect"
      }
    ]
  }),
  firestore: {
    documents: db.collection("Log")
  },

  computed: {
    productionFSA: function() {
      return this.fsaMods.filter(function(n) {
        return n.Environment == "production";
      });
    },
    testFSA: function() {
      return this.fsaMods.filter(function(n) {
        return n.Environment == "test";
      });
    }
  },
  created: function() {
    var self = this;
    self.getFBData();
  },
  methods: {
    exportCSV: function(JSONData, ReportTitle, ShowLabel) {
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
        typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;

      var CSV = "";
      //Set Report title in first row or line

      CSV += ReportTitle + "\r\n\n";

      //This condition will generate the Label/Header
      if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
          //Now convert each value to string and comma-seprated
          row += index + ",";
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + "\r\n";
      }

      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
        var row2 = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index2 in arrData[i]) {
          row2 += '"' + arrData[i][index2] + '",';
        }

        row2.slice(0, row2.length - 1);

        //add a line break after each row
        CSV += row2 + "\r\n";
      }

      if (CSV == "") {
        alert("Invalid data");
        return;
      }

      //Generate a file name
      var fileName = "";
      //this will remove the blank-spaces from the title and replace it with an underscore
      fileName += ReportTitle.replace(/ /g, "_") + "_" + todayDt;

      //Initialize file format you want csv or xls
      var uri = "data:text/csv;charset=utf-8," + escape(CSV);

      // Now the little tricky part.
      // you can use either>> window.open(uri);
      // but this will not work in some browsers
      // or you will not get the correct file extension

      //this trick will generate a temp <a /> tag
      var link = document.createElement("a");
      link.href = uri;

      //set the visibility hidden so it will not effect on your web-layout
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";

      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
    getFBData() {
      var temp = [];
      var self = this;
      db.collection("Log")
        .get()
        .then(function(doc) {
          doc.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            self.fsaMods.push(doc.data());
          });
          console.log(temp);
        });
    }
  }
};
</script>