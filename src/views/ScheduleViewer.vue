<template>
  <v-col xs="12"
         :sm="environment === 'ernest' ? 12 : 11"
         :md="environment === 'ernest' ? 12 : 10"
         :lg="environment === 'ernest' ? 12 : 9">
    <v-row v-if="environment !== 'ernest'">
      <v-col>
        <core-title class="primary--text"
                    :title="pageTitle">
        </core-title>
      </v-col>
    </v-row>
    <core-section :title="{ class: 'headline', icon: 'mdi-calendar', content: 'Emploi du temps', level: 2 }">
      <viewer-toolbar-md class="hidden-sm-and-down"
                         :title="title"
                         :type="customTypeToLabel[customType]"
                         :showCustom="!!userConf.weekdays && userConf.weekdays.length > 0"
                         @today="setToday"
                         @previous="prev"
                         @next="next"
                         @change-type="setType">
      </viewer-toolbar-md>
      <viewer-toolbar-sm class="hidden-md-and-up"
                         :title="title"
                         :type="customType"
                         :showCustom="!!userConf.weekdays && userConf.weekdays.length > 0"
                         @today="setToday"
                         @previous="prev"
                         @next="next"
                         @change-type="setType">
      </viewer-toolbar-sm>
      <v-sheet height="600">
        <v-overlay absolute
                   :value="loading">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-calendar v-model="focus"
                    locale="fr-FR"
                    color="primary darken-1"
                    ref="calendar"
                    :type="type"
                    :weekdays="weekdays"
                    :now="today"
                    :interval-height="intervalHeight"
                    first-interval="14"
                    interval-minutes="30"
                    interval-count="26"
                    :interval-format="intervalFormat"
                    :events="events"
                    :event-name="eventName"
                    :event-color="getEventColor"
                    event-text-color="onsecondary"
                    @click:event="showEvent"
                    @click:date="viewDay"
                    @click:more="viewDay"
                    @change="updateRange">
        </v-calendar>
        <v-menu v-model="selectedOpen"
                :close-on-content-click="false"
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
    </core-section>
  </v-col>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';

import CoreTitle from '@/components/core/CoreTitle.vue';
import CoreSection from '@/components/core/CoreSection.vue';
import ViewerToolbarMd from '@/components/viewer/ViewerToolbarMd.vue';
import ViewerToolbarSm from '@/components/viewer/ViewerToolbarSm.vue';

