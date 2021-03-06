<template>
  <v-app id="app">
    <v-navigation-drawer
      width="350"
      v-model="drawer"
      app
      color="blue-grey darken-4"
      dark
    >
      <v-list>
        <v-subheader class="subtitle-1">Account</v-subheader>
        <v-list-item>
          <accountSearch outlined class="pt-0 pb-4 ma-0" />
        </v-list-item>

        <v-subheader class="subtitle-1">Available Dashboards</v-subheader>
        <v-list-item-group v-model="selRoute">
          <router-link :to="{ name: 'Home' }">
            <v-list-item link value="Home">
              <v-list-item-action>
                <v-icon>mdi-home</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
          <router-link
            :to="{ name: item.name }"
            v-for="(item, index) in availDash"
            :key="index"
          >
            <v-list-item link :value="item.name">
              <v-list-item-action v-if="item.icon != ''">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.displayName }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app :color="appBarColor" flat hide-on-scroll dark>
      <v-btn
        @click.stop="drawer = !drawer"
        fab
        dark
        small
        color="teal accent-4 accent-1"
        class="elevation-2 mr-3"
      >
        <template v-if="drawer" mode>
          <v-icon>mdi-chevron-left</v-icon>
        </template>
        <template v-if="!drawer" mode>
          <v-icon>mdi-menu</v-icon>
        </template>
      </v-btn>
      <v-toolbar-title>Dashboards</v-toolbar-title>
      <transition name="slide-y-transition">
        <template v-if="this.$route.name != 'Home'">
          <v-btn
            color="teal accent-4 accent-1"
            text
            class="ml-3"
            @click="changeRt('Home')"
          >
            <v-icon>mdi-home</v-icon>Home
          </v-btn>
        </template>
      </transition>
      <v-spacer></v-spacer>
      <v-switch v-model="goDark" label="Dark"></v-switch>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <h2 class="display-1 font-weight-light">{{ this.$route.name }}</h2>
          </v-col>
        </v-row>

        <v-row align="center" justify="center" class="fill-height">
          <v-col class="py-0 px-3">
            <transition name="scroll-x-transition" mode="out-in" leave-absolute>
              <router-view></router-view>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <template>
      <div class="text-center ma-2">
        <v-snackbar v-model="acctSelected" top right :timeout="notifyTimeout">
          {{ notifyTxt }}
          <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </div>
    </template>
  </v-app>
</template>
<style scoped>
.v-application a {
  text-decoration: none;
}
.router-link-exact-active {
  color: #eceff1;
  box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.8);
}
</style>

<script>
import routes from "@/router/dashboardListing.js";
import accountSearch from "@/components/accountSearch";
export default {
  components: {
    accountSearch,
  },
  data: () => ({
    drawer: null,
    goDark: false,
    selRoute: "",
    appBarColor: "blue-grey darken-4",
    dashboards: routes.dashboards,
    acctSelected: false,
    notifyTxt: "",
    notifyTimeout: 3000,
    acctSelection: "",
  }),
  computed: {
    availDash: function () {
      var self = this;
      return self.dashboards.filter(function (n) {
        return n.active == 1;
      });
    },
  },
  mounted: function () {
    var self = this;
    setTimeout(function () {
      self.selRoute = self.$route.name;
    }, 1);
  },
  methods: {
    changeRt(r) {
      var router = this.$router;
      router.push({ name: r });
    },
    acctAlert(...args) {
      var [x, y] = args;
      this.acctSelected = true;
      this.acctSelection = y;
      this.notifyTxt = "Dashboards for " + x + " activated.";
    },
  },
  watch: {
    $route: function () {
      this.selRoute = this.$route.name;
    },
    goDark: function () {
      this.$store.dispatch("setDarkTheme", { theme: this.goDark });
      if (this.goDark) {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    },
  },
};
</script>
