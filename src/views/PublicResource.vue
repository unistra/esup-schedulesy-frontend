<template>
  <layout :name="formattedLayout">
    <v-row class="fill-height">
      <v-col>
        <v-calendar
          v-model="focus"
          :locale="calendarSettings.locale"
          :color="calendarSettings.color"
          :ref="calendarSettings.ref"
          :type="formattedType"
          :weekdays="[1, 2, 3, 4, 5]"
          :now="calendarSettings.today"
          :interval-height="formattedIntervalHeight"
          :first-interval="calendarSettings.firstInterval"
          :interval-minutes="calendarSettings.intervalMinutes"
          :interval-count="calendarSettings.intervalCount"
          :interval-format="(interval) => interval.time"
          :events="events"
          :event-color="(event) => event.color"
          :event-text-color="calendarSettings.eventTextColor"
          :event-name="eventName"
          @click:event="showEvent"
          @click:date="viewDay"
          @click:more="viewDay"
          @change="updateRange"
        />
        <v-menu
          v-model="selectedOpen"
          :activator="selectedElement"
        >
          <viewer-event-detail
            :event="selectedEvent"
            :category5s="objectFilter(eventsCategory5s, selectedEvent.category5s)"
            :trainees="objectFilter(eventsTrainees, selectedEvent.trainees)"
            no-instructors
            :classrooms="objectFilter(eventsClassrooms, selectedEvent.classrooms)"
            @close="selectedOpen = false"
            @show-map="showMap"
          />
        </v-menu>
        <v-dialog
          v-model="showEventMap"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card tile>
            <v-toolbar
              dark
              color="primary"
            >
              <v-btn
                icon
                dark
                @click="showEventMap = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Géolocalisation du bâtiment</v-toolbar-title>
            </v-toolbar>
            <viewer-map :coordinates="selectedEventGeolocation" />
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </layout>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import Layout from '@/layouts/layout';
import ViewerEventDetail from '@/components/viewer/ViewerEventDetail.vue';
import ViewerEventTitle from '@/components/viewer/ViewerEventTitle.vue';

export default {
  name: 'publicResource',
  props: {
    resourceId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: 'week',
    },
    layout: {
      type: String,
      required: false,
      default: 'AppBarLess',
    },
    intervalHeight: {
      type: String,
      required: false,
    },
  },
  components: {
    Layout,
    ViewerEventDetail,
    ViewerEventTitle,
    ViewerMap: () => import(/* webpackChunkName: "viewer-geolocation" */ '@/components/viewer/ViewerMap.vue'),
  },
  data: () => ({
    events: [],
    eventsClassrooms: {},
    eventsTrainees: {},
    eventsInstructors: {},
    eventsCategory5s: {},
    focus: null,
    selectedOpen: false,
    selectedElement: null,
    selectedEvent: {},
    selectedEventGeolocation: [],
    showEventMap: false,
  }),
  computed: {
    calendarSettings() {
      return this.$store.getters['ui/getCalendarSettings'];
    },
    formattedType() {
      const types = {
        DAY: 'day',
        WEEK: 'week',
        MONTH: 'month',
      };
      return types[this.type.toUpperCase()] || 'week';
    },
    formattedLayout () {
      const layouts = {
        APPBARLESS: 'AppBarLess',
        HEADERLESS: 'HeaderLess',
      };
      return layouts[this.layout.toUpperCase()] || 'AppBarLess';
    },
    formattedIntervalHeight() {
      return Number.parseInt(this.intervalHeight, 10) || this.calendarSettings.intervalHeight;
    },
  },
  methods: {
    eventName(event, timedEvent) {
      const {
        name,
        note = '',
        instructors = '',
        classrooms = '',
      } = event.input;
      const title = new Vue({
        ...ViewerEventTitle,
        parent: this,
        propsData: {
          title: name,
          eventColor: event.input.color,
          hasNote: !!note,
        },
      }).$mount().$el;
      // const htmlInstructors = instructors.length ? instructors.map(instructor => `<br>${this.eventsInstructors[instructor].name}`).join('') : '';
      const htmlClassrooms = classrooms.length ? classrooms.map(classroom => `<br>${this.eventsClassrooms[classroom].name}`).join('') : '';
      if (event.start.hasTime) {
        if (timedEvent) {
          return `${title.outerHTML}${htmlClassrooms}`;
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
      this.focus = today;
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
    this.axios
      .get(`${process.env.VUE_APP_BACKEND_API_URL}/events/${this.resourceId}.json`)
      .then((response) => {
        this.events = response.data.events.events.map((event) => ({
          ...event,
          ...{
            start: `${moment(event.date, 'DD/MM/YYYY').format().substring(0, 10)} ${event.startHour}`,
            end: `${moment(event.date, 'DD/MM/YYYY').format().substring(0, 10)} ${event.endHour}`,
          },
        }));
        this.eventsClassrooms = response.data.events.classrooms;
        this.eventsTrainees = response.data.events.trainees;
      })
      .catch((error) => console.error(error));
      this.setFocus();
      this.$refs[this.calendarSettings.ref].checkChange();
  },
};
</script>
