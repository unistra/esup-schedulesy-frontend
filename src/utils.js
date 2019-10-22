const childrenEntryGenerator = (node) => {
  const childrenEntry = { children: [] };
  const addSelectable = item => ({ ...item, ...{ selectable: true } });
  const addChildren = item => (item.has_children ? { ...item, ...childrenEntry } : item);
  return addChildren(addSelectable(node));
};

const sortChildren = childrenList => childrenList.sort((a, b) => a.name > b.name);

const forgeResourcesRoot = (rawResource, rootMapping) => {
  const children = resource => resource.children.map(child => childrenEntryGenerator(child));
  const resourcesRoot = {
    ...rawResource,
    ...{ children: sortChildren(children(rawResource)) },
    ...{ name: rootMapping[rawResource.name] },
  };
  return resourcesRoot;
};

export { forgeResourcesRoot, childrenEntryGenerator, sortChildren };
