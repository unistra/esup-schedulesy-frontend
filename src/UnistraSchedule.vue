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
  created() {
    this.$store
      .dispatch('config/loadUserCustomization')
      .then((userCustomization) => {
        if (userCustomization.configuration && 'darkMode' in userCustomization.configuration) {
          this.$vuetify.theme.dark = userCustomization.configuration.darkMode;
        }
      });
  },
};
</script>

<style scoped>
</style>
