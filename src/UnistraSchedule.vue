<template>
  <v-app id="unistra-schedule">
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>

</template>

<script>

export default {
  name: 'UnitraSchedule',
};
</script>

<style scoped>
#unistra-schedule {
  font-family: "Unistra A", Arial, sans-serif;
  font-size: 18px;
}
</style>
