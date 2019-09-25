<template>
  <v-flex xs12
          sm11
          md10
          lg9>
    <v-snackbar v-model="snackbar.isVisible"
                top
                :color="snackbar.color"
                :timeout="snackbar.timeout">
      {{ snackbar.message }}
      <v-btn text
             @click.stop="snackbar.isVisible = false">
        <strong>FERMER</strong>
      </v-btn>
    </v-snackbar>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header class="px-4">
          <h2 class="headline">
            <v-icon>mdi-book-open-variant</v-icon>
            Mode d'emploi
          </h2>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          ADE est l’application de gestion des emplois du temps de l'Université : elle permet de gérer
          les plannings des salles ainsi que les emplois du temps des enseignants et des étudiants.
          <br />
          <br />
          L'outil de personnalisation de l’emploi du temps vous permet de le paramétrer en choisissant:
          <ul>
            <li>
              les ressources à afficher (groupe d'étudiants et/ou matières, enseignants, salles)
            </li>
            <li>
              une configuration d’affichage
            </li>
          </ul>
          <br />
          NB: Les choix que vous effectuerez seront sauvegardés automatiquement.
          <br />
          <br />
          Vous pourrez ensuite consulter votre emploi du temps personnalisé dans ADE (lien dans le lanceur d’applications ou via le moteur de recherche).
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <conf-section :title="{ icon: 'mdi-calendar-check-outline', text: 'Ressources sélectionnées' }">
      <p v-if="userResources.length === 0">
        Vous n'avez actuellement aucune ressource sélectionnée.
        <br />
        Cliquez sur le bouton "Modifier la sélection" pour effectuer votre choix.
        <br />
        <br />
        NB : Les choix que vous effectuerez seront sauvegardés automatiquement.
      </p>
      <p v-else>
        Votre sélection enregistrée actuellement est la suivante :
        <v-list>
          <resource-remover v-for="(resourceId, index) in userResources"
                            :key="index"
                            :resourceId="resourceId"
                            @remove-resource="removeResource(index)">
          </resource-remover>
        </v-list>
        Si vous souhaitez désélectionner une des ressources de la liste, cliquez sur l’icône
        représentant une croix.
      </p>
      <p>
      </p>
      <p>
        <strong class="red--text">
          Attention : si vous oubliez une ressource, votre emploi du temps sera incomplet !
        </strong>
      </p>
      <template #actions>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn class="info"
                 @click="showResourcesSelector">
            <strong>{{ show ? 'Fermer' : 'Modifier' }} la sélection</strong>
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-actions>
      </template>
    </conf-section>
    <v-expand-transition>
      <conf-section v-if="show"
                    id="resources-selection"
                    :title="{ icon: 'mdi-guitar-pick-outline', text: 'Sélection des ressources' }">
        <p>
          Sélectionnez des ressources en cliquant sur un type de ressources (Etudiants, enseignants,
          salles, matières) puis en cochant les cases de votre choix.
        </p>
        <ul>
          <li>
            Etudiants : sélectionnez les groupes d'étudiants et/ou les matières qui vous concernent.
          </li>
          <li>
            Enseignants et personnels administratifs : sélectionnez les ressources de votre choix.
          </li>
        </ul>
        <resources-selector :root="resourcesRoot"
          :userResources="userResources"
          @update-resources="updateResources">
        </resources-selector>
      </conf-section>
    </v-expand-transition>
    <conf-section :title="{ icon: 'mdi-shape', text: 'Configuration d\'affichage' }">
      <p>
        Choisissez la configuration d'affichage de votre composante (UFR, faculté, école,
        institut, ...) ou l'une de celles proposées par défaut en début de liste.
      </p>
      <display-selector :displayTypes="displayTypes"
        :userDisplayType="userDisplayType"
        @update-display-type="updateDisplayType">
      </display-selector>
    </conf-section>
    <conf-section  v-if="userCustomization.resources"
                   :title="{ icon: 'mdi-calendar-export', text: 'Export d\'agenda' }">
      <p>
        L'export d'agenda vous permet de consulter votre emploi du temps universitaire via un
        client de gestion d’agendas (type Google Agenda, iCal ou Agenda Partage) sur votre
        ordinateur et/ou sur un appareil mobile. Votre calendrier sera synchronisé avec ADE et
        sera donc toujours à jour.
      </p>
      <p>
        Dans votre client de gestion d’agendas, choisissez l’abonnement à un calendrier puis
        copiez-collez l’URL suivante:
        <br />
        <a :href="icsURL">{{ icsURL }}</a>
      </p>
      <p class="hidden-sm-and-down">
        Vous pouvez également scanner le QRCODE ci-dessous pour vous abonner à votre agenda sur
        votre appareil mobile.
      </p>
      <template #actions>
        <v-card-actions>
          <v-btn class="warning hidden-sm-and-down" @click.stop="showQRCode = true">
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
    </conf-section>
  </v-flex>
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
    ResourceRemover: () => import(/* webpackChunkName: "configurator" */ '@/components/configurator/ResourceRemover.vue'),
    ResourcesSelector: () => import(/* webpackChunkName: "configurator" */ '@/components/configurator/ResourcesSelector.vue'),
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
            message: 'Votre sélection de ressources a bien été mise à jour.',
            timeout: 6000,
          };
        })
        .catch(() => {
          this.snackbar = {
            isVisible: true,
            color: 'error',
            message: 'Une erreur est survenue pendant la mise à jour de votre sélection de ressources',
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
