<template>
  <v-col>
    <v-tabs v-model="activeTab"
            grow
            slider-size="4"
            background-color="white"
            color="#3e8f93">
      <v-tabs-slider color="#94cad1"></v-tabs-slider>
      <v-tab to="config"><strong>Personnaliser</strong></v-tab>
      <v-tab to="consult"><strong>Consulter</strong></v-tab>
    </v-tabs>
    <v-row>
      <router-view></router-view>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'ErnestSchedule',
  data: () => ({
    activeTab: '',
  }),
};
</script>

<style scoped>

</style>
