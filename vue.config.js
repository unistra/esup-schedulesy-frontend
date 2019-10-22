const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/site_media'
    : '',
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
