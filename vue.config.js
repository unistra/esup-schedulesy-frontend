const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const prefixer = require('postcss-prefix-selector');

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  filenameHashing: false,
  lintOnSave: false,
  css: {
    extract: {
      filename: 'css/unistra-schedule.css',
    },
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
    ],
  },
};
