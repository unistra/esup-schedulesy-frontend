<template>
  <v-col>
    <v-row v-if="environment !== 'ernest'">
      <v-col>
        <core-title
          class="primary--text"
          :title="pageTitle"
        />
      </v-col>
    </v-row>
    <core-section :title="{ class: 'headline', icon: 'mdi-calendar', content: 'Emploi du temps', level: 2 }">
      <router-view ref="viewer" />
    </core-section>
    <v-bottom-sheet
      v-model="bottomSheet"
      persistent
      hide-overlay
    >
      <v-sheet
        min-height="64"
        class="d-flex"
      >
        <v-btn
          text
          height="64"
          class="flex-grow-1"
          @click="setToday"
        >
          <strong>Aujourd'hui</strong>
        </v-btn>
        <v-btn
          text
          tile
          height="64"
          class="flex-grow-1"
          :to="{ name: 'list' }"
        >
          <strong>Liste</strong>
        </v-btn>
        <v-btn
          text
          tile
          height="64"
          class="flex-grow-1"
          :to="{ name: 'calendar' }"
        >
          <strong>Calendrier</strong>
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>
  </v-col>
</template>

<script>
import CoreTitle from '@/components/core/CoreTitle.vue';
import CoreSection from '@/components/core/CoreSection.vue';

export default {
  name: 'ScheduleViewer',
  components: {
    CoreTitle,
    CoreSection,
  },
  data: () => ({
    environment: process.env.VUE_APP_DEPLOYMENT_ENV.substr(0, 6),
    pageTitle: {
      level: 1,
      class: 'display-1',
      content: 'Consulter votre emploi du temps',
    },
  }),
  computed: {
    bottomSheet() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  methods: {
    setToday() {
      this.$refs.viewer.setToday();
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('calendar/loadUserEvents').then(() => {
      next();
    });
  },
};
</script>

<style scoped>
</style>
