<template>
  <v-card class="mt-2">
    <v-card-title v-if="title.content">
      <core-title :title="title">
      </core-title>
    </v-card-title>
    <v-card-text class="text--primary">
      <slot></slot>
    </v-card-text>
    <slot name="actions"></slot>
  </v-card>
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
      required: false,
      default: () => ({}),
    },
  },
};
</script>
