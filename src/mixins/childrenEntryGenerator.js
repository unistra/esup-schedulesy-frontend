export default {
  methods: {
    childrenEntryGenerator(node) {
      const childrenEntry = { children: [] };
      const addSelectable = item => ({ ...item, ...{ selectable: true } });
      const addChildren = item => (item.has_children ? { ...item, ...childrenEntry } : item);
      return addChildren(addSelectable(node));
    },
    sortChildren(childrenList) {
      return childrenList.sort((a, b) => a.name > b.name);
    },
  },
};
