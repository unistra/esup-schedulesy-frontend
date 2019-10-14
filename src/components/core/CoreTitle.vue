<template>
  <core-heading :class="title.class ? title.class : ''" :level="title.level">
    <v-icon v-if="title.icon" color="primary">{{ title.icon }}</v-icon>
      {{ title.content }}
      </core-heading>
</template>

<script>
import CoreHeading from '@/components/core/coreHeading';

export default {
  name: 'CoreTitle',
  components: {
    CoreHeading,
  },
  props: {
    title: {
      type: Object,
      required: true,
    },
  },
};
</script>
