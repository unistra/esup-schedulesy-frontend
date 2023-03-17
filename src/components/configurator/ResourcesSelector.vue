<template>
  <v-flex>
    <v-treeview
      selected-color="#3e8f93"
      dense
      :load-children="loadChildren"
      :items="resources"
    >
      <template v-slot:prepend="{ item }">
        <v-checkbox 
          v-if="item.selectable"
          color="primary"
          :input-value="userResources"
          @change="updateCustomization"
          :value="item.id"
          :ripple="false"
          class="ma-0 pa-0"
          hide-details
        />
        <v-sheet
          v-else
          min-width="32"
        />
      </template>
    </v-treeview>
  </v-flex>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ResourcesSelector',
  props: {
    userResources: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      resources: 'config/resources',
    }),
  },
  methods: {
    ...mapActions({
      loadResources: 'config/loadResources',
      loadResourceChildren: 'config/loadResourceChildren',
      updateSnackbar: 'ui/updateSnackbar',
    }),
    loadChildren(node) {
      return this.loadResourceChildren(node.id)
    },
    updateCustomization(resourcesList) {
      this.$emit('update-resources', resourcesList);
    },
  },
  created() {
    this.loadResources()
  },
};
</script>

<style scoped>

</style>
