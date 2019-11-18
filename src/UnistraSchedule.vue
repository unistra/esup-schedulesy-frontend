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
    console.log('IN CREATED');
    this.$store
      .dispatch('config/loadUserCustomization')
      .then((userCustomization) => {
        if (userCustomization.configuration && 'darkMode' in userCustomization.configuration) {
          this.$vuetify.theme.dark = userCustomization.configuration.darkMode;
        }
        // if (to.name !== 'home') next();
        // else next(userCustomization.resources ? ({ name: 'calendar' }) : ({ name: 'config' }));
      });
  },
};
</script>

<style scoped>
</style>
