import Vuetify from '@/plugins/vuetify';
import { forgeResourcesRoot, childrenEntryGenerator } from '@/utils/store';
import { getCustomization, postCustomization, patchCustomization } from '@/services/customizationService'
import { getUsername, getDirectoryId, getUuid } from '@/services/authService'
import { getResource } from '@/services/resourcesService'

const apiUrl = process.env.VUE_APP_BACKEND_API_URL
const username = getUsername()

const resourceTypes = {
  trainee: 'Etudiants',
  instructor: 'Enseignants',
  classroom: 'Salles',
  category5: 'Matières',
};

export default {
  namespaced: true,
  state: {
    resources: [],
    userCustomization: {},
    userUuid: '',
    icsParams: {},
  },
  getters: {
    userResourcesIds: (state) => state.userCustomization?.resources !== "" ? state.userCustomization.resources?.split(',') : [],
    userHasResources: (state, { userResourcesIds }) => !!userResourcesIds?.length, 
    userResourcesUrls: (state, { userResourcesIds }) => {
      const forgeResourceUrl = (resource) => `${apiUrl}/resource/${resource}.json/`
      return userResourcesIds?.map((resourceId) => [forgeResourceUrl(resourceId), resourceId]) || []
    },
    userConfiguration: (state) => state.userCustomization?.configuration || {},
    userDisplayMode: (state, { userConfiguration }) => userConfiguration.displayMode,
    userTheme: (state, { userConfiguration }) => userConfiguration.theme || 'default',
    userWeekDays: (state, { userConfiguration }) => userConfiguration?.weekdays,
    userUuid: (state) => state.userUuid,
    resources: state => Object.keys(resourceTypes).map(type => state.resources.find(resource => resource.category === type) || {}),
  },
  actions: {
    loadResources: async ({ commit, state }) => {
      if (state.resources.length) return

      const resourceUrl = (resourceType) => `${process.env.VUE_APP_BACKEND_API_URL}/resource/${resourceType}.json`
      const fetchedResources = await Promise.all(Object.keys(resourceTypes).map((type) => getResource(resourceUrl(type))))
      fetchedResources.forEach((fetchedResource) => {
        commit('LOAD_RESOURCE', forgeResourcesRoot(fetchedResource, resourceTypes));
      })
    },
    loadResourceChildren: async ({ commit }, resourceUrl) => {
      const rawNode = await getResource(resourceUrl)
      const node = {
        ...rawNode,
        ...{
          children: rawNode.children
            .filter((child) => child.has_children || child.selectable)
            .map(child => childrenEntryGenerator(child))
        },
      }
      commit('LOAD_CHILDREN', node)
    },
    loadUserCustomization: async ({ commit, state }) => {
      const isLoaded = !!state.userCustomization?.id
      if (isLoaded) return

      let userCustomization
      try {
        userCustomization = await getCustomization(username)
      } catch (error) {
        if (error?.response?.status === 404) {
          const user = {
            username,
            directory_id: getDirectoryId(),
          }
          userCustomization = await postCustomization(user)
        } else {
          throw error
        }
      }
      commit('LOAD_USER_CUSTOMIZATION', userCustomization)
    },
    updateUserCustomization: async ({ commit }, payload) => {
      const userCustomization = await patchCustomization(username, payload)
      commit('LOAD_USER_CUSTOMIZATION', userCustomization);
    },
    loadUserUuid: async ({ commit }) => {
      const userUuid = await getUuid()
      commit('LOAD_USER_UUID', userUuid)
    },
  },
  mutations: {
    LOAD_USER_CUSTOMIZATION: (state, payload) => {
      state.userCustomization = payload;
    },
    LOAD_USER_UUID: (state, userUuid) => {
      state.userUuid = userUuid
    },
    LOAD_RESOURCE: (state, payload) => state.resources.push(payload),
    LOAD_CHILDREN: (state, payload) => {
      const updateChildren = (resources) => {
        resources.forEach((resource) => {
          if (resource.id === `${process.env.VUE_APP_BACKEND_API_URL}/resource/${payload.id}.json/`) {
            resource.children.push(...payload.children);
          } else if (resource.children && resource.children.length) {
            updateChildren(resource.children);
          }
        });
      };
      updateChildren(state.resources);
    },
  },
};
