<template>
  <v-footer>
    <v-spacer></v-spacer>
    <span>{{ year }} - <strong> Université de Strasbourg</strong> - Tous droits réservés</span>
    <v-spacer></v-spacer>
  </v-footer>
</template>

<script>
export default {
  name: 'CoreFooter',
  data: () => ({
    year: new Date().getFullYear(),
  }),
};
</script>

<style scoped>

</style>
