export default {
  methods: {
    childrenEntryGenerator(node) {
      const childrenEntry = { children: [] };
      const addSelectable = item => ({ ...item, ...{ selectable: true } });
      const addChildren = item => (item.has_children ? { ...item, ...childrenEntry } : item);
      const normalizeId = item => (process.env.VUE_APP_DEPLOYMENT_ENV !== 'dev' ? { ...item, ...{ id: item.id.replace('http', 'https') } } : item);
      return normalizeId(addChildren(addSelectable(node)));
    },
    sortChildren(childrenList) {
      return childrenList.sort((a, b) => a.name > b.name);
    },
  },
};
