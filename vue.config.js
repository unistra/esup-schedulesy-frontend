const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const prefixer = require('postcss-prefix-selector');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
  transpileDependencies: ['vuetify', 'leaflet', 'vue2-leaflet', 'moment', 'vue-cas-authentication'],
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  filenameHashing: false,
  lintOnSave: false,
  css: {
    extract: process.env.NODE_ENV === 'test'
      ? false
      : { filename: 'css/unistra-schedule.css' },
    loaderOptions: {
      sass: {
        data: '@import "~@/assets/main.scss"',
      },
      postcss: {
        plugins: () => [
          prefixer({
            prefix: '.unistra-schedule',
            transform: (prefix, selector, prefixedSelector) => {
              if (selector.substr(0, 4) === '.row' || selector.substr(0, 4) === '.col') {
                return `${prefixedSelector}`;
              }
              return `${selector}`;
            },
          }),
        ],
      },
    },
  },
  configureWebpack: {
    output: {
      filename: 'js/unistra-schedule.js',
    },
    plugins: [
      new GitRevisionPlugin({
        branch: true,
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(gitRevisionPlugin.version()),
        COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
        BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.NODE_ENV === 'development' ? 'server' : 'disabled',
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: process.env.NODE_ENV === 'test' ? 'async' : 'all',
      },
    },
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'test') {
      const sassRule = config.module.rule('sass');
      sassRule.uses.clear();
      sassRule.use('null-loader').loader('null-loader');
      const scssRule = config.module.rule('scss');
      scssRule.uses.clear();
      scssRule.use('null-loader').loader('null-loader');
    }
    // Allow to mix SASS and SCSS
    // https://vuetifyjs.com/en/customization/sass-variables#single-file-components
    ['vue-modules', 'vue', 'normal-modules', 'normal'].forEach((match) => {
      config.module.rule('scss').oneOf(match).use('sass-loader')
        .tap(opt => Object.assign(opt, { data: '@import "~@/styles/application.scss";' }));
    });
  },
};
