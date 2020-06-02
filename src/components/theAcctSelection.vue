<template>
  <div>
    <v-autocomplete
      class="pt-0 mt-0"
      width="100%"
      v-model="masterSelected"
      :items="masterAcctList"
      :loading="isLoading"
      color="white"
      hide-no-data
      hide-selected
      item-text="ACCOUNT_NAME"
      item-value="ACCOUNT_NUMBER"
      placeholder="Start typing to Search"
    >
      <template v-slot:selection="data">
        <div
          class="text-truncate text-no-wrap"
        >{{ data.item.ACCOUNT_NAME }} - {{ data.item.ACCOUNT_NUMBER }}</div>
      </template>
      <template v-slot:item="data">
        <div
          class="text-truncate text-no-wrap"
        >{{ data.item.ACCOUNT_NAME }} - {{ data.item.ACCOUNT_NUMBER }}</div>
      </template>
      <template v-slot:search="data">
        <div
          class="text-truncate text-no-wrap"
        >{{ data.item.ACCOUNT_NAME }} - {{ data.item.ACCOUNT_NUMBER }}</div>
      </template>
    </v-autocomplete>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  name: "theAcctSelection",
  data: function() {
    return {
      masterAcctList: [],
      masterSelected: "",
      isLoading: false
    };
  },

  methods: {
    LoadMasterAccounts: function() {
      var self = this;
      $.ajax({
        type: "POST",
        url: "WebMethods.aspx/GetMasterAccounts",
        data: JSON.stringify({}),
        contentType: "application/json; charset=utf-8"
      })
        .fail(function() {
          alert("failed to retrieve list of accounts");
        })
        .done(function(n) {
          self.masterAcctList = JSON.parse(n.d);
        });
    }
  },
  watch: {
    masterSelected: function() {
      var self = this;
      if (self.masterSelected != undefined) {
        self.$emit(
          "selection",
          self.masterAcctList.filter(function(n) {
            return n.ACCOUNT_NUMBER == self.masterSelected;
          })[0].ACCOUNT_NAME,
          self.masterSelected
        );
      }
    }
  }
};
</script>
