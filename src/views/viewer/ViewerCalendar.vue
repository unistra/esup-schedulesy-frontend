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
import Vue from 'vue';
import moment from 'moment';

import ListCalendar from '@/mixins/ListCalendar.vue';
import ViewerToolbarMd from '@/components/viewer/ViewerToolbarMd.vue';
import ViewerToolbarSm from '@/components/viewer/ViewerToolbarSm.vue';
import ViewerEventDetail from '@/components/viewer/ViewerEventDetail.vue';
import ViewerEventTitle from '@/components/viewer/ViewerEventTitle.vue';

export default {
  name: 'ViewerCalendar',
  mixins: [ListCalendar],
  components: {
    ViewerToolbarMd,
    ViewerToolbarSm,
    ViewerEventDetail,
    ViewerEventTitle,
    ViewerMap: () => import(/* webpackChunkName: "viewer-geolocation" */ '@/components/viewer/ViewerMap.vue'),
  },
  data: () => ({
    customTypeToLabel: {
      month: 'Mois',
      week: 'Semaine',
      custom: 'Personnalisé',
      day: 'Jour',
    },
    focus: null,
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
        default:
          break;
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
    intervalFormat(interval) {
      return interval.time;
    },
    getEventColor(event) {
      return event.color;
    },
    eventName(event, timedEvent) {
      const {
        name,
        note,
        instructors = '',
        classrooms = '',
      } = event.input;
      const title = new Vue({
        ...ViewerEventTitle,
        parent: this,
        propsData: {
          title: name,
          eventColor: event.input.color,
          hasNote: note.length > 0,
        },
      }).$mount().$el;
      const htmlInstructors = instructors.length ? instructors.map(instructor => `<br>${this.eventsInstructors[instructor].name}`).join('') : '';
      const htmlClassrooms = classrooms.length ? classrooms.map(classroom => `<br>${this.eventsClassrooms[classroom].name}`).join('') : '';
      if (event.start.hasTime) {
        if (timedEvent) {
          return `${title.outerHTML}${htmlInstructors}${htmlClassrooms}`;
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
      const { today } = this.calendarSettings;
      if (this.userConf.weekdays && this.userConf.weekdays.length) {
        this.focus = this.customType === 'custom'
          ? moment(today, 'YYYY-MM-DD').day(this.userConf.weekdays[0]).format('YYYY-MM-DD')
          : today;
      } else {
        this.focus = today;
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
    this.setFocus();
    this.$refs[this.calendarSettings.ref].checkChange();
  },
};
</script>

<style scoped>

</style>
