<template>
  <v-toolbar
    flat
    height="30"
    extension-height="30"
  >
    <v-btn
      fab
      text
      x-small
      @click="$emit('previous')"
    >
      <v-icon small>mdi-chevron-left</v-icon>
    </v-btn>
    <v-spacer />
    <v-toolbar-title class="body-2">{{ title }}</v-toolbar-title>
    <v-spacer />
    <v-btn
      fab
      text
      x-small
      @click="$emit('next')"
    >
      <v-icon small>mdi-chevron-right</v-icon>
    </v-btn>

    <template v-slot:extension>
      <v-btn
        outlined
        tile
        x-small
        :color="type === 'month' ? 'primary' : undefined"
        @click="$emit('change-type', 'month')"
      >
        Mois
      </v-btn>
      <v-spacer />
      <v-btn
        outlined
        tile
        x-small
        :color="type === 'week' ? 'primary' : undefined"
        @click="$emit('change-type', 'week')"
      >
        Semaine
      </v-btn>
      <v-spacer />
      <template v-if="showCustom">
        <v-btn
          outlined
          tile
          x-small
          :color="type === 'custom' ? 'primary' : undefined"
          @click="$emit('change-type', 'custom')"
        >
          Personnalisé
        </v-btn>
        <v-spacer />
      </template>
      <v-btn
        outlined
        tile
        x-small
        :color="type === 'day' ? 'primary' : undefined"
        @click="$emit('change-type', 'day')"
      >
        Jour
      </v-btn>
    </template>
  </v-toolbar>
</template>

<script>
export default {
  name: 'ViewerToolbarSm',
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    showCustom: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
