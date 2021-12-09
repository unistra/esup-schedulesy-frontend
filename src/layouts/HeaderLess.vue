<template>
  <v-app
    id="unistra-schedule"
    class=" unistra-schedule primary"
  >
    <v-content>
      <v-container
        class="pa-2 fill-height"
      >
        <slot />
      </v-container>
    </v-content>
    <core-footer></core-footer>
    <core-snackbar></core-snackbar>
  </v-app>
</template>

<script>
import CoreFooter from '@/components/core/CoreFooter.vue';
import CoreSnackbar from '@/components/core/CoreSnackbar.vue';

export default {
  name: 'LayoutHeaderLess',
  components: {
    CoreFooter,
    CoreSnackbar,
  },
};
</script>
