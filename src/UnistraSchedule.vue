<template>
  <component :is="layout">
    <router-view :layout.sync="layout" />
  </component>
</template>

<script>
import CoreSnackbar from '@/components/core/CoreSnackbar.vue';

export default {
  name: 'UnistraSchedule',
  data: () => ({
    layout: 'div',
  }),
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
