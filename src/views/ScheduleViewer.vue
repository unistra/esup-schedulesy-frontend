<template>
  <v-flex xs12
          sm11
          md10
          lg10>
    <core-section :title="{ icon: 'mdi-calendar', text: 'Emploi du temps' }">
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined tile class="mr-4" @click="setToday">
            Aujourd'hui
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn
                tile
                outlined
                v-on="on"
                >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Jour</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semaine</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-calendar locale="fr-FR"
                  ref="calendar"
                  v-model="focus"
                  start="2019-09-23"
                  color="primary"
                  :type="type"
                  :weekdays="weekdays"
                  :now="today"
                  :interval-height="intervalHeight"
                  first-interval="14"
                  interval-minutes="30"
                  interval-count="26"
                  :events="events"
                  :event-name="eventName"
                  :event-color="getEventColor"
                  event-text-color="secondary"
                  :interval-format="intervalFormat"
                  @click:event="showEvent"
                  @click:date="viewDay"
                  @change="updateRange">
      </v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x>
        <v-card
          color="grey lighten-4"
          min-width="350px"
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
                <v-list-item v-if="eventsClassrooms[classroom].genealogy">
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
                  <p>
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
    </core-section>
  </v-flex>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import CoreSection from '@/components/core/CoreSection.vue';

export default {
  name: 'ScheduleViewer',
  components: {
    CoreSection,
  },
  data: () => ({
    token: localStorage.getItem('JWT__access__token') ? jwt_decode(localStorage.getItem('JWT__access__token')) : {},
    urls: {
      api: `${process.env.VUE_APP_BACKEND_API_URL}`,
      legacy: `${process.env.VUE_APP_BACKEND_LEGACY_URL}`,
      resources: `${process.env.VUE_APP_BACKEND_API_URL}/resource`,
      customization: `${process.env.VUE_APP_BACKEND_LEGACY_URL}/customization`,
      ics: String,
    },
    today: moment().format().substring(0, 10),
    focus: moment().format().substring(0, 10),
    type: 'week',
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    intervalHeight: 20,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    start: null,
    end: null,
    typeToLabel: {
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
    },
    userEvents: null,
    eventsInstructors: null,
    eventsClassrooms: null
  }),
  computed: {
    events() {
      if (this.userEvents) {
        return this.userEvents.map((event) => {
          return {
            ...event,
            ...{
              start: `${moment(event.date, 'DD/MM/YYYY').format().substring(0, 10)} ${event.startHour}`,
              end: `${moment(event.date, 'DD/MM/YYYY').format().substring(0, 10)} ${event.endHour}`,
            },
          };
        });
      }
      return [];
    },
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return '';
      }

      const startDay = start.day;
      const endDay = end.day;

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);

      const startYear = start.year;
      const endYear = end.year;

      switch(this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
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
      const htmlInstructors = instructors.length > 0 ? instructors.map(instructor => `<br>${this.eventsInstructors[instructor].name}`).join('') : '';
      const htmlClassrooms = classrooms.length > 0 ? classrooms.map(classroom => `<br>${this.eventsClassrooms[classroom].name}`).join('') : '';
      if (event.start.hasTime) {
        if (timedEvent) {
          return `<strong>${name}</strong>${htmlInstructors}${htmlClassrooms}`;
        }
        return `<strong>${name}</strong>`;
      }
      return name;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    setToday() {
      this.focus = this.today;
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
    this.axios.get(`${this.urls.api}/calendar/${this.token.user_id}.json`)
      .then((response) => {
        this.userEvents = response.data.events;
        this.eventsInstructors = response.data.instructors;
        this.eventsClassrooms = response.data.classrooms;
      });
    this.$refs.calendar.checkChange();
  },
};
</script>

<style scoped>
</style>
