<template>
  <v-flex>
    <h2 v-if="userResources.length === 0">Vous n'avez actuellement aucune séléction enregistrée</h2>
    <h2 v-else>Votre sélection enregistrée actuellement est la suivante :</h2>
    <v-list color="#fafafa">
      <v-list-item v-for="(resource, index) in userResources"
                   :key="index">
        <v-list-item-action>
          <v-btn text
                 icon
                 color="red"
                 @click="removeResource(index)">
            <v-icon dark>mdi-close-outline</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-content>{{ resource }}</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-flex>
</template>

<script>
export default {
  name: 'ResourcesRemover',
  props: {
    userResources: {
      type: Array,
      required: true,
    },
  },
  methods: {
    removeResource(index) {
      this.userResources.splice(index, 1);
      this.$emit('remove-resources', this.userResources);
    },
  },
};
</script>

<style scoped>

</style>
