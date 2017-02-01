'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const build = /:production$/.test(process.env.NODE_ENV)
const target = process.env.NODE_ENV.match(/^(\w+):/)[1]

const plugins = []

const cssloaders = [
  'css-loader?importLoaders=1',
  'postcss-loader'
]

let cssloader
// standalone library containing styles for mobile
if (target === 'mobile') {
  cssloaders = cssloaders.join('!')
} else {
  plugins.push(new ExtractTextPlugin('cozy-bar.css'))
  cssloaders = ExtractTextPlugin.extract(
    'style-loader', cssloaders.slice(1).join('!')
  )
}

const base = {
  entry: path.resolve(__dirname, 'src/'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `cozy-bar.${target}.js`,
    library: 'cozy-bar',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.html', '.svelte', '.json', '.yaml', '.css']
  },
  devtool: '#cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.(svelte|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(svelte)$/,
        exclude: /node_modules/,
        loader: 'svelte-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.yaml$/,
        loaders: ['json-loader', 'yaml-loader']
      },
      {
        test: /\.(css)$/,
        loader: cssloader
      },
      {
        test: /\.svg$/,
        include: /icons/,
        loader: 'url-loader'
      },
    ]
  },
  plugins: plugins
}

if (build) {
  module.exports = merge(base, {
    output: {
      filename: `cozy-bar.${target}.min.js`,
    },
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.DefinePlugin({
        __SERVER__: false,
        __DEVELOPMENT__: false,
        __DEVTOOLS__: false
      })
    ]
  })
} else {
  module.exports = base
}
