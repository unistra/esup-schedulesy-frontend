<template>
  <v-flex>
    <v-treeview v-if="updated"
                selected-color="#3e8f93"
                dense
                :load-children="loadChildren"
                :items="resources">
      <template v-slot:prepend="{ item }">
        <v-checkbox v-if="item.selectable"
                    v-model="selectedResources"
                    color="#3e8f93"
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
    resource: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    updated: false,
    resources: null,
    selectedResources: [],
  }),
  methods: {
    getRoot() {
      this.axios.get(`${process.env.VUE_APP_BACKEND_URL}/resource/${this.resource}`)
        .then((response) => {
          const children = response.data.children
            .map(child => this.childrenEntryGenerator(child));
          const payload = [{
            ...response.data,
            ...{ children },
          }];
          this.resources = payload;
          this.updated = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadChildren(node) {
      const axiosCall = this.axios.get(node.id)
        .then(response => response.data.children)
        .then(rawChildren => rawChildren.map(child => this.childrenEntryGenerator(child)))
        .then(children => node.children.push(...children))
        .catch((error) => {
          console.log(error);
        });
      return axiosCall;
    },
    childrenEntryGenerator(node) {
      const childrenEntry = { children: [] };
      const addSelectable = item => ({ ...item, ...{ selectable: true } });
      const addChildren = item => (item.has_children ? { ...item, ...childrenEntry } : item);
      return addChildren(addSelectable(node));
    },
    updateCustomization(resourcesList) {
      console.log('IN UPDATECUSTOMIZATION');
      console.log(resourcesList);
    },
  },
  created() {
    this.getRoot();
  },
};
</script>

<style scoped>

</style>
