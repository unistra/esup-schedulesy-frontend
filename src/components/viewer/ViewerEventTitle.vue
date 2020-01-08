<template>
  <v-badge color="accent"
           left
           dot
           offset-x="6"
           offset-y="5">
    <strong>{{ title }}</strong>
  </v-badge>
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
  },
};
</script>
