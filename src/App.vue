<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app color="blue-grey darken-4" dark>
      <v-list>
        <v-subheader class="subheader-1">Available Dashboards</v-subheader>
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
          <router-link :to="{ name: item.name }" v-for="(item, index) in availDash" :key="index">
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

    <v-app-bar app color="transparent" flat>
      <v-btn @click.stop="drawer = !drawer" fab small color="primary" class="elevation-2 mr-3">
        <template v-if="drawer" mode>
          <v-icon>mdi-chevron-left</v-icon>
        </template>
        <template v-if="!drawer" mode>
          <v-icon>mdi-menu</v-icon>
        </template>
      </v-btn>
      <v-toolbar-title>Dashboards</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch v-model="goDark" label="Dark"></v-switch>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row>
          <v-col>
            <h2 class="display-1 font-weight-light">{{ this.$route.name }}</h2>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col class="py-0 px-3">
            <transition name="scroll-x-transition" mode="out-in">
              <router-view :goDark="goDark"></router-view>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
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
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    goDark: false,
    selRoute: "",
    dashboards: routes.dashboards
  }),
  computed: {
    availDash: function() {
      var self = this;
      return self.dashboards.filter(function(n) {
        return n.active == 1;
      });
    }
  },
  mounted: function() {
    var self = this;
    setTimeout(function() {
      self.selRoute = self.$route.name;
    }, 1);
  },
  watch: {
    $route: function() {
      this.selRoute = this.$route.name;
    },
    goDark: function() {
      if (this.goDark) {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    }
  }
};
</script>
