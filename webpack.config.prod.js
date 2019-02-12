const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');

const BUILD_DIR = `${__dirname}/dist`;
const APP_DIR = `${__dirname}/src`;

const prodConfig = {
  mode: 'production',
  entry: ['isomorphic-fetch', `${__dirname}/src/index.js`],
  devtool: 'source-map',
  module: {
    rules: [
        {
            test: /\.js(x)?$/,
            include: [APP_DIR],
            exclude: [path.resolve(`${__dirname}/`, 'node_modules')],
            loader: 'babel-loader',
            options: {
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
            }
          },
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([`${BUILD_DIR}/**/*`], {
      root: path.resolve(`${__dirname}/`)
    }),
    new HtmlWebpackPlugin({
      title: 'ENZA - Image Sorter',
      template: `${APP_DIR}/index.prod.html`,
      hash: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new ResourceHintWebpackPlugin(),

    new CopyWebpackPlugin([
      {
        from: `${APP_DIR}/assets`,
        to: `${BUILD_DIR}/assets`
      }
    ]),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0
    }
  }
};

module.exports = prodConfig;
