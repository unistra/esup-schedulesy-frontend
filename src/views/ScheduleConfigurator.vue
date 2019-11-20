<template>
  <v-col xs="12"
         :sm="environment === 'ernest' ? 12 : 11"
         :md="environment === 'ernest' ? 12 : 10"
         :lg="environment === 'ernest' ? 12 : 9">
    <v-row v-if="environment !== 'ernest'">
      <v-col>
        <core-title class="primary--text"
                    :title="pageTitle">
        </core-title>
      </v-col>
    </v-row>
    <core-expansion-panels :panels="[htmlContent.howTo]">
    </core-expansion-panels>
    <core-section :title="{ class: 'headline', icon: 'mdi-calendar-check-outline', content: 'Ressources sélectionnées', level: 2 }">
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
          <v-btn tile
                 color="primary"
                 class="on-primary"
                 @click="showResourcesSelector">
            <strong>
              {{ show ? 'Fermer' : 'Modifier' }} la sélection
              <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </strong>
          </v-btn>
        </v-card-actions>
      </template>
    </core-section>
    <v-expand-transition>
      <core-section v-if="show"
                    id="resources-selection"
                    :title="{ class: 'headline', icon: 'mdi-guitar-pick-outline', content: 'Sélection des ressources', level: 2 }">
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
        <resources-selector :userResources="userResources"
                            @update-resources="updateResources">
        </resources-selector>
      </core-section>
    </v-expand-transition>
    <core-section :title="{ class: 'headline', icon: 'mdi-shape', content: 'Configuration d\'affichage', level: 2 }">
      <v-subheader class="text--primary"><strong>Mode d'affichage de la consultation</strong></v-subheader>
      <p>
        La consultation de votre emploi du temps offre le choix entre différents modes
        d'affichage. Ce réglage vous permet de définir votre mode d'affichage par défaut.
        <br />
        Le mode "personnalisé" vous permet de n'afficher que les jours sélectionnés dans le réglage
        "jours de la semaine à afficher".
        <br />
        Le mode "liste" n'est disponible que dans la version mobile. Si vous choisissez ce mode par
        défaut et que vous consultez votre emploi du temps sur un ordinateur de bureau, ce réglage
        sera conservé mais la consultation se fera en vue "calendrier" et le mode dépendra du réglage
        "Jours de la semaine à afficher" :
        <ul>
          <li>mode "personnalisé" si des jours sont sélectionnés,</li>
          <li>mode "semaine" le cas échéant.</li>
        </ul>
        <br />
        Le mode d'affichage reste accessible dans l'onglet "consultation", mais il ne sera
        effectif que pour la session en cours.
      </p>
      <v-select label="Mode par défaut"
                :items="displayModes"
                item-text="label"
                item-value="value"
                :value="userDisplayMode"
                @change="updateUserDisplayMode">
      </v-select>
      <v-subheader class="text--primary"><strong>Jours de la semaine à afficher</strong></v-subheader>
      <p>
        Par défaut, on affiche la totalité des jours de la semaine (lundi au dimanche).
        <br />
        Vous pouvez choisir de n'afficher que certains jours en les selectionnant dans la liste
        déroulante ci-dessous.
      </p>
      <v-select multiple
                eager
                attach
                chips
                deletable-chips
                label="Jours à afficher"
                :items="displayedDays"
                item-text="label"
                item-value="value"
                :value="userWeekdays"
                @change="updateUserWeekdays">
      </v-select>
    </core-section>
    <core-section v-if="userCustomization.resources"
                  :title="{ class: 'headline', icon: 'mdi-calendar-export', content: 'Export d\'agenda', level: 2 }">
      <p>
        Votre emploi du temps universitaire est consultable via l'onglet "Consulter". Vous
        pouvez également le consulter via un client de gestion d'agendas (type Google Agenda, 
        iCal ou Agenda Partage) sur votre ordinateur et/ou sur un appareil mobile.
        <br />
        Votre emploi du temps exporté sera synchronisé avec ADE et donc toujours à jour.
      </p>
      <p>
        Dans votre client de gestion d’agendas, choisissez l’abonnement à un calendrier (type
        iCal/ics) puis copiez-collez l’URL suivante:
        <br />
        <a :href="icsURL">{{ icsURL }}</a>
      </p>
      <p class="hidden-sm-and-down">
        Vous pouvez également scanner le QRCODE ci-dessous pour vous abonner à votre agenda sur
        votre appareil mobile.
      </p>
      <template #actions>
        <v-card-actions>
          <v-btn class="hidden-sm-and-down on-primary"
                 tile
                 color="primary"
                 @click.stop="showQRCode = true">
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
                <v-btn color="primary"
                       class="on-primary"
                       tile
                       @click.stop="showQRCode = false">
                  <strong>FERMER</strong>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </template>
    </core-section>
  </v-col>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode';
import CoreSection from '@/components/core/CoreSection.vue';
import CoreExpansionPanels from '@/components/core/CoreExpansionPanels.vue';
import CoreTitle from '@/components/core/CoreTitle.vue';

