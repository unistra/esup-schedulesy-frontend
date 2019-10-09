export default {
  name: 'CoreHeading',
  props: {
    level: {
      type: [String, Number],
      required: true,
    },
  },
  render(createElement) {
    return createElement(
      `h${this.level}`, // tag name
      this.$slots.default, // array of children
    );
  },
};
