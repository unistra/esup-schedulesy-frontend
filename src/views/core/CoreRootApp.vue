<template>
  <div>
    <core-nav-drawer></core-nav-drawer>
    <core-app-bar @dark-mode="setDarkMode"></core-app-bar>
    <v-content>
      <v-img :src="require('@/assets/img/business.jpg')"
        :max-height="imageHeight">
        <v-row class="lightbox fill-height" justify="center">
          <v-col offset-sm="2" align-self="center" class="d-flex justify-center justify-sm-start">
            <signature />
          </v-col>
        </v-row>
      </v-img>
      <v-container class="pa-2"
                   fluid>
        <v-row justify="center">
          <router-view></router-view>
        </v-row>
      </v-container>
    </v-content>
    <v-divider></v-divider>
    <core-footer></core-footer>
  </div>
</template>

<script>
import Signature from '@/components/Signature.vue';
import CoreNavDrawer from '@/components/core/CoreNavDrawer.vue';
import CoreAppBar from '@/components/core/CoreAppBar.vue';
import CoreFooter from '@/components/core/CoreFooter.vue';

export default {
  name: 'CoreRootApp',
  components: {
    Signature,
    CoreNavDrawer,
    CoreAppBar,
    CoreFooter,
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

<style scoped>

</style>
