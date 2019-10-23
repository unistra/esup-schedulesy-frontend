<template>
  <v-col xs="12"
         :sm="environment === 'ernest' ? 12 : 11"
         :md="environment === 'ernest' ? 12 : 10"
         :lg="environment === 'ernest' ? 12 : 9">
    <v-row v-if="environment !== 'ernest'">
      <v-col>
        <v-sheet color="primary"
                 class="pa-2 white--text"
                 elevation="2">
          <core-title :title="pageTitle">
          </core-title>
        </v-sheet>
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
                    color="primary"
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
                    event-text-color="secondary"
                    @click:event="showEvent"
                    @click:date="viewDay"
                    @click:more="viewDay"
                    @change="updateRange">
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x>
          <v-card
            color="grey lighten-4"
            min-width="250"
            flat>
            <v-toolbar
              :color="selectedEvent.color"
              light>
              <v-toolbar-title >
                <span>{{ selectedEvent.name }}</span>
              </v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-btn icon @click="selectedOpen = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="pa-0">
              <v-list dense>
                <v-list-item v-if="selectedEvent.trainees && selectedEvent.trainees > 0">
                  <v-list-item-icon>
                    <v-icon>mdi-account-group</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <p class="ma-0">
                      <span>
                        {{ eventsTrainees[selectedEvent.trainees[0]].name }}
                      </span>
                      <span v-for="(trainee, index) in selectedEvent.trainees.slice(1)"
                            :key="index">
                        - {{ eventsTrainees[trainee].name }}
                      </span>
                    </p>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-for="instructor in selectedEvent.instructors"
                             :key="instructor">
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <span>{{ eventsInstructors[instructor].name }}</span>
                  </v-list-item-content>
                </v-list-item>
                <v-sheet v-for="classroom in selectedEvent.classrooms"
                         :key="classroom">
                  <v-list-item v-if="eventsClassrooms[classroom].genealogy.length > 0">
                    <v-list-item-icon>
                      <v-icon>mdi-home-map-marker</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <p class="ma-0">
                        <span>
                          {{ eventsClassrooms[classroom].genealogy[0] }}
                        </span>
                        <span v-if="eventsClassrooms[classroom].genealogy.length > 1">
                          - {{ eventsClassrooms[classroom].genealogy[1] }}
                        </span>
                      </p>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-map-marker</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <span>{{ eventsClassrooms[classroom].name }}</span>
                    </v-list-item-content>
                  </v-list-item>
                </v-sheet>
                <v-list-item v-if="selectedEvent.start">
                  <v-list-item-icon>
                    <v-icon>mdi-clock-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <p class="ma-0">
                      <span>{{ selectedEvent.start.length > 10 ? selectedEvent.start.substring(11) : selectedEvent.start }}</span>
                      <span v-if="selectedEvent.end"> - {{
                        selectedEvent.start.length > 10 ?
                        selectedEvent.end.length > 10 ?
                        selectedEvent.end.substring(11)
                        : selectedEvent.end
                        : selectedEvent.end
                        }}
                      </span>
                    </p>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-sheet>
    </core-section>
  </v-col>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';

import CoreSection from '@/components/core/CoreSection.vue';
import ViewerToolbarMd from '@/components/viewer/ViewerToolbarMd.vue';
import ViewerToolbarSm from '@/components/viewer/ViewerToolbarSm.vue';
import CoreTitle from '@/components/core/CoreTitle.vue';

export default {
  name: 'ScheduleViewer',
  components: {
    CoreSection,
    ViewerToolbarMd,
    ViewerToolbarSm,
    CoreTitle,
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
    selectedElement: null,
    selectedOpen: false,
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
    eventsTrainees() {
      return this.$store.getters['calendar/getEventsTrainees'];
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
