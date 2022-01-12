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
    if (localStorage.getItem('JWT__access__token')) this.$store.dispatch('config/loadUserCustomization');
  },
};
</script>

<style scoped>
</style>
