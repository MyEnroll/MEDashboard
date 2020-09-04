<template id="account_search-template">
  <v-autocomplete
    v-model="acctSelect"
    :loading="loading"
    :items="items"
    :search-input.sync="search"
    item-text="ACCOUNT_NAME"
    item-value="ACCOUNT_NUM"
    cache-items
    return-object
    hide-no-data
    hide-details
    label="Master Account Selection"
    :outlined="outlined"
    :solo="solo"
    :solo-inverted="soloInverted"
    :filled="filled"
    full-width
  ></v-autocomplete>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import { mapActions } from "vuex";
export default {
  name: "accountSearch",

  props: {
    select: null,
    outlined: Boolean,
    solo: Boolean,
    soloInverted: Boolean,
    filled: Boolean,
    baseURL: String,
  },
  data() {
    return {
      loading: false,
      acctSelect: null,
      items: [],
      search: null,
    };
  },
  watch: {
    search(val) {
      var self = this;
      if (val != "") {
        self.loading = true;
        val && val !== this.select && this.queryAccountSelections(val);
      }
    },
    acctSelect: function () {
      var self = this;
      self.$emit(
        "changeSelectedAccount",
        self.acctSelect.ACCOUNT_NAME,
        self.acctSelect.ACCOUNT_NUM
      );
      self.setChosenAcct({
        acct: self.acctSelect.ACCOUNT_NUM,
        name: self.acctSelect.ACCOUNT_NAME,
      });
    },
  },
  methods: {
    ...mapActions(["setChosenAcct"]),

    queryAccountSelections: _.debounce(function queryAccountSelections(v) {
      var self = this;

      let url =
        "/web_projects/er_property_editor/WebService.asmx/" +
        "GetMasterSearchedAccount";
      axios
        .post(url, {
          search_box_context: v,
          row_count: "10",
          search_group: "3",
        })
        .then((response) => {
          self.items = JSON.parse(response.data.d);
        })
        .catch((error) => {
          console.log("There was an error: " + error.stack);
        });

      self.loading = false;
    }, 500),
  },
};
</script>
