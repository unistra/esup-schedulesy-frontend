<template>
  <v-container class="pa-2"
               fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <h2 class="headline">
              <v-icon>mdi-calendar-check-outline</v-icon>
              Ressources sélectionnées
            </h2>
            <p>
              La configuration de votre emploi du temps s'opère par sélection
              des ressources et de la configuration d'affichage.
            </p>
            <div v-if="userResources.length === 0">Vous n'avez actuellement aucune séléction enregistrée</div>
            <div v-else>
              <div>Votre sélection enregistrée actuellement est la suivante :</div>
              <v-list dense>
                <resource-remover v-for="(resourceId, index) in userResources"
                                  :key="index"
                                  :resourceId="resourceId"
                                  @remove-resource="removeResource(index)">
                </resource-remover>
              </v-list>
            </div>
            <strong class="red--text">Attention : si vous oubliez une ressource, votre emploi du temps sera incomplet !</strong>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn class="info"
                   @click="showResourcesSelector">
              {{ show ? 'Fermer' : 'Modifier' }} la séléction
              <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-expand-transition>
      <div v-show="show">
        <v-row>
          <v-col>
            <v-card>
              <v-card-text id="resources-selection">
                <h2 class="headline">
                  <v-icon>mdi-guitar-pick-outline</v-icon>
                  Modifier la sélection des ressources
                </h2>
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
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      <v-row>
          <v-col>
            <v-card>
              <v-card-text>
                <h2 class="headline">
                  <v-icon>mdi-shape</v-icon>
                  Choisissez votre configuration d'affichage :
                </h2>
                <p>
                  La configuration d'affichage par défaut correspond à celle de votre promotion.
                  Veuillez tester les autres configurations disponibles dans la consultation avant
                  d'en sauvegarder une autre.
                </p>

                <display-selector :displayTypes="displayTypes"
                                  :userDisplayType="userDisplayType"
                                  @update-display-type="updateDisplayType">
                </display-selector>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
    <v-row v-if="userCustomization.resources">
      <v-col>
        <v-card>
          <v-card-text>
            <h2 class="headline">
              <v-icon>mdi-calendar-export</v-icon>
              Export d'agenda
            </h2>
            <p>
              Attention, selon le client agenda utilisé, des doublons peuvent survenir lors d'un second import.
              L'interprétation du format icalendar reste très libre, en particulier sur la définition de l'unicité des évènements.
              Avant import, nous vous conseillons d'effectuer une sauvegarde de votre agenda.
            </p>
            <v-card-actions>
                <v-btn target="_blank" :href="icsURL" class="success">
                  Télécharger
                  <v-icon right>mdi-file-download-outline</v-icon>
                </v-btn>
                <v-btn class="warning d-none d-md-block" @click.stop="showQRCode = true">
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
                      <v-btn color="#3e8f93"
                             text
                             @click.stop="showQRCode = false">
                        <strong>FERMER</strong>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
            </v-card-actions>
            <div>
              ou utilisez ce lien : <a :href="icsURL">{{ icsURL }}</a>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v&#45;row v&#45;if="userCustomization.resources"> -->
    <!--   <v&#45;col> -->
    <!--     <v&#45;card> -->
    <!--       <v&#45;card&#45;text> -->
    <!--         <h2 class="headline"> -->
    <!--           <v&#45;icon>mdi&#45;qrcode&#45;scan</v&#45;icon> -->
    <!--           Version QRCode -->
    <!--         </h2> -->
    <!--         <vue&#45;qrcode :value="icsURL" :options="{ width: 200 }"></vue&#45;qrcode> -->
    <!--       </v&#45;card&#45;text> -->
    <!--     </v&#45;card> -->
    <!--   </v&#45;col> -->
    <!-- </v&#45;row> -->
  </v-container>
</template>

<script>
import axios from 'axios';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import jwt_decode from 'jwt-decode';
import childrenEntryGenerator from '@/mixins/childrenEntryGenerator';
import ResourceRemover from '@/components/configurator/ResourceRemover.vue';
import ResourcesSelector from '@/components/configurator/ResourcesSelector.vue';
import DisplaySelector from '@/components/configurator/DisplaySelector.vue';

export default {
  name: 'ScheduleConfigurator',
  components: {
    ResourceRemover,
    ResourcesSelector,
    DisplaySelector,
    VueQrcode,
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
        directory_id: this.token.directory_id
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
        });
    },
    updateDisplayType(displayType) {
      this.axios.patch(`${this.urls.customization}/${this.userCustomization.username}.json`, {display_configuration: displayType});
    },
    showResourcesSelector() {
      console.log('IN SHOWRESOURCESSELECTOR');
      this.show = !this.show;
      if (this.show) {
        console.log(this.show);
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
