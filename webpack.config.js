var webpack = require('webpack');
var path = require('path');

var EncodingPlugin = require('webpack-encoding-plugin');

module.exports = {
  entry: {
    app: [
      'webpack/hot/dev-server',
      './src/client/Dofucks.js'
    ]
  },

  output: {
    path: './src/browser/build',
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/build/'
  },

  devServer: {
    contentBase: './src/browser',
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
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$")),
    new EncodingPlugin({encoding: 'utf-8'})
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  )
}
