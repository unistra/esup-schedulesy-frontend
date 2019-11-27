module.exports = {
  all: true,
  // 'check-coverage': true,
  // 'per-file': true,
  // 'skip-full': true,
  include: [
    'src/**/*.{js,vue}',
  ],
  exclude: [
    'src/*.js',
    '**/index.js',
  ],
  extension: [
    '.js',
    '.vue',
  ],
};
