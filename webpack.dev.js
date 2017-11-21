var webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: {
    app: [
      'webpack/hot/dev-server'
    ]
  },

  devServer: {
    contentBase: './src/browser',
    publicPath: 'http://localhost:8080/build/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
