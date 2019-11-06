<template>
  <v-sheet class="pa-2"
           elevation="2">
    <core-title class="primary--text"
                :title="title">
    </core-title>
  </v-sheet>
</template>

<script>
import CoreTitle from '@/components/core/CoreTitle.vue';

export default {
  name: 'CorePageTitle',
  props: {
    title: {
      type: Object,
      required: true,
    },
  },
  components: {
    CoreTitle,
  },
};
</script>

<style scoped>

</style>
