<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          <h2 class="headline">
            <v-icon v-if="title.icon">{{ title.icon }}</v-icon>
            {{ title.text }}
          </h2>
        </v-card-title>
        <v-card-text>
          <slot></slot>
        </v-card-text>
        <slot name="actions"></slot>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ConfSection',
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
