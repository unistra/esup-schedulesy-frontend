<template>
  <v-app
    id="unistra-schedule"
    class=" unistra-schedule primary"
  >
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
          <core-signature />
        </v-col>
      </v-row>
    </v-img>
    <v-main>
      <v-container class="pa-2">
        <v-row justify="center">
          <slot />
        </v-row>
      </v-container>
    </v-main>
    <core-footer></core-footer>
    <core-snackbar></core-snackbar>
  </v-app>
</template>

<script>
import CoreSignature from '@/components/core/CoreSignature.vue';
import CoreFooter from '@/components/core/CoreFooter.vue';
import CoreSnackbar from '@/components/core/CoreSnackbar.vue';

export default {
  name: 'LayoutAppBarLess',
  components: {
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
  },
};
</script>
