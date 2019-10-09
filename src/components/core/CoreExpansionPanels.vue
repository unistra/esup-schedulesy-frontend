<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="(panel, index) in panels"
                       :key="index">
      <v-expansion-panel-header class="px-4">
        <core-title :title="panel.title">
        </core-title>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-sheet v-html="panel.content">
        </v-sheet>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import CoreTitle from '@/components/core/CoreTitle.vue';

export default {
  name: 'CoreExpansionPanel',
  components: {
    CoreTitle,
  },
  props: {
    panels: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
