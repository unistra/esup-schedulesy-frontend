<template>
  <v-sheet>
    <viewer-events-list
      :eventsList="viewerEvents"
      :classrooms="classrooms"
      @mounted="scrollToToday"
      @show-event="showEvent"
    />
    <v-menu
      v-model="selectedOpen"
      :activator="selectedElement"
    >
      <viewer-event-detail
        :event="selectedEvent"
        :category5s="objectFilter(category5s, selectedEvent.category5s)"
        :trainees="objectFilter(trainees, selectedEvent.trainees)"
        :instructors="objectFilter(instructors, selectedEvent.instructors)"
        :classrooms="objectFilter(classrooms, selectedEvent.classrooms)"
        @close="selectedOpen = false"
        @show-map="showMap"
      />
    </v-menu>
    <v-dialog v-model="showEventMap" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card tile>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="showEventMap = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Géolocalisation du bâtiment</v-toolbar-title>
        </v-toolbar>
        <viewer-map :coordinates="selectedEventGeolocation">
        </viewer-map>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import moment from 'moment';

import ListCalendar from '@/mixins/ListCalendar.vue';
import ViewerEventsList from '@/components/viewer/ViewerEventsList.vue';

export default {
  name: 'ViewerList',
  mixins: [ListCalendar],
  components: {
    ViewerEventsList,
    ViewerEventDetail: () => import(/* webpacChunkName: "viewer" */ '@/components/viewer/ViewerEventDetail.vue'),
    ViewerMap: () => import(/* webpackChunkName: "geolocation" */ '@/components/viewer/ViewerMap.vue'),
  },
  methods: {
    scrollToToday() {
      const today = this.$store.getters['ui/getCalendarToday'];

      // Get the events until today included
      const eventsUntilToday = this.viewerEvents
        .filter((event) => moment(event.start, 'YYYY-MM-DD') <= moment(today, 'YYYY-MM-DD'))
        .sort((a, b) => moment(b.start, 'YYYY-MM-DD hh:mm') - moment(a.start, 'YYYY-MM-DD hh:mm'))

      // If no event today or before => stay on top of the ListCalendar
      if (!eventsUntilToday) return

      // Go to today or the first date before today with events
      const eventDate = eventsUntilToday[0].start.substring(0, 10);
      this.$vuetify.goTo(`#d-${eventDate}`);
    },
  },
};
</script>

<style scoped>
</style>
