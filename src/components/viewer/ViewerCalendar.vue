<template>
  <div class="viewer">
    <viewer-toolbar-md
      v-if="$vuetify.breakpoint.mdAndUp"
      class="viewer__header"
      :title="title"
      :type="customTypeToLabel[customType]"
      :showCustom="weekdays.length > 0"
      @today="setToday"
      @previous="prev"
      @next="next"
      @change-type="setType"
    />
    <viewer-toolbar-sm
      v-else
      class="viewer__header"
      :title="title"
      :type="customType"
      :showCustom="weekdays.length > 0"
      @today="setToday"
      @previous="prev"
      @next="next"
      @change-type="setType"
    />
    <v-calendar
      v-model="focus"
      :locale="calendarSettings.locale"
      :color="calendarSettings.color"
      :ref="calendarSettings.ref"
      :type="_type"
      :weekdays="_weekdays"
      :now="calendarSettings.today"
      :interval-height = "intervalHeight || calendarSettings.intervalHeight"
      :first-interval="calendarSettings.firstInterval"
      :interval-minutes="calendarSettings.intervalMinutes"
      :interval-count="calendarSettings.intervalCount"
      :interval-format="intervalFormat"
      :events="viewerEvents"
      :event-color="getEventColor"
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
        :category5s="objectFilter(category5s, selectedEvent.category5s)"
        :trainees="objectFilter(trainees, selectedEvent.trainees)"
        :instructors="objectFilter(instructors, selectedEvent.instructors)"
        :classrooms="objectFilter(classrooms, selectedEvent.classrooms)"
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
  </div>
</template>

<script>
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
  props: {
    type: {
      type: String,
      required: false,
      default: 'week',
    },
    weekdays: {
      type: Array,
      required: false,
      default: () => [],
    },
    intervalHeight: {
      type: Number,
      required: false,
      default: 0,
    },
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
    customType: '',
    _intervalHeight: 0,
  }),
  computed: {
    calendarSettings() {
      return this.$store.getters['ui/getCalendarSettings'];
    },
    _type() {
      return this.customType === 'custom' ? 'week' : this.customType;
    },
    _weekdays() {
      if (this.customType === 'custom' && this.weekdays.length) {
        return this.weekdays;
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

      switch (this._type) {
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
    getEventExtraInfos(event) {
      const {
        instructors = '',
        classrooms = '',
      } = event.input;
      const htmlInstructors = instructors.length ? instructors.map(instructor => `<br>${this.instructors[instructor].name}`).join('') : '';
      const htmlClassrooms = classrooms.length ? classrooms.map(classroom => `<br>${this.classrooms[classroom].name}`).join('') : '';

      return `${htmlInstructors}${htmlClassrooms}`;
    },
    setType(type) {
      this.customType = type;
      this.setFocus();
    },
    setFocus() {
      const { today } = this.calendarSettings;
      if (this.weekdays.length && this.customType === 'custom') this.focus =  moment(today, 'YYYY-MM-DD').day(this.weekdays[0]).format('YYYY-MM-DD')
      else  this.focus = today;
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
  created() {
    this.customType = this.type;
  },
  mounted() {
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
/deep/ .v-calendar .v-event-timed {
  overflow: hidden;
}
</style>
