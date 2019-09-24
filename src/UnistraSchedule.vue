<template>
  <v-app id="unistra-schedule">
    <v-navigation-drawer v-model="drawer"
                         app>
      <v-list dense>
        <v-list-item to="config">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>Personnaliser</v-list-item-content>
        </v-list-item>
        <!-- <v&#45;list&#45;item to="config"> -->
        <!--   <v&#45;list&#45;item&#45;action> -->
        <!--     <v&#45;icon>mdi&#45;eye&#45;check</v&#45;icon> -->
        <!--   </v&#45;list&#45;item&#45;action> -->
        <!--   <v&#45;list&#45;item&#45;content>Consulter</v&#45;list&#45;item&#45;content> -->
        <!-- </v&#45;list&#45;item> -->
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dense>
      <v-app-bar-nav-icon class="d-sm-none"
                          @click.stop="drawer = !drawer">
      </v-app-bar-nav-icon>
      <v-btn color="primary" icon class="d-none d-sm-block">
      <v-icon>mdi-home-outline</v-icon>
      </v-btn>
      <v-toolbar-items class="d-none d-sm-block">
        <v-btn text to="config"><strong>Personnaliser</strong></v-btn>
        <!-- <v&#45;btn text><strong>Consulter</strong></v&#45;btn> -->
      </v-toolbar-items>
    </v-app-bar>
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
                   fluid
                   fill-height>
        <v-layout justify-center>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>

</template>

<script>
import Signature from '@/components/Signature.vue';

export default {
  name: 'UnitraSchedule',
  components: {
    Signature,
  },
  data: () => ({
    drawer: false,
  }),
  computed: {
    imageHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          console.log('xs');
          return '170';
        case 'sm':
          console.log('sm');
          return '230';
        case 'md':
          console.log('md');
          return '290';
        default:
          console.log('lg');
          return '350';
      }
    },
  },
};
</script>

<style scoped>
</style>
