<template>
  <v-container class="pa-2"
               fluid>
    <v-snackbar v-model="snackbar.isVisible"
                top
                :color="snackbar.color"
                :timeout="snackbar.timeout">
      {{ snackbar.message }}
      <v-btn text
             @click.stop="snackbar.isVisible = false">
        <strong>CLOSE</strong>
      </v-btn>
    </v-snackbar>
    <conf-section :title="{ icon: 'mdi-calendar-check-outline', text: 'Ressources sélectionnées' }">
      <p>
        La configuration de votre emploi du temps s'opère par sélection
        des ressources et de la configuration d'affichage.
      </p>
      <p v-if="userResources.length === 0">Vous n'avez actuellement aucune séléction enregistrée</p>
      <p v-else>
        Votre sélection enregistrée actuellement est la suivante :
        <v-list>
          <resource-remover v-for="(resourceId, index) in userResources"
                            :key="index"
                            :resourceId="resourceId"
                            @remove-resource="removeResource(index)">
          </resource-remover>
        </v-list>
      </p>
      <strong class="red--text">
        Attention : si vous oubliez une ressource, votre emploi du temps sera incomplet !
      </strong>
      <template #actions>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn class="info"
                 @click="showResourcesSelector">
            <strong>{{ show ? 'Fermer' : 'Modifier' }} la séléction</strong>
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-actions>
      </template>
    </conf-section>
    <v-expand-transition>
      <conf-section v-if="show"
                    id="resources-selection"
                    :title="{ icon: 'mdi-guitar-pick-outline', text: 'Modifier la sélection des ressources' }">
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
        <resources-selector :root="resourcesRoot"
          :userResources="userResources"
          @update-resources="updateResources">
        </resources-selector>
      </conf-section>
    </v-expand-transition>
    <conf-section :title="{ icon: 'mdi-shape', text: 'Choisissez votre configuration d\'affichage' }">
      <p>
        La configuration d'affichage par défaut correspond à celle de votre promotion.
        Veuillez tester les autres configurations disponibles dans la consultation avant
        d'en sauvegarder une autre.
      </p>
      <display-selector :displayTypes="displayTypes"
        :userDisplayType="userDisplayType"
        @update-display-type="updateDisplayType">
      </display-selector>
    </conf-section>
    <conf-section  v-if="userCustomization.resources"
                   :title="{ icon: 'mdi-calendar-export', text: 'Export d\'agenda' }">
      <p>
        Attention, selon le client agenda utilisé, des doublons peuvent survenir lors d'un second import.
        L'interprétation du format icalendar reste très libre, en particulier sur la définition de l'unicité des évènements.
        Avant import, nous vous conseillons d'effectuer une sauvegarde de votre agenda.
      </p>
      <template #actions>
        <v-card-actions>
          <v-btn :href="icsURL" class="success">
            <strong>Télécharger</strong>
            <v-icon right>mdi-file-download-outline</v-icon>
          </v-btn>
          <v-btn class="warning d-none d-md-block" @click.stop="showQRCode = true">
            <strong>Afficher QRCode</strong>
            <v-icon right>mdi-qrcode</v-icon>
          </v-btn>
          <v-dialog v-model="showQRCode" max-width="250">
            <v-card>
              <v-card-text>
                <vue-qrcode :value="icsURL" :options="{ width: 200 }"></vue-qrcode>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="#3e8f93"
                       text
                       @click.stop="showQRCode = false">
                  <strong>FERMER</strong>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </template>
      <template #extra>
        <v-card-text>
          <p>
            ou utilisez ce lien : <a :href="icsURL">{{ icsURL }}</a>
          </p>
        </v-card-text>
      </template>
    </conf-section>
  </v-container>
</template>

<script>
import axios from 'axios';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import jwt_decode from 'jwt-decode';
import childrenEntryGenerator from '@/mixins/childrenEntryGenerator';
import DisplaySelector from '@/components/configurator/DisplaySelector.vue';
import ConfSection from '@/components/configurator/ConfSection.vue';

