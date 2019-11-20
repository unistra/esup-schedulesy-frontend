<template>
  <v-sheet>
    <viewer-events-list :eventsList="events"
                        :classrooms="eventsClassrooms"
                        @show-event="showEvent">
    </viewer-events-list>
    <v-menu v-model="selectedOpen"
            :activator="selectedElement">
      <viewer-event-detail :event="selectedEvent"
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

import ViewerEventsList from '@/components/viewer/ViewerEventsList.vue';

export default {
  name: 'ViewerList',
  components: {
    ViewerEventsList,
    ViewerEventDetail: () => import(/* webpacChunkName: "viewer" */ '@/components/viewer/ViewerEventDetail.vue'),
    ViewerMap: () => import(/* webpackChunkName: "geolocation" */ '@/components/viewer/ViewerMap.vue'),
  },
  data: () => ({
    today: '',
    selectedOpen: false,
    selectedElement: null,
    selectedEvent: {},
    selectedEventGeolocation: [],
    showEventMap: false,
  }),
  computed: {
    events() {
      return this.$store.getters['calendar/getEvents'];
    },
    eventsInstructors() {
      return this.$store.getters['calendar/getEventsInstructors'];
    },
    eventsClassrooms() {
      return this.$store.getters['calendar/getEventsClassrooms'];
    },
    eventsTrainees() {
      return this.$store.getters['calendar/getEventsTrainees'];
    },
    eventsCategory5() {
      return this.$store.getters['calendar/getEventsCategory5'];
    },
  },
  methods: {
    setToday() {
      this.$vuetify.goTo(`#d-${this.today}`);
    },
    objectFilter: (toFilter, allowed = []) => allowed.reduce((obj, key) => ({ ...obj, [key]: toFilter[key] }), {}),
    showEvent({ event, nativeEvent }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => this.selectedOpen = true, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    showMap(classroom) {
      this.selectedEventGeolocation = this.eventsClassrooms[classroom].geolocation;
      this.showEventMap = !this.showEventMap;
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
