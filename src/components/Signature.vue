<template>
  <div class="sun sun-theme-primary" id="signature">
    <span class="sun-row sun-offset-7">
      <span class="sun-cell"
            :class="icons.cssClasses">
        <span class="sun-cell-inner">
          <i v-for="(icon, index) in icons.content"
             :key="index"
             class="us"
             :class="icon">
          </i>
        </span>
      </span>
      <a class="sun-cell"
         href="#"
         title="Emploi du temps">
        <span class="sun-cell-inner">
          <strong>Emploi du temps</strong>
        </span>
      </a>
      <span class="sun-cell sun-empty-9"></span>
      <span class="sun-cell sun-empty-1"></span>
    </span>
    <span class="sun-row">
      <a class="sun-cell"
         href="https://services-numerique.unistra.fr"
         title="Direction du numérique">
        <span class="sun-cell-inner">Direction</span>
      </a>
      <a class="sun-cell"
         href="https://services-numerique.unistra.fr"
         title="Direction du numérique">
        <span class="sun-cell-inner">du <strong>numérique</strong></span>
      </a>
      <span class="sun-cell sun-empty-15"></span>
    </span>
    <span class="sun-row sun-offset-12">
      <span class="sun-cell sun-empty-12"></span>
      <span class="sun-cell sun-empty-1"></span>
      <span class="sun-cell sun-empty-1"></span>
      <a class="sun-cell"
         href="https://unistra.fr"
         title="Université de Strasbourg">
        <span class="sun-cell-inner">Université de Strasbourg</span>
      </a>
      <span class="sun-cell sun-empty-5"></span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Signature',
  data: () => ({
    icons: {
      content: ['us-wifi', 'us-meeting', 'us-windows'],
      cssClasses: '',
    },
  }),
};
</script>

<style scoped>
@import '../assets/sun.css';
#signature {
  font-size: 1.39em;
}
@media(max-width:600px){
  #signature {
    font-size: 1em;
  }
}
</style>
