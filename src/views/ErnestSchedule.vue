<template>
  <v-col>
    <v-tabs v-model="activeTab"
            grow
            slider-size="4"
            background-color="white"
            color="#3e8f93">
      <v-tabs-slider color="#94cad1"></v-tabs-slider>
      <v-tab><strong>Personnaliser</strong></v-tab>
      <v-tab><strong>Consulter</strong></v-tab>
      <v-tab-item style="background-color: #eeeeee">
        <v-row>
          <schedule-configurator v-if="activeTab === 0"/>
        </v-row>
      </v-tab-item>
      <v-tab-item style="background-color: #eeeeee">
        <v-row>
          <schedule-viewer v-if="activeTab === 1" />
        </v-row>
      </v-tab-item>
    </v-tabs>
  </v-col>
</template>

<script>
export default {
  name: 'ErnestSchedule',
  components: {
    ScheduleConfigurator: () => import('@/views/ScheduleConfigurator.vue'),
    ScheduleViewer: () => import('@/views/ScheduleViewer.vue'),
  },
  data: () => ({
    activeTab: null,
  }),
};
</script>

<style scoped>

</style>
