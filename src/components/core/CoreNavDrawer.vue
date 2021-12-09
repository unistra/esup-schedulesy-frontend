<template>
  <v-navigation-drawer v-model="isDrawerOpen"
                       disable-resize-watcher
                       app>
    <v-list dense>
      <v-list-item :to="{ name: 'config' }">
        <v-list-item-action>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-action>
        <v-list-item-content>Personnaliser</v-list-item-content>
      </v-list-item>
      <v-list-item :to="calendarOrList">
        <v-list-item-action>
          <v-icon>mdi-eye-check</v-icon>
        </v-list-item-action>
        <v-list-item-content>Consulter</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'CoreNavDrawer',
  computed: {
    isDrawerOpen: {
      get() {
        return this.$store.getters['ui/getIsNavDrawerOpen'];
      },
      set(value) {
        this.$store.dispatch('ui/updateDrawerState', value);
      },
    },
    calendarOrList() {
      const userCustomization = this.$store.getters['config/getUserCustomization'];
      const userDisplayMode = userCustomization.configuration && userCustomization.configuration.displayMode
        ? userCustomization.configuration.displayMode
        : null;
      return {
        name: userDisplayMode && userDisplayMode === 'list' ? 'list' : 'calendar',
      };
    },
  },
};
</script>

<style scoped>

</style>
