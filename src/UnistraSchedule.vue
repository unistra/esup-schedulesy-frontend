<template>
  <v-app id="unistra-schedule">
    <v-content>
      <v-container>
        <schedule-configurator />
      </v-container>
    </v-content>
  </v-app>

</template>

<script>
import ScheduleConfigurator from '@/components/configurator/UnistraScheduleConfigurator.vue';

export default {
  name: 'UnitraSchedule',
  components: {
    ScheduleConfigurator,
  },
};
</script>

<style scoped>
#unistra-schedule {
  font-family: "Unistra A", Arial, sans-serif;
  font-size: 18px;
}
</style>
