<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <router-link :to="{ name: 'Home' }">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link :to="{name: 'Test'}">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-history</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Test</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Application</v-toolbar-title>
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
            <v-scroll-x-transition mode="out-in">
              <router-view :goDark="goDark"></router-view>
            </v-scroll-x-transition>
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
</style>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    goDark: false
  }),
  method: {},
  watch: {
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