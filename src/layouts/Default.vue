<template>
  <v-app
    id="unistra-schedule"
    class=" unistra-schedule primary"
  >
    <core-nav-drawer />
    <core-app-bar @dark-mode="setDarkMode" />
    <v-content>
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
      <v-container
        class="pa-2"
      >
        <v-row justify="center">
          <slot />
        </v-row>
      </v-container>
    </v-content>
    <core-footer />
    <core-snackbar />
  </v-app>
</template>

<script>
import CoreNavDrawer from '@/components/core/CoreNavDrawer.vue';
import CoreAppBar from '@/components/core/CoreAppBar.vue';
import CoreSignature from '@/components/core/CoreSignature.vue';
import CoreFooter from '@/components/core/CoreFooter.vue';
import CoreSnackbar from '@/components/core/CoreSnackbar.vue';

export default {
  name: 'LayoutDefault',
  components: {
    CoreNavDrawer,
    CoreAppBar,
    CoreSignature,
    CoreFooter,
    CoreSnackbar,
  },
  computed: {
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
      const userOrganization = this.$store.getters['auth/getOrganization'];
      return this.$store.getters['ui/getSignature'](userOrganization);
    },
  },
  methods: {
    setDarkMode(value) {
      const payload = {
        changes: {
          configuration: {
            ...this.$store.getters['config/getUserCustomization'].configuration,
            ...{ darkMode: value },
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
      this.$store
        .dispatch('config/patchUserCustomization', payload)
        .then(() => { this.$vuetify.theme.dark = value; });
    },
  },
};
</script>
