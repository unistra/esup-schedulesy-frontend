<template>
  <v-footer>
    <v-spacer></v-spacer>
    <span>{{ year }} - <strong> Université de Strasbourg</strong> - {{ version }} - Tous droits réservés</span>
    <v-spacer></v-spacer>
  </v-footer>
</template>

<script>
export default {
  name: 'CoreFooter',
  data: () => ({
    year: new Date().getFullYear(),
    version: VERSION,
  }),
};
</script>

<style scoped>

</style>
