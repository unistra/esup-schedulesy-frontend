<template>
  <v-flex>
    <v-select filled
              color="#3e8f93"
              :items="displayTypes"
              :value="userDisplayType"
              @change="updateCustomization"
              persistent-hint>
    </v-select>
  </v-flex>
</template>

<script>
export default {
  name: 'DisplaySelector',
  props: {
    displayTypes: {
      type: Array,
      required: true,
    },
    userDisplayType: {
      type: String,
      required: true,
    },
  },
  data: () => ({}),
  methods: {
    updateCustomization(displayType) {
      this.$emit('update-display-type', displayType);
    },
  },
};
</script>

<style scoped>

</style>
