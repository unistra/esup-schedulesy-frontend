<template>
  <v-layout column>
    <v-flex>
      <p>
        La configuration de votre emploi du temps s'opère par sélection
        des ressources et de la configuration d'affichage.
      </p>
    </v-flex>
    <!-- <resources&#45;remover :userResources="userResources" -->
    <!--                     @remove&#45;resources="updateResources"> -->
    <!-- </resources&#45;remover> -->
    <v-flex>
      <h2>Sélectionnez vos ressources dans l'arbre ci dessous :</h2>
      <p>L'affichage des ressources est le même que dans la consultation.</p>
      <ul>
        <li>
          Si vous êtes étudiant, veuillez sélectionner les groupes d'étudiants qui vous concernent.
        </li>
        <li>
          Si vous êtes étudiant des sciences humaines, vous devrez sélectionner
          vos groupes de matières.
        </li>
        <li>
          Enfin, si vous êtes enseignant, sélectionnez les ressources
          que vous voulez voir s'afficher.
        </li>
      </ul>
    </v-flex>
    <resources-selector :root="resourcesSelectorRoot"
                        :userResources="userResources"
                        @update-resources="updateResources">
    </resources-selector>
    <v-flex>
      <h2>Choisissez votre configuration d'affichage :</h2>
      <p>
        La configuration d'affichage par défaut correspond à celle de votre promotion.
        Veuillez tester les autres configurations disponibles dans la consultation avant
        d'en sauvegarder une autre.
      </p>
    </v-flex>
    <display-selector :displayTypes="displayTypes"
                      :userDisplayType="userDisplayType"
                      @update-display-type="updateDisplayType">
    </display-selector>
    <v-flex>
      <h2 class="red--text">Attention : si vous oubliez une ressource, votre emploi du temps sera incomplet !</h2>
    </v-flex>
    <v-flex v-if="userCustomization.resources">
      <h2><a :href="icsURL">EXPORT CALENDRIER MOBILE</a></h2>
    </v-flex>
  </v-layout>
</template>

<script>
import childrenEntryGenerator from '@/mixins/childrenEntryGenerator';
// import ResourcesRemover from '@/components/configurator/ResourcesRemover.vue';
import ResourcesSelector from '@/components/configurator/ResourcesSelector.vue';
import DisplaySelector from '@/components/configurator/DisplaySelector.vue';
import jwt_decode from 'jwt-decode';

export default {
  name: 'ScheduleConfigurator',
  components: {
    // ResourcesRemover,
    ResourcesSelector,
    DisplaySelector,
  },
  mixins: [
    childrenEntryGenerator,
  ],
  data: () => ({
    userCustomization: {},
    resourcesSelectorRoot: [],
    displayTypes: [],
    urls: {
      api: `${process.env.VUE_APP_BACKEND_API_URL}`,
      legacy: `${process.env.VUE_APP_BACKEND_LEGACY_URL}`,
      resources: `${process.env.VUE_APP_BACKEND_API_URL}/resource`,
      customization: `${process.env.VUE_APP_BACKEND_LEGACY_URL}/customization`,
      ics: 'https://adewebcons.unistra.fr/jsp/custom/modules/plannings/anonymous_cal.jsp',
    },
    icsParams: {
      projectId : "10",
      calType: "ical",
      nbWeeks: "40"
    },
  }),
  computed: {
    userResources() {
      if (typeof this.userCustomization.resources === 'string' && this.userCustomization.resources) {
        const payload = this.userCustomization.resources.split(',')
          .map(resource => `${this.urls.resources}/${resource}.json/`);
        return payload;
      }
      return [];
    },
    userDisplayType() {
      if (typeof this.userCustomization.display_configuration === 'string' && this.userCustomization.display_configuration) {
        return this.userCustomization.display_configuration;
      }
      return '';
    },
    icsURL() {
      if (typeof this.userCustomization.resources === 'string' && this.userCustomization.resources) {
        const params = Object.entries(this.icsParams).map(param => `${param[0]}=${param[1]}`).join('&');
        const resources = this.userCustomization.resources.split(',').map(resource => `resources=${resource}`).join('&');
        console.log(`${this.urls.ics}?${params}&${resources}`);
        return `${this.urls.ics}?${params}&${resources}`;
      }
      return '';
    },
  },
  created() {
    this.getUserCustomization();
    this.getResourceSelectorRoot();
    this.getDisplayTypes();
  },
  methods: {
    getUserCustomization() {
      const token = localStorage.getItem('JWT__access__token');
      if (token) {
        const decodedToken = jwt_decode(token);
        this.axios.get(`${this.urls.customization}/${decodedToken.user_id}.json`)
          .then((response) => {
            this.userCustomization = response.data;
          })
          .catch((getError) => {
            if (getError.response.status === 404) {
              const payload = {
                username: decodedToken.user_id,
                directory_id: decodedToken.directory_id,
              };
              this.axios.post(`${this.urls.customization}.json`, payload)
                .then((response) => {
                  this.userCustomization = response.data;
                })
                .catch((postError) => {
                  console.log(postError);
                });
            } else {
              console.log(getError);
            }
          });
      }
    },
    async getResourceSelectorRoot() {
      const resourceTypes = [
        { label: 'Etudiants', id: 'trainee' },
        { label: 'Enseignants', id: 'instructor' },
        { label: 'Salles', id: 'classroom' },
        { label: 'Matières', id: 'category5' },
      ];
      const resourcesPromises = resourceTypes.map((type) => {
        return this.axios.get(`${this.urls.resources}/${type.id}.json`)
          .then((response) => {
            const children = this.sortChildren(response.data.children
              .map(child => this.childrenEntryGenerator(child)));
            const name = type.label;
            const payload = {
              ...response.data,
              ...{ children },
              ...{ name },
            };
            return payload;
          })
          .catch((error) => {
            console.log(error);
          });
      });
      this.resourcesSelectorRoot = await Promise.all(resourcesPromises);
    },
    updateResources(resourcesList) {
      const resources = {
        resources: resourcesList.map(resource => resource.replace(`${this.urls.resources}/`, '').match(/\d+/g).map(Number)).join(),
      };
      this.axios.patch(`${this.urls.customization}/${this.userCustomization.username}.json`, resources)
        .then(() => this.getUserCustomization());
    },
    getDisplayTypes() {
      this.axios.get(`${this.urls.api}/display_types.json`)
        .then((response) => {
          this.displayTypes = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateDisplayType(displayType) {
      this.axios.patch(`${this.urls.customization}/${this.userCustomization.username}.json`, { display_configuration: displayType });
    },
  },
};
</script>

<style scoped>

</style>
