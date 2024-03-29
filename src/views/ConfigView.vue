<template>
  <v-col>
   <core-title 
     class="primary--text"
     :title="pageTitle"
   />

    <core-expansion-panels :panels="[htmlContent.howTo]" />

    <core-section :title="{ class: 'headline', icon: 'mdi-calendar-check-outline', content: 'Ressources sélectionnées', level: 2 }">
      <p v-if="userResourcesUrls.length === 0">
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
          <resource-remover
            v-for="([resourceUrl, resourceId], index) in userResourcesUrls"
            :key="index"
            :resourceId="resourceUrl"
            @remove-resource="removeResource(resourceId)"
          />
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
          <v-btn
            tile
            color="primary"
            class="on-primary"
            @click="showResourcesSelector"
          >
            <strong>
              {{ show ? 'Fermer' : 'Modifier' }} la sélection
              <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </strong>
          </v-btn>
        </v-card-actions>
      </template>
    </core-section>

    <v-expand-transition>
      <core-section
        v-if="show"
        id="resources-selection"
        :title="{ class: 'headline', icon: 'mdi-guitar-pick-outline', content: 'Sélection des ressources', level: 2 }"
      >
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
        <resources-selector
          :userResources="userResourcesUrls.map(([resourceUrl, resourceId]) => resourceUrl)"
          @update-resources="updateResources"
        />
      </core-section>
    </v-expand-transition>

    <core-section :title="{ class: 'headline', icon: 'mdi-shape', content: 'Configuration d\'affichage', level: 2 }">
      <v-subheader class="text--primary">
        <strong>Thème</strong>
      </v-subheader>
      <p>
      Le thème Pastel propose une version plus claire et plus douce des couleurs. Il permet de gagner en lisibilité et offre un meilleur contraste entre la couleur de fond des évènements et le texte.
      </p>
      <p>
        <strong class="red--text">
          Attention : certaines nuances de couleur proches peuvent être plus difficiles à distinguer
        </strong>
      </p>
      <v-select
        label="Thème"
        :items="themes"
        item-text="label"
        item-value="value"
        :value="userTheme"
        @change="updateUserTheme"
      />
      <v-subheader class="text--primary">
        <strong>Mode d'affichage de la consultation</strong>
      </v-subheader>
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
      <v-select
        label="Mode par défaut"
        :items="displayModes"
        item-text="label"
        item-value="value"
        :value="userDisplayMode"
        @change="updateUserDisplayMode"
      />
      <v-subheader class="text--primary">
        <strong>Jours de la semaine à afficher</strong>
      </v-subheader>
      <p>
        Par défaut, on affiche la totalité des jours de la semaine (lundi au dimanche).
        <br />
        Vous pouvez choisir de n'afficher que certains jours en les selectionnant dans la liste
        déroulante ci-dessous.
      </p>
      <v-select
        multiple
        eager
        attach
        chips
        deletable-chips
        label="Jours à afficher"
        :items="displayedDays"
        item-text="label"
        item-value="value"
        :value="userWeekDays"
        @change="updateUserWeekDays"
      />
    </core-section>

    <core-section
      v-if="userHasResources"
      :title="{ class: 'headline', icon: 'mdi-calendar-export', content: 'Export d\'agenda', level: 2 }"
    >
      <p>
        Autre fonctionnalité bonus, si la version navigateur ne vous suffit pas, vous pouvez
        également l’exporter dans une application d’agenda (exemples : Agenda Android, iCal,
        Outlook etc.) sur votre ordinateur et/ou sur un appareil mobile.
        <br />
        Votre emploi du temps exporté sera synchronisé avec ADE et donc toujours à jour même si vous
        modifiez votre personnalisation.
      </p>
      <p>
        Dans votre application d’agendas, choisissez l’abonnement à un calendrier (type
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
          <v-btn
            class="hidden-sm-and-down on-primary"
            tile
            color="primary"
            @click.stop="showQRCode = true"
          >
            <strong>Afficher QRCode</strong>
            <v-icon right>mdi-qrcode</v-icon>
          </v-btn>
          <v-dialog
            v-model="showQRCode"
            max-width="250"
          >
            <v-card>
              <v-card-text>
                <vue-qrcode
                  :value="icsURL"
                  :options="{ width: 200 }"
                />
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1" />
                <v-btn
                  color="primary"
                  class="on-primary"
                  tile
                  @click.stop="showQRCode = false"
                >
                  <strong>FERMER</strong>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </template>
    </core-section>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-col>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import CoreSection from '@/components/core/CoreSection.vue'
import CoreExpansionPanels from '@/components/core/CoreExpansionPanels.vue'
import CoreTitle from '@/components/core/CoreTitle.vue'

export default {
  name: 'Config',
  components: {
    ResourceRemover: () => import(/* webpackChunkName: "configurator" */ '@/components/configurator/ResourceRemover.vue'),
    ResourcesSelector: () => import(/* webpackChunkName: "configurator" */ '@/components/configurator/ResourcesSelector.vue'),
    VueQrcode,
    CoreSection,
    CoreExpansionPanels,
    CoreTitle,
  },
  data: () => ({
    pageTitle: {
      level: 1,
      class: 'display-1',
      content: 'Personnaliser votre emploi du temps',
    },
    htmlContent: {
      howTo: {
        title: {
          level: 2,
          icon: 'mdi-book-open-variant',
          class: 'headline',
          content: 'Mode d\'emploi',
        },
        content: `
          <p>
          <strong>ADE</strong> est l’application de gestion des emplois du temps de l'Université :
          elle permet de gérer les plannings des salles ainsi que les emplois du temps des
          enseignants et des étudiants.
          </p>
          <p>
          <strong>"Mon emploi du temps"</strong> est un outil qui vous permettra de consulter
          facilement votre emploi du temps sur mobile ou sur ordinateur.
          </p>
          <p>
          Pour cela effectuez d'abord votre sélection de ressources dans le cadre ci-dessous.
          </p>
          <p>
          Les choix que vous effectuerez seront sauvegardés automatiquement et conservés en mémoire
          pour les consultations ultérieures de votre emploi du temps.
          </p>
          <p>
          Votre emploi du temps personnalisé sera accessible <strong>dans l'onglet "Consulter" en
          haut à gauche</strong>.
          </p>
          <p>
          Vous pourrez retrouver cet emploi du temps personnalisé <strong>sur votre navigateur
          (Chrome, Firefox, Edge, Safari) sur mobile ou ordinateur</strong>, en passant par cette
          application.
          </p>
        `,
      },
    },
    show: false,
    showQRCode: false,
    loading: true,
  }),
  computed: {
    ...mapGetters({
      userResourcesIds: 'config/userResourcesIds',
      userResourcesUrls: 'config/userResourcesUrls',
      userHasResources: 'config/userHasResources',
      userConfiguration: 'config/userConfiguration',
      userTheme : 'config/userTheme',
      userDisplayMode: 'config/userDisplayMode',
      userWeekDays: 'config/userWeekDays',
      userUuid: 'config/userUuid',
      themes: 'ui/getThemes',
      displayModes: 'ui/getCalendarDisplayModes',
      displayedDays: 'ui/getDisplayedDays',
    }),
    icsURL() {
      return `${process.env.VUE_APP_BACKEND_API_URL}/calendar/${this.userUuid}/export`;
    },
  },
  methods: {
    ...mapActions({
      patchUserCustomization: 'config/updateUserCustomization',
      loadUserUuid: 'config/loadUserUuid',
      updateSnackbar: 'ui/updateSnackbar',
    }),
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
    async updateUserCustomization(payload) {
      const snackbar = {
        isVisible: true,
        timeout: 6000,
      }
      try {
        await this.patchUserCustomization(payload.changes)
        snackbar.message = payload.success
        snackbar.color = 'success'
      } catch (error) {
        snackbar.message = payload.error
        snackbar.color = 'error'
        throw error
      } finally {
        this.updateSnackbar(snackbar)
      }
    },
    removeResource(resourceId) {
      const resources = this.userResourcesIds.filter((resource) => resource !== resourceId).join()
      const payload = {
        changes: { resources },
        success: 'Votre sélection de ressources a bien été mise à jour.',
        error: 'Une erreur est survenue pendant la mise à jour de votre sélection de ressources',
      };
      this.updateUserCustomization(payload);
    },
    updateResources(selectedResources) {
      const resources = selectedResources.map((resource) => resource.match(/(\d+)(?=\.json)/g)[0]).join()
      const payload = {
        changes: { resources },
        success: 'Votre sélection de ressources a bien été mise à jour.',
        error: 'Une erreur est survenue pendant la mise à jour de votre sélection de ressources',
      };
      this.updateUserCustomization(payload);
    },
    updateUserTheme(theme) {
      const configuration = {
        ...this.userConfiguration,
        ...{ theme },
      }
      const payload = {
        changes: {
          configuration,
        },
        success: 'Votre configuration d\'affichage a bien été mise à jour.',
        error: 'Une erreur est survenue pendant la mise à jour de votre configuration d\'affichage',
      };
      this.updateUserCustomization(payload);
    },
    updateUserDisplayMode(displayMode) {
      const configuration = {
        ...this.userConfiguration,
        ...{ displayMode },
      }
      const payload = {
        changes: { configuration },
        success: 'Votre configuration d\'affichage a bien été mise à jour.',
        error: 'Une erreur est survenue pendant la mise à jour de votre configuration d\'affichage',
      };
      this.updateUserCustomization(payload);
    },
    updateUserWeekDays(newWeekDays) {
      const base = [1, 2, 3, 4, 5, 6, 0];
      const weekdays = base.filter((day) => newWeekDays.includes(day));
      const configuration = {
        ...this.userConfiguration,
        ...{ weekdays },
      }
      const payload = {
        changes: { configuration },
        success: 'Votre configuration d\'affichage a bien été mise à jour.',
        error: 'Une erreur est survenue pendant la mise à jour de votre configuration d\'affichage',
      };
      this.updateUserCustomization(payload);
    },
  },
  async created() {
    await this.loadUserUuid()
    this.loading = false
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'home' && !this.userHasResources) {
      this.updateSnackbar({
        isVisible: true,
        color: 'warning',
        message: 'Veuillez sélectionner au moins une ressource avant d\'accéder à la consultation',
        timeout: 6000,
      })
      next(false)
    } else {
      next()
    }
  },
}
</script>

<style scoped>
.on-primary {
  color: var(--v-onprimary-base) !important;
}
</style>
