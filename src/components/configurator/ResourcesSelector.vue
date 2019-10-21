<template>
  <v-flex>
    <v-treeview selected-color="#3e8f93"
                dense
zsh:1: command not found: q
                :load-children="loadChildren"
                :items="resources">
      <template v-slot:prepend="{ item }">
        <v-checkbox v-if="item.selectable"
                    color="primary"
                    :input-value="userResources"
                    @change="updateCustomization"
                    :value="item.id"
                    :ripple="false"
                    class="ma-0 pa-0"
                    hide-details>
        </v-checkbox>
      </template>
    </v-treeview>
  </v-flex>
</template>

<script>
export default {
  name: 'ResourcesSelector',
  props: {
    userResources: {
      type: Array,
      required: true,
    },
  },
  computed: {
    resources() {
      return this.$store.getters['config/getResources'];
    },
  },
  methods: {
    loadChildren(node) {
      return this.$store.dispatch('config/loadResourceChildren', node);
    },
    updateCustomization(resourcesList) {
      this.$emit('update-resources', resourcesList);
    },
  },
  mounted() {
    this.$store.dispatch('config/loadResources');
  },
};
</script>

<style scoped>

</style>
