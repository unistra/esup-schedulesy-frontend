<template>
  <div>
    <core-section :title="title">
      <component
        :is="viewer.component"
        v-bind="viewer.props"
        ref="viewer"
      />
    </core-section>
    <v-bottom-sheet
      v-model="bottomSheet"
      persistent
      hide-overlay
    >
      <v-sheet
        min-height="64"
        class="d-flex"
      >
        <v-btn
          text
          height="64"
          class="flex-grow-1"
          @click="setToday"
        >
          <strong>Aujourd'hui</strong>
        </v-btn>
        <v-btn
          text
          tile
          height="64"
          class="flex-grow-1"
          @click="setViewer('list')"
        >
          <strong>Liste</strong>
        </v-btn>
        <v-btn
          text
          tile
          height="64"
          class="flex-grow-1"
          @click="setViewer('calendar')"
        >
          <strong>Calendrier</strong>
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import CoreSection from '@/components/core/CoreSection.vue'
import ViewerCalendar from '@/components/viewer/ViewerCalendar'
import ViewerList from '@/components/viewer/ViewerList.vue'

export default {
  name: 'Viewer',
  components: {
    CoreSection,
    ViewerCalendar,
    ViewerList,
  },
  props: {
    title: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    displayMode: {
      type: String,
      required: false,
      default: 'day',
    },
    calendarDefaultDisplayMode: {
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
    events: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data: () => ({
    viewer: {},
  }),
  computed: {
    bottomSheet() {
      return this.$vuetify.breakpoint.smAndDown
    },
  },
  methods: {
    initViewer() {
      const isSmallDevice = this.$vuetify.breakpoint.smAndDown
      const isList = this.displayMode === 'list'
      const viewer = isSmallDevice && isList ? 'list' : 'calendar'
      this.setViewer(viewer)
    },
    setViewer(viewer) {
      const component = `viewer-${viewer}`

      // if user display mode is list and user has weekdays => type = 'custom'
      // if user display mode is list and user has no weekdays => type = 'week'
      // if user display mode is custom and user has no weekdays => type = 'week'
      // else => type = userDisplayMode
      const isDisplayModeList = this.displayMode === 'list'
      const isDisplayModeCustom = this.displayMode === 'custom'
      const weekdays = this.weekdays
      const hasWeekdays = !!weekdays?.length
      let type
      if (isDisplayModeList) type = hasWeekdays ? 'custom' : this.calendarDefaultDisplayMode
      else if (isDisplayModeCustom && !hasWeekdays) type = 'week'
      else type = this.displayMode
      const intervalHeight = this.intervalHeight
      const props =  viewer === 'calendar' ? { type, weekdays, intervalHeight } : {}
      props.events = this.events
      this.viewer = {
        component,
        props,
      }
    },
    setToday() {
      this.$refs.viewer.setToday();
    },
  },
  created() {
    this.initViewer()
  },
}
</script>
