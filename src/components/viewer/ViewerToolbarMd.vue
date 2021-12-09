<template>
  <v-toolbar flat>
    <v-btn
      outlined
      tile
      class="mr-4"
      @click="$emit('today')"
    >
      Aujourd'hui
    </v-btn>
    <v-spacer />
    <v-btn
      fab
      text
      small
      @click="$emit('previous')"
    >
      <v-icon small>mdi-chevron-left</v-icon>
    </v-btn>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-btn fab
      text
      small
      @click="$emit('next')"
    >
      <v-icon small>mdi-chevron-right</v-icon>
    </v-btn>
    <v-spacer />
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          tile
          outlined
          v-on="on"
        >
          <span>{{ type }}</span>
          <v-icon right>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="$emit('change-type', 'day')">
          <v-list-item-title>Jour</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="showCustom"
          @click="$emit('change-type', 'custom')"
        >
          <v-list-item-title>Personnalisé</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$emit('change-type', 'week')">
          <v-list-item-title>Semaine</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$emit('change-type', 'month')">
          <v-list-item-title>Mois</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
export default {
  name: 'ViewerToolbarMd',
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