export default {
  name: 'ScheduleConfigurator',
  components: {
    ResourceRemover: () => import(/* webpackChunkName: "resource-remover" */ '@/components/configurator/ResourceRemover.vue'),
    ResourcesSelector: () => import(/* webpackChunkName: "resource-selector" */ '@/components/configurator/ResourcesSelector.vue'),
    DisplaySelector,
    VueQrcode,
    ConfSection,
  },
  mixins: [
    childrenEntryGenerator,
  ],
  data: () => ({
    token: localStorage.getItem('JWT__access__token') ? jwt_decode(localStorage.getItem('JWT__access__token')) : {},
    userCustomization: {},
    resourcesRoot: [],
    displayTypes: [],
    urls: {
      api: `${process.env.VUE_APP_BACKEND_API_URL}`,
      legacy: `${process.env.VUE_APP_BACKEND_LEGACY_URL}`,
      resources: `${process.env.VUE_APP_BACKEND_API_URL}/resource`,
      customization: `${process.env.VUE_APP_BACKEND_LEGACY_URL}/customization`,
      ics: String,
    },
    icsParams: {},
    show: false,
    showQRCode: false,
    snackbar: {
      isVisible: false,
      color: '',
      message: '',
      timeout: 0,
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
        return `${this.urls.ics}?${params}&${resources}`;
      }
      return '';
    },
  },
  created() {
    if (this.token.user_id) {
      this.getInitData();
    }
  },
  methods: {
    getInitData() {
      const getUserCustomization = () => this.axios.get(`${this.urls.customization}/${this.token.user_id}.json`);
      const postUserCustomization = () => this.axios.post(`${this.urls.customization}.json`, {
        username: this.token.user_id,
        directory_id: this.token.directory_id,
      });

      const resourceTypes = [
        'trainee',
        'instructor',
        'classroom',
        'category5',
      ];
      const getResourcesRoot = resourceTypes.map(type => () => this.axios.get(`${this.urls.resources}/${type}.json`));

      const getDisplayTypes = () => this.axios.get(`${this.urls.api}/display_types.json`);
      const getIcsParams = () => this.axios.get(`${this.urls.api}/ade_config.json`);

      axios
        .all([
          getUserCustomization().catch(error => (error.response.status === 404 ? postUserCustomization() : error)),
          ...(getResourcesRoot.map(request => request())),
          getDisplayTypes(),
          getIcsParams(),
        ])
        .then(axios.spread((userCustomization, traineeRoot, instructorRoot, classroomRoot, courseRoot, displayTypes, icsParams) => {
          this.userCustomization = userCustomization.data;
          this.resourcesRoot = this.forgeResourcesRoot([
            traineeRoot.data,
            instructorRoot.data,
            classroomRoot.data,
            courseRoot.data,
          ]);
          this.displayTypes = displayTypes.data;
          this.urls.ics = icsParams.data.base_url;
          this.icsParams = icsParams.data.params;
        }));
    },
    forgeResourcesRoot(rawResourcesRoot) {
      const rootNames = {
        trainee: 'Etudiants',
        instructor: 'Enseignants',
        classroom: 'Salles',
        category5: 'Matières',
      };
      const children = resource => resource.children.map(child => this.childrenEntryGenerator(child));
      const resourcesRoot = rawResourcesRoot.map(resource => ({
        ...resource,
        ...{children: this.sortChildren(children(resource))},
        ...{name: rootNames[resource.name]},
      }));
      return resourcesRoot;
    },
    removeResource(index) {
      this.userResources.splice(index, 1);
      this.updateResources(this.userResources);
    },
    updateResources(resourcesList) {
      const resources = {
        resources: resourcesList.map(resource => resource.replace(`${this.urls.resources}/`, '').match(/\d+/g).map(Number)).join(),
      };
      this.axios.patch(`${this.urls.customization}/${this.userCustomization.username}.json`, resources)
        .then((response) => {
          this.userCustomization = response.data;
          this.snackbar = {
            isVisible: true,
            color: 'success',
            message: 'Votre séléction de ressources a bien été mise à jour.',
            timeout: 6000,
          };
        })
        .catch(() => {
          this.snackbar = {
            isVisible: true,
            color: 'error',
            message: 'Une erreur est survenue pendant la mise à jour de votre séléction de ressources',
            timeout: 6000,
          };
        });
    },
    updateDisplayType(displayType) {
      this.axios.patch(`${this.urls.customization}/${this.userCustomization.username}.json`, { display_configuration: displayType })
        .then(() => {
          this.snackbar = {
            isVisible: true,
            color: 'success',
            message: 'Votre configuration d\'affichage a bien été mise à jour.',
            timeout: 6000,
          };
        })
        .catch(() => {
          this.snackbar = {
            isVisible: true,
            color: 'error',
            message: 'Une erreur est survenue pendant la mise à jour de votre configuration d\'affichage',
            timeout: 6000,
          };
        });
    },
    showResourcesSelector() {
      this.show = !this.show;
      if (this.show) {
        const options = {
          duration: 275,
          offset: 67,
          easing: 'linear',
        };
        this.$nextTick(() => {
          this.$vuetify.goTo('#resources-selection', options);
        });
      }
    },
  },
};
</script>

<style scoped>

</style>
