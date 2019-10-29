<template>
  <v-app id="unistra-schedule"
         class=" unistra-schedule primary">
    <core-snackbar></core-snackbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import CoreSnackbar from '@/components/core/CoreSnackbar.vue';

export default {
  name: 'UnistraSchedule',
  components: {
    CoreSnackbar,
  },
  data: () => ({
    environment: process.env.VUE_APP_DEPLOYMENT_ENV.substr(0, 6),
  }),
  created() {
    if (this.$store.getters['auth/isLogged']) {
      this.$store
        .dispatch('config/loadUserCustomization')
        .then(() => {
          const userCustomization = this.$store.getters['config/getUserCustomization'];
          if (this.environment !== 'ernest' && userCustomization.configuration && 'darkMode' in userCustomization.configuration) this.$vuetify.theme.dark = userCustomization.configuration.darkMode;
          if (userCustomization.resources) {
            this.$router.push({ name: 'consult' });
          } else {
            this.$router.push({ name: 'config' });
          }
        });
    }
  },
};
</script>

<style scoped>
</style>
