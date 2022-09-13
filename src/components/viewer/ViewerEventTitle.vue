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
    hasNote: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
