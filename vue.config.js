const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
  transpileDependencies: ['vuetify', 'vue-cas-authentication'],
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  filenameHashing: false,
  lintOnSave: false,
  css: {
    extract: process.env.NODE_ENV === 'test'
      ? false
      : { filename: 'css/unistra-schedule.css', ignoreOrder: true },
    loaderOptions: {
      sass: {
        data: '@import "~@/assets/main.scss"',
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
    if (process.env.NODE_ENV === 'production') {
      config.plugin('html').tap((opts) => {
        opts[0].template = './prod/index.html';
        opts[0].filename = './base.html';
        return opts;
      });
    }
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
