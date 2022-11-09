<template>
  <component :is="formattedLayout">
    <v-col v-if="!loading">
      <viewer
        :display-mode="formattedType"
        calendar-default-display-mode="day"
        :interval-height="formattedIntervalHeight"
        :events="events"
      />
    </v-col>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </component>
</template>

<script>
import axios from 'axios';

import AppBarLess from '@/layouts/AppBarLess.vue'
import HeaderLess from '@/layouts/HeaderLess.vue'
import Viewer from '@/components/viewer/Viewer.vue'

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
      default: 'list',
    },
    layout: {
      type: String,
      required: false,
      default: 'AppBarLess',
    },
    intervalHeight: {
      type: String,
      required: false,
      default: '0',
    },
  },
  components: {
    AppBarLess,
    HeaderLess,
    Viewer,
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
      loading: true,
    };
  },
  computed: {
    formattedType() {
      const types = {
        DAY: 'day',
        WEEK: 'week',
        MONTH: 'month',
      };
      return types[this.localType.toUpperCase()] || 'list';
    },
    formattedLayout () {
      const layouts = {
        APPBARLESS: 'AppBarLess',
        HEADERLESS: 'HeaderLess',
      }
      return layouts[this.layout.toUpperCase()]
    },
    formattedIntervalHeight() {
      return Number.parseInt(this.intervalHeight, 10)
    },
  },
  methods: {
    async getEvents() {
      const response = await axios.get(`${process.env.VUE_APP_BACKEND_API_URL}/events/${this.resourceId}.json`)

      return response.data.events
    },
  },
  async created() {
    this.events = await this.getEvents()
    this.loading = false
  },
};
</script>
