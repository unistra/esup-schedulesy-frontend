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
         title="Mon emploi du temps">
        <span class="sun-cell-inner">
          <strong>Mon emploi du temps</strong>
        </span>
      </a>
      <span class="sun-cell sun-empty-9"></span>
      <span class="sun-cell sun-empty-1"></span>
    </span>
    <span class="sun-row">
      <a v-for="(span, index) in organization[0].spans"
         :key="index"
         class="sun-cell"
         :href="organization[0].href"
         :title="organization[0].title">
        <span class="sun-cell-inner" v-html="span"></span>
      </a>
      <span class="sun-cell sun-empty-15"></span>
    </span>
    <span class="sun-row sun-offset-12">
      <span class="sun-cell sun-empty-12"></span>
      <span class="sun-cell sun-empty-1"></span>
      <span class="sun-cell sun-empty-1"></span>
      <a v-for="(span, index) in organization[1].spans"
         :key="index"
         class="sun-cell"
         :href="organization[1].href"
         :title="organization[1].title">
        <span class="sun-cell-inner" v-html="span"></span>
      </a>
      <span class="sun-cell sun-empty-5"></span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Signature',
  props: {
    organization: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    icons: {
      content: ['us-wifi', 'us-meeting', 'us-windows'],
      cssClasses: '',
    },
  }),
};
</script>

<style scoped>
@import '../../assets/sun.css';
#signature {
  font-size: 1.39em;
}
@media(max-width:600px){
  #signature {
    font-size: 1em;
  }
}
</style>
