<template>
  <layout :name="formattedLayout">
    <v-row class="fill-height">
      <v-col>
        <v-calendar
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
          :events="fetchedEvents"
          :event-text-color="calendarSettings.eventTextColor"
        />
      </v-col>
    </v-row>
  </layout>
</template>

<script>
import Layout from '@/layouts/layout';

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
  },
  data: () => ({
    fetchedEvents: [],
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
  mounted() {
    this.axios
      .get(`${process.env.VUE_APP_BACKEND_API_URL}/events/${this.resourceId}.json`)
      .then((response) => {
        this.fetchedEvents = response.data.events;
      });
  },
};
</script>
