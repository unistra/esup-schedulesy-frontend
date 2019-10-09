<template>
  <v-row>
    <v-col>
      <v-card>
        <v-sheet>
        <v-card-title>
          <core-title :title="title">
          </core-title>
        </v-card-title>
        </v-sheet>
        <v-card-text class="text--primary">
          <slot></slot>
        </v-card-text>
        <slot name="actions"></slot>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CoreTitle from '@/components/core/CoreTitle.vue';

export default {
  name: 'ConfSection',
  components: {
    CoreTitle,
  },
  props: {
    title: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
