<template>
  <v-col>
    <template v-if="!loading">
      <core-title
        class="primary--text"
        :title="pageTitle"
      />
      <viewer
        :title="{ class: 'headline', icon: 'mdi-calendar', content: 'Emploi du temps', level: 2 }"
        :display-mode="userDisplayMode"
        :weekdays="userWeekDays"
        :events="userEvents"
      />
    </template>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-col>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CoreTitle from '@/components/core/CoreTitle.vue'
import Viewer from '@/components/viewer/Viewer.vue'

export default {
  name: 'Schedule',
  components: {
    CoreTitle,
    Viewer,
  },
  data: () => ({
    loading: true,
    pageTitle: {
      level: 1,
      class: 'display-1',
      content: 'Consulter votre emploi du temps',
    },
  }),
  computed: {
    ...mapGetters({
      userHasResources: 'config/userHasResources',
      userDisplayMode: 'config/userDisplayMode',
      userWeekDays: 'config/userWeekDays',
      userEvents: 'calendar/events',
    }),
    bottomSheet() {
      return this.$vuetify.breakpoint.smAndDown
    },
  },
  methods: {
    ...mapActions({
      loadUserEvents: 'calendar/loadUserEvents',
      updateSnackbar: 'ui/updateSnackbar',
    }),
  },
  async created() {
    if (!this.userHasResources) return this.$router.push({ name: 'config' })
    try {
      await this.loadUserEvents()
    } catch (error) {
      this.updateSnackbar({
        isVisible: true,
        color: 'warning',
        message: error.message,
        timeout: 6000,
      })
      this.$router.push({ name: 'config' })
    } finally {
      this.loading = false
    }
  },
}
</script>
