<template>
  <layout :name="formattedLayout">
    <v-row class="fill-height flex-column no-gutters">
      <v-col class="flex-grow-0">
        <viewer-toolbar-md
          class="hidden-sm-and-down"
          :title="title"
          :type="typeToLabel[formattedType]"
          :showCustom="false"
          @today="setToday"
          @previous="prev"
          @next="next"
          @change-type="setType"
        />
        <viewer-toolbar-sm
          class="hidden-md-and-up"
          :title="title"
          :type="formattedType"
          :showCustom="false"
          @today="setToday"
          @previous="prev"
          @next="next"
          @change-type="setType"
        />
      </v-col>
      <v-col class="flex-grow-1">
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
          @click:event="showEvent"
          @click:date="viewDay"
          @click:more="viewDay"
          @change="updateRange"
        >
          <template #event="props">
            <div class="pl-1">
              <span class="v-event-summary">
                <template v-if="props.eventParsed.start.hasTime">
                  <viewer-event-title
                    :title="props.event.name"
                    :has-note="props.timed && !!props.event.note"
                  />
                  <span
                    v-if="props.timed"
                    v-html="getEventExtraInfos(props.eventParsed)"
                  />
                </template>
                <template v-else>{{ props.event.name }}</template>
              </span>
            </div>
          </template>
        </v-calendar>
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
import moment from 'moment';

import Layout from '@/layouts/layout';
import ViewerToolbarMd from '@/components/viewer/ViewerToolbarMd.vue';
import ViewerToolbarSm from '@/components/viewer/ViewerToolbarSm.vue';
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
    ViewerToolbarMd,
    ViewerToolbarSm,
    ViewerEventDetail,
    ViewerEventTitle,
    ViewerMap: () => import(/* webpackChunkName: "viewer-geolocation" */ '@/components/viewer/ViewerMap.vue'),
  },
  data: function() {
    return {
      localType: this.type,
      typeToLabel: {
        day: 'Jour',
        week: 'Semaine',
        month: 'Mois',
      },
      events: [],
      eventsClassrooms: {},
      eventsTrainees: {},
      eventsInstructors: {},
      eventsCategory5s: {},
      focus: null,
      start: null,
      end: null,
      selectedOpen: false,
      selectedElement: null,
      selectedEvent: {},
      selectedEventGeolocation: [],
      showEventMap: false,
    };
  },
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
      return types[this.localType.toUpperCase()] || 'week';
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

      switch (this.formattedType) {
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
    getEventExtraInfos(event) {
      const {
        classrooms = '',
      } = event.input;
      const htmlClassrooms = classrooms.length ? classrooms.map(classroom => `<br>${this.eventsClassrooms[classroom].name}`).join('') : '';

      return `${htmlClassrooms}`;
    },
    setType(type) {
      this.localType = type;
      this.setFocus();
    },
    setFocus() {
      const { today } = this.calendarSettings;
      this.focus = today;
    },
    viewDay({ date }) {
      this.focus = date;
      this.localType = 'day';
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
      this.showEventMap = !this.showEventMap;
      this.$nextTick(() => {
        this.selectedEventGeolocation = this.eventsClassrooms[classroom].geolocation;
      })
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

<style scoped>
@media (max-width: 600px) {
  /deep/ .v-calendar .v-size--default {
    height: 28px;
    width: 28px;
  }
}
</style>