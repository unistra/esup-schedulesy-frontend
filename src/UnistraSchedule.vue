<template>
  <v-app id="unistra-schedule"
    class="primary">
    <template v-if="environment !== 'ernest'">
      <core-snackbar></core-snackbar>
      <core-nav-drawer></core-nav-drawer>
      <core-app-bar @dark-mode="setDarkMode"></core-app-bar>
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
      <core-footer></core-footer>
    </template>
    <template v-else>
      <v-container class="pa-2"
                   fluid>
      <v-row justify="center">
        <ernest-schedule></ernest-schedule>
      </v-row>
      </v-container>
    </template>
  </v-app>
</template>

<script>
import Signature from '@/components/Signature.vue';
import CoreSnackbar from '@/components/core/CoreSnackbar.vue';
import CoreNavDrawer from '@/components/core/CoreNavDrawer.vue';
import CoreAppBar from '@/components/core/CoreAppBar.vue';
import CoreFooter from '@/components/core/CoreFooter.vue';

export default {
  name: 'UnistraSchedule',
  components: {
    Signature,
    CoreSnackbar,
    CoreNavDrawer,
    CoreAppBar,
    CoreFooter,
    ErnestSchedule: () => import(/* webpackChunkName: "ernest" */ '@/views/ErnestSchedule.vue'),
  },
  data: () => ({
    environment: process.env.VUE_APP_DEPLOYMENT_ENV.substr(0, 6),
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
  created() {
    if (this.$store.getters['auth/isLogged']) {
      this.$store
        .dispatch('config/loadUserCustomization')
        .then(() => {
          const userCustomization = this.$store.getters['config/getUserCustomization'];
          if (this.environment !== 'ernest' && userCustomization.configuration && 'darkMode' in userCustomization.configuration) this.$vuetify.theme.dark = userCustomization.configuration.darkMode;
        });
    }
  },
  methods: {
    setDarkMode(value) {
      const payload = {
        changes: {
          configuration: {
            ...this.$store.getters['config/getUserCustomization'].configuration,
            ...{ darkMode: value },
          },
        },
        snackbar: {
          success: {
            isVisible: true,
            color: 'success',
            message: 'Votre configuration d\'affichage a bien été mise à jour.',
            timeout: 6000,
          },
          error: {
            isVisible: true,
            color: 'error',
            message: 'Une erreur est survenue pendant la mise à jour de votre configuration d\'affichage',
            timeout: 6000,
          },
        },
      };
      this.$store
        .dispatch('config/patchUserCustomization', payload)
        .then(() => { this.$vuetify.theme.dark = value; });
    },
  },
};
</script>

<style scoped>
</style>
