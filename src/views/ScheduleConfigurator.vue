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
    <core-expansion-panels :panels="[htmlContent.howTo]">
    </core-expansion-panels>
    <core-section :title="{ icon: 'mdi-calendar-check-outline', content: 'Ressources sélectionnées', level: 2 }">
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
        <strong class="red--text">
          Attention : si vous oubliez une ressource, votre emploi du temps sera incomplet !
        </strong>
      </p>
      <template #actions>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn tile color="primary"
                      @click="showResourcesSelector">
            {{ show ? 'Fermer' : 'Modifier' }} la sélection
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-card-actions>
      </template>
    </core-section>
    <v-expand-transition>
      <core-section v-if="show"
                    id="resources-selection"
                    :title="{ icon: 'mdi-guitar-pick-outline', content: 'Sélection des ressources', level: 2 }">
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
      </core-section>
    </v-expand-transition>
    <core-section :title="{ icon: 'mdi-shape', content: 'Configuration d\'affichage', level: 2 }">
      <p>
        Choisissez la configuration d'affichage de votre composante (UFR, faculté, école,
        institut, ...) ou l'une de celles proposées par défaut en début de liste.
      </p>
      <display-selector v-if="false"
                        :displayTypes="displayTypes"
                        :userDisplayType="userDisplayType"
                        @update-display-type="updateDisplayType">
      </display-selector>
      <p v-if="true">
        <v-subheader class="text--primary"><strong>Jours</strong></v-subheader>
        <v-row v-if="false">
          <v-col v-for="(day, index) in displayedDays"
                 :key="index">
            <v-checkbox hide-details
                        class="ma-0 pa-0"
                        :label="day.label"
                        :value="day.value">
            </v-checkbox>
          </v-col>
        </v-row>
        <v-select multiple
                  chips
                  deletable-chips
                  label="Jours à afficher"
                  :items="displayedDays"
                  item-text="label"
                  item-value="value"
                  :value="userWeekdays"
                  @change="updateUserWeekdays">
        </v-select>
      </p>
    </core-section>
    <core-section v-if="userCustomization.resources"
                  :title="{ icon: 'mdi-calendar-export', content: 'Export d\'agenda', level: 2 }">
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
          <v-btn class="hidden-sm-and-down" tile color="primary" @click.stop="showQRCode = true">
            Afficher QRCode
            <v-icon right>mdi-qrcode</v-icon>
          </v-btn>
          <v-dialog v-model="showQRCode" max-width="250">
            <v-card>
              <v-card-text>
                <vue-qrcode :value="icsURL" :options="{ width: 200 }"></vue-qrcode>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary"
                       tile
                       @click.stop="showQRCode = false">
                  FERMER
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </template>
    </core-section>
  </v-flex>
</template>

<script>
import axios from 'axios';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import jwt_decode from 'jwt-decode';
import childrenEntryGenerator from '@/mixins/childrenEntryGenerator';
import DisplaySelector from '@/components/configurator/DisplaySelector.vue';
import CoreSection from '@/components/core/CoreSection.vue';
import CoreExpansionPanels from '@/components/core/CoreExpansionPanels.vue';

export default {
  name: 'ScheduleConfigurator',
  components: {
    ResourceRemover: () => import(/* webpackChunkName: "configurator" */ '@/components/configurator/ResourceRemover.vue'),
    ResourcesSelector: () => import(/* webpackChunkName: "configurator" */ '@/components/configurator/ResourcesSelector.vue'),
    DisplaySelector,
    VueQrcode,
    CoreSection,
    CoreExpansionPanels,
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
    htmlContent: {
      howTo: {
        title: {
          level: 2,
          icon: 'mdi-book-open-variant',
          content: 'Mode d\'emploi',
        },
        content: `
          ADE est l’application de gestion des emplois du temps de l'Université : elle permet de gérer
          les plannings des salles ainsi que les emplois du temps des enseignants et des étudiants.
          <br />
          <br />
          L'outil de personnalisation de l’emploi du temps vous permet de le paramétrer en choisissant:
          <ul>
            <li>
              les ressources à afficher (groupe d'étudiants et/ou matières, enseignants, salles),
            </li>
            <li>
              une configuration d’affichage.
            </li>
          </ul>
          <br />
          NB : Les choix que vous effectuerez seront sauvegardés automatiquement.
          <br />
          <br />
          Vous pourrez ensuite consulter votre emploi du temps personnalisé dans ADE (lien dans le lanceur d’applications ou via le moteur de recherche).
        `,
      },
    },
    displayedDays: [
      { label: 'Lundi', value: 1 },
      { label: 'Mardi', value: 2 },
      { label: 'Mercredi', value: 3 },
      { label: 'Jeudi', value: 4 },
      { label: 'Vendredi', value: 5 },
      { label: 'Samedi', value: 6 },
      { label: 'Dimanche', value: 0 },
    ],
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
    userWeekdays() {
      if (this.userCustomization.configuration && this.userCustomization.configuration.weekdays) {
        return this.userCustomization.configuration.weekdays;
      }
      return [];
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
    updateUserWeekdays(payload) {
      const base = [1, 2, 3, 4, 5, 6, 0];
      const newUserWeekdays = base.filter(day => payload.includes(day));
      const newUserConf = {
        ...this.userCustomization.configuration,
        ...{ weekdays: newUserWeekdays },
      };
      this.axios.patch(`${this.urls.customization}/${this.userCustomization.username}.json`, { configuration: newUserConf })
        .then((response) => {
          this.userCustomization = response.data;
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
