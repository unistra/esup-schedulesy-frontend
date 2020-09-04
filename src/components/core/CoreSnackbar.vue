<template>
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
</template>

<script>
export default {
  name: 'CoreSnackbar',
  computed: {
    snackbar() {
      return this.$store.getters['ui/getSnackbar'];
    },
  },
};
</script>

<style scoped>

</style>
