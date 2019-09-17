<template>
  <v-flex>
    <v-treeview selected-color="#3e8f93"
                dense
                open-on-click
                :load-children="loadChildren"
                :items="root">
      <template v-slot:prepend="{ item }">
        <v-checkbox v-if="item.selectable"
                    color="#3e8f93"
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
import childrenEntryGenerator from '@/mixins/childrenEntryGenerator';

export default {
  name: 'ResourcesSelector',
  mixins: [
    childrenEntryGenerator,
  ],
  props: {
    root: {
      type: Array,
      required: true,
    },
    userResources: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    selectedResources: [],
  }),
  methods: {
    loadChildren(node) {
      const axiosCall = this.axios.get(node.id)
        .then(response => response.data.children)
        .then(rawChildren => rawChildren.map(child => this.childrenEntryGenerator(child)))
        .then(children => node.children.push(...(this.sortChildren(children))))
        .catch((error) => {
          console.log(error);
        });
      return axiosCall;
    },
    updateCustomization(resourcesList) {
      this.$emit('update-resources', resourcesList);
    },
  },
};
</script>

<style scoped>

</style>
