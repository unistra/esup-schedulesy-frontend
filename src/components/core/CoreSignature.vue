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
      <a v-for="(span, index) in signature[0].spans"
         :key="index"
         class="sun-cell"
         :href="signature[0].href"
         :title="signature[0].title">
        <span class="sun-cell-inner" v-html="span"></span>
      </a>
      <span class="sun-cell sun-empty-15"></span>
    </span>
    <span class="sun-row sun-offset-12">
      <span class="sun-cell sun-empty-12"></span>
      <span class="sun-cell sun-empty-1"></span>
      <span class="sun-cell sun-empty-1"></span>
      <a v-for="(span, index) in signature[1].spans"
         :key="index"
         class="sun-cell"
         :href="signature[1].href"
         :title="signature[1].title">
        <span class="sun-cell-inner" v-html="span"></span>
      </a>
      <span class="sun-cell sun-empty-5"></span>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Signature',
  props: {
    organization: {
      type: String,
      required: false,
      default: 'UDS',
    },
  },
  data: () => ({
    icons: {
      content: ['us-wifi', 'us-meeting', 'us-windows'],
      cssClasses: '',
    },
  }),
  computed: {
    ...mapGetters({
      getSignature: 'ui/getSignature',
    }),
    signature() {
      return this.getSignature(this.organization)
    },
  },
  mounted() {
    const sunContainers = document.querySelectorAll('.sun');
    sunContainers.forEach((sunContainer) => {
      const links = sunContainer.querySelectorAll('a');
      links.forEach((link) => {
        const dataLink = link.attributes.href.nodeValue;
        if (dataLink !== '#' && !link.classList.contains('sun-isolate')) {
          const { filter } = Array.prototype;
          const linksWithSameHrefValue = filter.call(links, (node) => {
            return node !== link && node.attributes.href.nodeValue === dataLink && !node.classList.contains('sun-isolate');
          });
          link.onmouseover = () => {
            linksWithSameHrefValue.forEach((linkWithSameHrefValue) => {
              linkWithSameHrefValue.classList.add('sun-hover');
            });
          };
          link.onmouseout = () => {
            linksWithSameHrefValue.forEach((linkWithSameHrefValue)=> {
              linkWithSameHrefValue.classList.remove('sun-hover');
            });
          };
        }
      });
    });
  },
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
