<template>
  <v-sheet>
    <viewer-events-list :eventsList="events"
                        :classrooms="eventsClassrooms"
                        @show-event="showEvent">
    </viewer-events-list>
    <v-menu v-model="selectedOpen"
            :activator="selectedElement">
      <viewer-event-detail :event="selectedEvent"
                           :category5s="objectFilter(eventsCategory5s, selectedEvent.category5s)"
                           :trainees="objectFilter(eventsTrainees, selectedEvent.trainees)"
                           :instructors="objectFilter(eventsInstructors, selectedEvent.instructors)"
                           :classrooms="objectFilter(eventsClassrooms, selectedEvent.classrooms)"
                           @close="selectedOpen = false"
                           @show-map="showMap">
      </viewer-event-detail>
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
  data: () => ({
    today: '',
  }),
  methods: {
    setToday() {
      this.$vuetify.goTo(`#d-${this.today}`);
    },
  },
  mounted() {
    const now = this.$store.getters['ui/getCalendarToday'];
    this.today = this.events
      .filter(event => moment(event.start, 'YYYY-MM-DD') >= moment(now, 'YYYY-MM-DD'))
      .sort((a, b) => moment(a.start, 'YYYY-MM-DD') - moment(b.start, 'YYYY-MM-DD'))[0]
      .start.substring(0, 10);
    this.setToday();
  },
};
</script>

<style scoped>
</style>
