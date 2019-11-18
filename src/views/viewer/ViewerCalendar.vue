<template>
  <v-sheet>
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
      <v-calendar v-model="focus"
                  :locale="calendarSettings.locale"
                  :color="calendarSettings.color"
                  :ref="calendarSettings.ref"
                  :type="type"
                  :weekdays="weekdays"
                  :now="calendarSettings.today"
                  :interval-height="calendarSettings.intervalHeight"
                  :first-interval="calendarSettings.firstInterval"
                  :interval-minutes="calendarSettings.intervalMinutes"
                  :interval-count="calendarSettings.intervalCount"
                  :interval-format="intervalFormat"
                  :events="events"
                  :event-name="eventName"
                  :event-color="getEventColor"
                  :event-text-color="calendarSettings.eventTextColor"
                  @click:event="showEvent"
                  @click:date="viewDay"
                  @click:more="viewDay"
                  @change="updateRange">
      </v-calendar>
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
  </v-sheet>
</template>

<script>
import moment from 'moment';

export default {
  name: 'ViewerCalendar',
  components: {
    ViewerToolbarMd: () => import(/* webpacChunkName: "viewer" */ '@/components/viewer/ViewerToolbarMd.vue'),
    ViewerToolbarSm: () => import(/* webpacChunkName: "viewer" */ '@/components/viewer/ViewerToolbarSm.vue'),
    ViewerEventDetail: () => import(/* webpacChunkName: "viewer" */ '@/components/viewer/ViewerEventDetail.vue'),
    ViewerMap: () => import(/* webpackChunkName: "viewer" */ '@/components/viewer/ViewerMap.vue'),
  },
  props: {
  },
  data: () => ({
    customTypeToLabel: {
      month: 'Mois',
      week: 'Semaine',
      custom: 'Personnalisé',
      day: 'Jour',
    },
    focus: null,
    selectedEvent: {},
    selectedEventGeolocation: [],
    selectedElement: null,
    selectedOpen: false,
    showEventMap: false,
    start: null,
    end: null,
  }),
  computed: {
    calendarSettings() {
      return this.$store.getters['ui/getCalendarSettings'];
    },
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
      const weekNumber = moment(start.date).week();

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
      return this.$refs[this.calendarSettings.ref].getFormatter({
        timeZone: 'UTC', month: 'long',
      });
    },
  },
  methods: {
    objectFilter: (toFilter, allowed = []) => allowed.reduce((obj, key) => ({ ...obj, [key]: toFilter[key] }), {}),
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
    setType(type) {
      this.customType = type;
      this.setFocus();
    },
    setFocus() {
      if (this.userConf.weekdays && this.userConf.weekdays.length) {
        const closestNextDayWithEvents = this.events
          .filter(event => moment(event.start, 'YYYY-MM-DD') >= moment(this.calendarSettings.today, 'YYYY-MM-DD'))
          .filter(event => moment(event.start, 'YYYY-MM-DD').day() >= this.userConf.weekdays[0])
          .sort((a, b) => moment(a.start, 'YYYY-MM-DD') - moment(b.start, 'YYYY-MM-DD'))[0]
          .start.substring(0, 10);
        this.focus = this.customType
          ? closestNextDayWithEvents
          : this.calendarSettings.today;
      } else {
        this.focus = this.calendarSettings.today;
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
      console.log('NEXT');
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
    this.setFocus();
    this.$refs[this.calendarSettings.ref].checkChange();
  },
  beforeRouteEnter(to, from, next) {
    console.log('************************');
    console.log('BEFOREROUTEENTER VIEWER CALENDAR');
    console.log('************************');
    next();
  },
  beforeRouteUpdate(to, from, next) {
    console.log('************************');
    console.log('BEFOREROUTEUPDATE VIEWER CALENDAR');
    console.log('************************');
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('************************');
    console.log('BEFOREROUTELEAVE VIEWER CALENDAR');
    console.log('************************');
    next();
  },
};
</script>

<style scoped>

</style>
