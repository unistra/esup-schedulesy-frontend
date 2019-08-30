<template>
  <v-layout column>
    <v-flex>
      <p>
      La configuration de votre emploi du temps s'opère par sélection
      des ressources et de la configuration d'affichage.
      </p>
    </v-flex>
    <v-flex>
      <h2>Sélectionnez vos ressources dans l'arbre ci dessous :</h2>
      <p>L'affichage des ressources est le même que dans la consultation.</p>
      <ul>
        <li>
          Si vous êtes étudiant, veuillez sélectionner les groupes d'étudiants qui vous concernent.
        </li>
        <li>
          Si vous êtes étudiant des sciences humaines, vous devrez sélectionner
          vos groupes de matières.
        </li>
        <li>
          Enfin, si vous êtes enseignant, sélectionnez les ressources
          que vous voulez voir s'afficher.
        </li>
      </ul>
    </v-flex>
    <resources-selector v-for="(requested, index) in requestedResources"
                        :key="index"
                        :resource="requested">
    </resources-selector>
    <v-flex>
      <h2>Choisissez votre configuration d'affichage :</h2>
      <p>
      La configuration d'affichage par défaut correspond à celle de votre promotion.
      Veuillez tester les autres configurations disponibles dans la consultation avant
      d'en sauvegarder une autre.
      </p>
    </v-flex>
    <display-selector />
    <v-flex>
      <h2 class="red--text">Attention : si vous oubliez une ressource, votre emploi du temps sera incomplet !</h2>
    </v-flex>
  </v-layout>
</template>

<script>
import ResourcesSelector from '@/components/configurator/ResourcesSelector.vue';
import DisplaySelector from '@/components/configurator/DisplaySelector.vue';

export default {
  name: 'ScheduleConfigurator',
  components: {
    ResourcesSelector,
    DisplaySelector,
  },
  data: () => ({
    requestedResources: [
      'trainee',
      'instructor',
      'classroom',
      'category5',
    ],
  }),
};
</script>

<style scoped>

</style>