export default {
  name: 'ScheduleConfigurator',
  components: {
    ResourceRemover: () => import(/* webpackChunkName: "configurator" */ '@/components/configurator/ResourceRemover.vue'),
    ResourcesSelector: () => import(/* webpackChunkName: "configurator" */ '@/components/configurator/ResourcesSelector.vue'),
    VueQrcode,
    CoreSection,
    CoreExpansionPanels,
    CoreTitle,
  },
  data: () => ({
    environment: process.env.VUE_APP_DEPLOYMENT_ENV.substr(0, 6),
    pageTitle: {
      level: 1,
      class: 'display-1',
      content: 'Personnaliser votre emploi du temps',
    },
    show: false,
    showQRCode: false,
    htmlContent: {
      howTo: {
        title: {
          level: 2,
          icon: 'mdi-book-open-variant',
          class: 'headline',
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
              les jours de la semaine à afficher (par défaut, la totalité des jours est affichée).
            </li>
          </ul>
          <br />
          Vous pourrez ensuite consulter votre emploi du temps personnalisé dans l'onglet "Consulter".
          <br />
          NB : Les choix que vous effectuerez seront sauvegardés automatiquement et conservés en mémoire
          pour les consultations ultérieures de votre emploi du temps.
        `,
      },
    },
  }),
  computed: {
    displayModes() {
      return this.$store.getters['ui/getCalendarDisplayModes'];
    },
    displayedDays() {
      return this.$store.getters['ui/getDisplayedDays'];
    },
    userCustomization() {
      return this.$store.getters['config/getUserCustomization'];
    },
    userResources() {
      return this.$store.getters['config/getUserResourcesUrls'];
    },
    userDisplayType() {
      return this.$store.getters['config/getUserDisplayType'];
    },
    userDisplayMode() {
      if (this.userCustomization.configuration && this.userCustomization.configuration.displayMode) {
        return this.userCustomization.configuration.displayMode;
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
      return this.$store.getters['config/getBaseIcsUrl'];
    },
  },
  created() {
    if (this.$store.getters['auth/isLogged']) this.$store.dispatch('config/loadIcsParams');
  },
  methods: {
    removeResource(index) {
      const payload = {
        changes: {
          resources: this.$store.getters['config/getUserResourcesIds'].filter((resource, idx) => { if (idx !== index) return resource; }).join(),
        },
        snackbar: {
          success: {
            isVisible: true,
            color: 'success',
            message: 'Votre sélection de ressources a bien été mise à jour.',
            timeout: 6000,
          },
          error: {
            isVisible: true,
            color: 'error',
            message: 'Une erreur est survenue pendant la mise à jour de votre sélection de ressources',
            timeout: 6000,
          },
        },
      };
      this.$store.dispatch('config/patchUserCustomization', payload);
    },
    updateResources(resources) {
      const payload = {
        changes: {
          resources: resources.map(resource => resource.match(/(\d+)/g)[0]).join(),
        },
        snackbar: {
          success: {
            isVisible: true,
            color: 'success',
            message: 'Votre sélection de ressources a bien été mise à jour.',
            timeout: 6000,
          },
          error: {
            isVisible: true,
            color: 'error',
            message: 'Une erreur est survenue pendant la mise à jour de votre sélection de ressources',
            timeout: 6000,
          },
        },
      };
      this.$store.dispatch('config/patchUserCustomization', payload);
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
    updateUserDisplayMode(payload) {
      const newUserDisplayMode = {
        changes: {
          configuration: {
            ...this.userCustomization.configuration,
            ...{ displayMode: payload },
          },
        },
        snackbar: {
          success: {
            isVisible: true,
            color: 'success',
            message: 'Votre configuration d\'affichage a bien été mise à jour.',
            timeout: 6000,
          },
          error: {
            isVisible: true,
            color: 'error',
            message: 'Une erreur est survenue pendant la mise à jour de votre configuration d\'affichage',
            timeout: 6000,
          },
        },
      };
      this.$store.dispatch('config/patchUserCustomization', newUserDisplayMode);
    },
    updateUserWeekdays(payload) {
      const base = [1, 2, 3, 4, 5, 6, 0];
      const newUserWeekdays = base.filter(day => payload.includes(day));
      const newWeekdays = {
        changes: {
          configuration: {
            ...this.userCustomization.configuration,
            ...{ weekdays: newUserWeekdays },
          },
        },
        snackbar: {
          success: {
            isVisible: true,
            color: 'success',
            message: 'Votre configuration d\'affichage a bien été mise à jour.',
            timeout: 6000,
          },
          error: {
            isVisible: true,
            color: 'error',
            message: 'Une erreur est survenue pendant la mise à jour de votre configuration d\'affichage',
            timeout: 6000,
          },
        },
      };
      this.$store.dispatch('config/patchUserCustomization', newWeekdays);
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
  beforeRouteLeave(to, from, next) {
    if (this.userCustomization.resources) next();
    else {
      next(false);
      this.$store.dispatch('ui/updateSnackbar', {
        isVisible: true,
        color: 'warning',
        message: 'Veuillez sélectionner au moins une ressource avant d\'accéder à la consultation',
        timeout: 6000,
      });
    }
  },
};
</script>

<style scoped>
.on-primary {
  color: var(--v-onprimary-base) !important;
}
</style>
