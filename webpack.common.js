var webpack = require('webpack');

var EncodingPlugin = require('webpack-encoding-plugin');

module.exports = {
  entry: {
    app: [
      './src/client/Dofucks.js'
    ]
  },

  resolve: {
    root: [
    ],
    extensions: ['', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'}
    ]
  },

  plugins: [
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$")),
    new EncodingPlugin({encoding: 'utf-8'})
  ]
}
