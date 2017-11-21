var webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    path: './src/browser/build',
    filename: 'bundle.js'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
});
