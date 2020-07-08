<template>
  <v-card
    color="grey lighten-4"
    min-width="250"
    flat>
    <v-toolbar
      :color="event.color"
      light>
      <v-toolbar-title >
        <span>{{ event.name }}</span>
      </v-toolbar-title>
      <div class="flex-grow-1"></div>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pa-0">
      <v-list dense>
        <v-list-item v-for="(category, index) in event.category5s"
                     :key="index">
          <v-list-item-icon>
            <v-icon>mdi-certificate-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ category5s[category].name }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="event.trainees && event.trainees.length > 0">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <p class="ma-0">
              <span>
                {{ trainees[event.trainees[0]].name }}
              </span>
              <span v-for="(trainee, index) in event.trainees.slice(1)"
                    :key="index">
                - {{ trainees[trainee].name }}
              </span>
            </p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-for="instructor in event.instructors"
                     :key="instructor">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <span>{{ instructors[instructor].name }}</span>
          </v-list-item-content>
        </v-list-item>
        <v-sheet v-for="classroom in event.classrooms"
                 :key="classroom">
          <v-tooltip top :disabled="classrooms[classroom].geolocation.length < 2">
            <template v-slot:activator="{ on }">
              <v-list-item v-if="classrooms[classroom].genealogy.length > 0"
                           v-on="genClickHandler(on, classroom)">
                <v-list-item-icon class="my-4">
                  <v-icon>mdi-home-map-marker</v-icon>
                </v-list-item-icon>
                <v-list-item-content :class="classrooms[classroom].geolocation.length > 1 ? 'info--text' : ''">
                  <p class="ma-0">
                    <span>
                      {{ classrooms[classroom].genealogy[0] }}
                    </span>
                    <span v-if="classrooms[classroom].genealogy.length > 1">
                      - {{ classrooms[classroom].genealogy[1] }}
                    </span>
                  </p>
                </v-list-item-content>
                <v-list-item-action v-if="classrooms[classroom].geolocation.length > 1">
                  <v-btn fab x-small color="primary">
                    <v-icon>mdi-map-search</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
            <span>Cliquez pour afficher l'emplacement du bâtiment sur une carte</span>
          </v-tooltip>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-map-marker</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <span>{{ classrooms[classroom].name }}</span>
            </v-list-item-content>
          </v-list-item>
        </v-sheet>
        <v-list-item v-if="event.start">
          <v-list-item-icon>
            <v-icon>mdi-clock-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <p class="ma-0">
              <span>{{ event.start.length > 10 ? event.start.substring(11) : event.start }}</span>
              <span v-if="event.end"> - {{
                event.start.length > 10 ?
                  event.end.length > 10 ?
                    event.end.substring(11)
                    : event.end
                  : event.end
                }}
              </span>
            </p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="event.note.length > 0">
          <v-list-item-icon>
            <v-icon>mdi-comment-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <p class="ma-0">
              <span v-html="event.note" />
            </p>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ViewerEventDeatil',
  props: {
    event: {
      type: Object,
      required: true,
    },
    category5s: {
      type: Object,
      required: true,
    },
    classrooms: {
      type: Object,
      required: true,
    },
    instructors: {
      type: Object,
      required: true,
    },
    trainees: {
      type: Object,
      required: true,
    },
  },
  methods: {
    genClickHandler(originalEventHandlers, classroom) {
      const newEventHandlers = {
        ...originalEventHandlers,
        ...{ click: () => this.$emit('show-map', classroom) },
      };
      return this.classrooms[classroom].geolocation.length > 1
        ? newEventHandlers
        : originalEventHandlers;
    },
  },
};
</script>

<style scoped>

</style>
