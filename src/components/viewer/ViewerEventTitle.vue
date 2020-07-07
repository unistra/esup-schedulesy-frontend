<template>
  <v-badge v-if="hasNote"
           color="grey darken-1"
           inline
           left
           icon="mdi-comment-outline">
    <strong>{{ title }}</strong>
  </v-badge>
  <strong v-else>{{ title }}</strong>
</template>

<script>
export default {
  name: 'ViewerEventTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
    eventColor: {
      type: String,
      required: true,
    },
    hasNote: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    dotColor() {
      return `#${(Number(`0x1${this.eventColor.substr(1).toUpperCase()}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()}`;
    },
  },
};
</script>
