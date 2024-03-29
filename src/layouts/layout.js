import Vue from 'vue';

export default {
  name: 'Layout',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  created() {
    if (!Vue.options.components[this.name]) {
      Vue.component(this.name, () => import(/* webpackChunkName: "Layout" */ `@/layouts/${this.name}.vue`));
    }
    this.$parent.$emit('update:layout', this.name);
  },
  render() {
    return this.$slots.default[0];
  },
};
