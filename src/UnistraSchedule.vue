<template>
  <v-app id="unistra-schedule">
    <v-navigation-drawer v-model="drawer"
                         disable-resize-watcher
                         app>
      <v-list dense>
        <v-list-item to="config">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>Personnaliser</v-list-item-content>
        </v-list-item>
        <v-list-item to="consult">
          <v-list-item-action>
            <v-icon>mdi-eye-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>Consulter</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar id="app-toolbar" app dense>
      <v-app-bar-nav-icon class="hidden-md-and-up"
                          @click.stop="drawer = !drawer">
      </v-app-bar-nav-icon>
      <v-btn color="primary" icon class="hidden-sm-and-down">
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text to="config"><strong>{{ buttons.customize }}</strong></v-btn>
        <v-btn text to="consult"><strong>Consulter</strong></v-btn>
      </v-toolbar-items>
      <div class="flex-grow-1"></div>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="$vuetify.theme.dark = !$vuetify.theme.dark">
            <v-icon>mdi-lightbulb</v-icon>
          </v-btn>
        </template>
        <span>{{ $vuetify.theme.isDark ? 'Light mode' : 'Dark mode' }}</span>
      </v-tooltip>
    </v-app-bar>
    <v-content>
      <v-img :src="require('@/assets/img/business.jpg')"
             :max-height="imageHeight">
        <v-row class="lightbox fill-height" justify="center">
          <v-col offset-sm="2" align-self="center" class="d-flex justify-center justify-sm-start">
            <signature />
          </v-col>
        </v-row>
      </v-img>
      <v-container class="pa-2"
                   fluid>
        <v-layout justify-center>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <v-divider></v-divider>
    <v-footer>
      <v-spacer></v-spacer>
      <span>2019 - <strong> Université de Strasbourg</strong> - Tous droits réservés</span>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
import Signature from '@/components/Signature.vue';

export default {
  name: 'UnitraSchedule',
  components: {
    Signature,
  },
  data: () => ({
    drawer: false,
    buttons: {
      customize: 'Personnaliser',
      view: 'Consulter',
    },
  }),
  computed: {
    imageHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '120';
        case 'sm':
          return '180';
        case 'md':
          return '240';
        default:
          return '300';
      }
    },
  },
};
</script>

<style scoped lang="sass">
#app-toolbar
  .v-toolbar__items
    .v-btn
      text-transform: capitalize
</style>
