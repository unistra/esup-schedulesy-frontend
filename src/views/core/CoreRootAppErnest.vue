<template>
  <v-container class="pa-2"
               fluid>
    <v-row justify="center">
      <ernest-schedule></ernest-schedule>
    </v-row>
  </v-container>
</template>

<script>
import ErnestSchedule from '@/views/ErnestSchedule.vue';

export default {
  name: 'CoreRootAppErnest',
  components: {
    ErnestSchedule,
  },
};
</script>

<style scoped>

</style>