export default {
  name: 'ScheduleViewer',
  components: {
    CoreTitle,
    CoreSection,
    ViewerToolbarMd,
    ViewerToolbarSm,
    ViewerEventDetail: () => import(/* webpacChunkName: "viewer" */ '@/components/viewer/ViewerEventDetail.vue'),
    ViewerMap: () => import(/* webpackChunkName: "viewer" */ '@/components/viewer/ViewerMap.vue'),
  },
  data: () => ({
    environment: process.env.VUE_APP_DEPLOYMENT_ENV.substr(0, 6),
    pageTitle: {
      level: 1,
      class: 'display-1',
      content: 'Consulter votre emploi du temps',
    },
    loading: true,
    today: moment().format().substring(0, 10),
    focus: null,
    intervalHeight: 20,
    selectedEvent: {},
    selectedEventGeolocation: [],
    selectedElement: null,
    selectedOpen: false,
    showEventMap: false,
    start: null,
    end: null,
    customTypeToLabel: {
      month: 'Mois',
      week: 'Semaine',
      custom: 'Custom',
      day: 'Jour',
    },
  }),
  computed: {
    type() {
      return this.customType === 'custom' ? 'week' : this.customType;
    },
    customType: {
      get() {
        return this.$store.getters['ui/getCalendarCustomType'];
      },
      set(value) {
        this.$store.dispatch('ui/updateCalendarCustomType', value);
      },
    },
    userConf() {
      return this.$store.getters['config/getUserCustomization'].configuration
        ? this.$store.getters['config/getUserCustomization'].configuration
        : {};
    },
    weekdays() {
      if (this.customType === 'custom' && this.userConf.weekdays && this.userConf.weekdays.length) {
        return this.userConf.weekdays;
      }
      return [1, 2, 3, 4, 5, 6, 0];
    },
    events() {
      return this.$store.getters['calendar/getEvents'];
    },
    eventsInstructors() {
      return this.$store.getters['calendar/getEventsInstructors'];
    },
    eventsClassrooms() {
      return this.$store.getters['calendar/getEventsClassrooms'];
    },
    selectedEventClassrooms() {
      return this.selectedEvent.classrooms
        ? objectFilter(this.eventsClassrooms, this.selectedEvent.classrooms)
        : {};
    },
    eventsTrainees() {
      return this.$store.getters['calendar/getEventsTrainees'];
    },
    selectedEventTrainees() {
      return this.selectedEvent.trainees
        ? objectFilter(this.eventsTrainees, this.selectedEvent.trainees)
        : {};
    },
    eventsCategory5() {
      return this.$store.getters['calendar/getEventsCategory5'];
    },
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return '';
      }

      const startDay = start.day;
      const endDay = end.day;
      const weekNumber = moment(start).week();

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);

      const startYear = start.year;
      const endYear = end.year;

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`;
        case 'week':
          if (this.$vuetify.breakpoint.name === 'sm' || this.$vuetify.breakpoint.name === 'xs') {
            return `${startMonth} ${startYear} - semaine ${weekNumber}`;
          }
          return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
        case 'day':
          return `${startDay} ${startMonth} ${startYear}`;
      }
      return '';
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      });
    },
  },
  methods: {
    objectFilter: (toFilter, allowed=[]) => allowed.reduce((obj, key) => ({ ...obj, [key]: toFilter[key] }), {}),
    setType(type) {
      this.customType = type;
      this.setFocus();
    },
    intervalFormat(interval) {
      return interval.time;
    },
    showEvent({ nativeEvent, event }) {
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
    getEventColor(event) {
      return event.color;
    },
    eventName(event, timedEvent) {
      const {
        name,
        instructors = '',
        classrooms = '',
      } = event.input;
      const htmlInstructors = instructors.length ? instructors.map(instructor => `<br>${this.eventsInstructors[instructor].name}`).join('') : '';
      const htmlClassrooms = classrooms.length ? classrooms.map(classroom => `<br>${this.eventsClassrooms[classroom].name}`).join('') : '';
      if (event.start.hasTime) {
        if (timedEvent) {
          return `<strong>${name}</strong>${htmlInstructors}${htmlClassrooms}`;
        }
        return `<strong>${name}</strong>`;
      }
      return name;
    },
    setFocus() {
      if (this.userConf.weekdays && this.userConf.weekdays.length) {
        const closestNextDayWithEvents = this.events
          .filter(event => moment(event.start, 'YYYY-MM-DD') > moment(this.today, 'YYYY-MM-DD'))
          .filter(event => moment(event.start, 'YYYY-MM-DD').day() >= this.userConf.weekdays[0])
          .sort((a, b) => moment(a.start, 'YYYY-MM-DD') - moment(b.start, 'YYYY-MM-DD'))[0]
          .start.substring(0, 10);
        this.focus = this.customType
          ? closestNextDayWithEvents
          : this.today;
      } else {
        this.focus = this.today;
      }
    },
    viewDay({ date }) {
      this.focus = date;
      this.customType = 'day';
    },
    setToday() {
      this.setFocus();
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },
    showMap(classroom) {
      this.selectedEventGeolocation = this.eventsClassrooms[classroom].geolocation;
      this.showEventMap = !this.showEventMap;
    },
  },
  mounted() {
    if (this.$store.getters['auth/isLogged']) {
      this.$store
        .dispatch('calendar/loadUserEvents')
        .then(() => {
          this.setFocus();
          this.$refs.calendar.checkChange();
          this.loading = false;
        });
    }
  },
};
</script>

<style scoped>
</style>
