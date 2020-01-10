<template>
  <v-app-bar id="app-toolbar" app dense>
    <v-app-bar-nav-icon class="hidden-md-and-up"
                        @click.stop="openNavDrawer">
    </v-app-bar-nav-icon>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-tabs slider-size="4">
        <v-tab :to="{ name: 'config' }"><strong>Personnaliser</strong></v-tab>
        <v-tab :to="{ name: 'calendar' }"><strong>Consulter</strong></v-tab>
      </v-tabs>
    </v-toolbar-items>
    <div class="flex-grow-1"></div>
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="$emit('dark-mode', !$vuetify.theme.dark)" :aria-label="colorMode">
          <v-icon>mdi-lightbulb</v-icon>
        </v-btn>
      </template>
      <span>{{ colorMode }}</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script>
export default {
  name: 'CoreAppBar',
  methods: {
    openNavDrawer() {
      this.$store.dispatch('ui/openNavDrawer');
    },
  },
  computed: {
    colorMode() {
      const newTheme = this.$vuetify.theme.isDark ? 'clair' : 'sombre';
      return `Mode ${newTheme}`;
    },
  },
};
</script>

<style scoped lang="sass">
#app-toolbar
  .v-toolbar__items
    .v-btn
      text-transform: capitalize
</style>
