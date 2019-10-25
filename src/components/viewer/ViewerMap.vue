<template>
  <l-map  v-if="coordinates.length"
          style="min-height: calc(100vh - 64px)"
          :zoom="zoom"
          :center="coordinates">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker :lat-lng="coordinates"></l-marker>
  </l-map>
</template>

<script>
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
  name: 'ViewerMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  props: {
    coordinates: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    zoom: 18,
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    latlng: latLng(48.526535, 7.739203),
  }),
};
</script>

<style scoped>

</style>
