<template>
  <v-sheet>
    <v-sheet v-for="(date, index) in events" :key="index">
      <core-title :title="{ class: 'title', content: date.date, level: 3 }">
      </core-title>
      <v-list>
        <template v-for="(event, index) in date.events">
          <v-list-item :key="event.id">
            <v-list-item-action class="my-0 justify-center">
              <v-list-item-action-text>{{ event.startHour }}</v-list-item-action-text>
              <v-list-item-action-text>{{ event.endHour }}</v-list-item-action-text>
            </v-list-item-action>
              <v-list-item-content class="pa-0">
                <v-alert class="ma-0 py-0"
                         :color="event.color"
                         colored-border
                         border="left">
                  <v-list-item-title>{{ event.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ event.classrooms }}</v-list-item-subtitle>
                </v-alert>
              </v-list-item-content>
          </v-list-item>
          <v-divider v-if="index + 1 < date.events.length"
                     :key="index">
          </v-divider>
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
};
</script>

<style scoped>

</style>
