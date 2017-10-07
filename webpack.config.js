var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    app: [
      'webpack/hot/dev-server',
      './javascripts/Dofucks.js'
    ]
  },

  output: {
    path: './public/build',
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/build/'
  },

  devServer: {
    contentBase: './public',
    publicPath: 'http://localhost:8080/build/'
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
  ]
}
