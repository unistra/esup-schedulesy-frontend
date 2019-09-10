<template>
  <v-list-item>
    <v-list-item-action>
      <v-btn text
             icon
             color="red"
             @click="removeResource">
        <v-icon dark>mdi-close-outline</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-content>{{ resource }}</v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'ResourceRemover',
  props: {
    resourceId: {
      type: String,
      required: true,
    },
  },
  asyncComputed: {
    resource: {
      get() {
        return this.axios.get(this.resourceId).then(response => response.data.name);
      },
      default: () => 'Loading',
    },
  },
  methods: {
    removeResource() {
      this.$emit('remove-resource');
    },
  },
};
</script>

<style scoped>

</style>
