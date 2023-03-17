<template>
  <v-app
    id="unistra-schedule"
    class=" unistra-schedule primary"
  >
    <template v-if="!loading">
      <core-nav-drawer />
      <core-app-bar @dark-mode="setDarkMode" />
      <v-main>
        <v-img
          :src="require('@/assets/img/business.jpg')"
          :max-height="imageHeight"
        >
          <v-row
            class="lightbox fill-height"
            justify="center"
          >
            <v-col
              offset-sm="2"
              align-self="center"
              class="d-flex justify-center justify-sm-start"
            >
              <core-signature :organization="organization" />
            </v-col>
          </v-row>
        </v-img>
        <v-container class="pa-2">
          <v-row justify="center">
            <router-view />
          </v-row>
        </v-container>
      </v-main>
      <core-footer />
      <core-snackbar />
    </template>
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getOrganization } from '@/services/authService'
import CoreNavDrawer from '@/components/core/CoreNavDrawer.vue'
import CoreAppBar from '@/components/core/CoreAppBar.vue'
import CoreSignature from '@/components/core/CoreSignature.vue'
import CoreFooter from '@/components/core/CoreFooter.vue'
import CoreSnackbar from '@/components/core/CoreSnackbar.vue'

export default {
  name: 'LayoutDefault',
  components: {
    CoreNavDrawer,
    CoreAppBar,
    CoreSignature,
    CoreFooter,
    CoreSnackbar,
  },
  data: () => ({
    loading: true,
  }),
  computed: {
    ...mapGetters({
      userConfiguration: 'config/userConfiguration',
    }),
    imageHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '120';
        case 'sm':
          return '180';
        case 'md':
          return '240';
        default:
          return '300';
      }
    },
    organization() {
      return getOrganization()
    },
  },
  methods: {
    ...mapActions({
      loadUserCustomization: 'config/loadUserCustomization',
      updateUserCustomization: 'config/updateUserCustomization',
      updateSnackbar: 'ui/updateSnackbar',
    }),
    async setDarkMode(darkMode) {
      const snackbar = {
        isVisible: true,
        timeout: 6000,
      }
      const customization = {
        configuration : {
          ...this.userConfiguration,
          ...{ darkMode },
        },
      }
      try {
        await this.updateUserCustomization(customization)
        this.$vuetify.theme.dark = darkMode
        snackbar.message = 'Votre configuration d\'affichage a bien été mise à jour.'
        snackbar.color = 'success'
      } catch (error) {
        snackbar.message = 'Une erreur est survenue pendant la mise à jour de votre configuration d\'affichage'
        snackbar.color = 'error'
        throw error
      } finally {
        this.updateSnackbar(snackbar)
      }
    },
  },
  async created() {
    const snackbar = {
      isVisible: true,
      timeout: 6000,
    }
    try {
      await this.loadUserCustomization()
      this.$vuetify.theme.dark = this.userConfiguration?.darkMode
    } catch (error) {
      snackbar.message = 'Une erreur est survenue pendant la récupération de votre configuration'
      snackbar.color = 'error'
      this.updateSnackbar(snackbar)
      throw error
    } finally {
      this.loading = false
    }
  },
};
</script>
