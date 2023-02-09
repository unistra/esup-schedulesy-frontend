<template>
  <v-sheet>
    <v-sheet
      v-for="(date, index) in events"
      :key="index"
      :id="setDateId(date)"
    >
      <core-title :title="{ class: 'title', content: date.date, level: 3 }" />
      <v-list>
        <template
          v-for="(event, index) in date.events"
         >
          <v-list-item
            :key="event.id"
            @click="$emit('show-event', { event, nativeEvent: $event })"
          >
            <v-list-item-action class="my-0 justify-center">
              <v-list-item-action-text>{{ event.startHour }}</v-list-item-action-text>
              <v-list-item-action-text>{{ event.endHour }}</v-list-item-action-text>
            </v-list-item-action>
              <v-list-item-content class="pa-0">
                <v-alert
                  class="ma-0 py-0"
                  :color="event.color"
                  colored-border
                  border="left"
                >
                  <template v-slot:prepend>
                    <v-icon v-if="event.note.length > 0" class="mr-1">mdi-comment-outline</v-icon>
                  </template>
                  <v-list-item-title>{{ event.name }}</v-list-item-title>
                  <v-list-item-subtitle v-text="genClassrooms(event)" />
                </v-alert>
              </v-list-item-content>
          </v-list-item>
          <v-divider
            v-if="index + 1 < date.events.length"
            :key="index"
          />
        </template>
      </v-list>
    </v-sheet>
  </v-sheet>
</template>

<script>
import moment from 'moment';
import CoreTitle from '@/components/core/CoreTitle.vue';

export default {
  name: 'ViewerEventsList',
  props: {
    eventsList: {
      type: Array,
      required: true,
    },
    classrooms: {
      type: Object,
      required: true,
    },
  },
  components: {
    CoreTitle,
  },
  computed: {
    events() {
      return [...new Set(this.eventsList.map(event => event.date))]
        .sort((a, b) => moment(a, 'DD/MM/YYYY') - moment(b, 'DD/MM/YYYY'))
        .map(day => (
          {
            date: day,
            events: this.eventsList
              .filter(event => event.date === day)
              .sort((a, b) => moment(a.startHour, 'HH:mm') - moment(b.startHour, 'HH:mm')),
          }
        ));
    },
  },
  methods: {
    setDateId(date) {
      return `d-${moment(date.date, 'DD/MM/YYYY').format().substring(0, 10)}`;
    },
    genClassrooms(event) {
      return event.classrooms
        ? event.classrooms.map(classroom => this.classrooms[classroom].name).join()
        : 'Salle non spécifiée';
    },
  },
  mounted() {
    this.$emit('mounted')
  }
};
</script>

<style scoped>

</style>
