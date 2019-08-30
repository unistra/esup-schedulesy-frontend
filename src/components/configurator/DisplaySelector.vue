<template>
  <v-flex>
    <v-select filled
              color="#3e8f93"
              :items="items"
              persistent-hint>
    </v-select>
  </v-flex>
</template>

<script>
export default {
  name: 'DisplaySelector',
  data: () => ({
    items: [
      'Affichage ENT (Couleur)',
      'Affichage ENT (Noir/Blanc)',
      'Affichage ENT (Tableaux)',
      'Dentaire',
      'Ecole de management de Strasbourg',
      'ESBS',
      'ESPE',
      'Faculté de droit',
      'IUT de Haguenau (Couleur)',
      'IUT de Haguenau (Noir/Blanc)',
      'IUT Louis Pasteur (Couleur)',
      'IUT Louis Pasteur (Noir/Blanc)',
    ],
  }),

};
</script>

<style scoped>

</style>
