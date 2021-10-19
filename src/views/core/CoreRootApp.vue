<template>
  <layout name="Default">
    <router-view />
  </layout>
</template>

<script>
import Layout from '@/layouts/layout';

export default {
  name: 'CoreRootApp',
  components: {
    Layout
  },
};
</script>
