<template>
  <v-list-item dense>
    <v-list-item-action class="my-0 mr-3">
      <v-btn text
             icon
             x-small
             color="red"
             @click="removeResource">
        <v-icon dark>mdi-close-outline</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-content class="py-0">
      <p class="ma-0">
        <span v-for="parent in resource.genealogy"
              :key="parent.id">
          {{ getParentName(parent) }} ->
        </span>
        {{ resource.name }}
      </p>
    </v-list-item-content>
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
        return this.axios.get(this.resourceId).then(response => response.data);
      },
      default: () => 'Loading',
    },
  },
  methods: {
    removeResource() {
      this.$emit('remove-resource');
    },
    getParentName(parent) {
      const rootMapping = {
        trainee: 'Etudiants',
        instructor: 'Enseignants',
        classroom: 'Salles',
        category5: 'Matières',
      };
      return rootMapping[parent.name] || parent.name;
    },
  },
};
</script>

<style scoped>

</style>
