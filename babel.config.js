module.exports = {
  presets: [
    '@vue/app',
  ],
  env: {
    test: {
      plugins: ['istanbul', {
        useInlineSourceMaps: false,
        produceSourceMap: true,
        esModules: true,
      }],
    },
  },
};
