/* eslint-env node */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  resolve: {
    modules: [
      path.resolve(__dirname, 'assets/scripts'),
      path.resolve(__dirname, 'assets'),
      'node_modules',
    ],
    extensions: ['.js'],
  },
  entry: {
    common: path.resolve(__dirname, 'assets/scripts/common.js'),
  },
  output: {
    path: path.resolve(__dirname, 'static/dist'),
    publicPath: '/static/dist/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')(),
                require('cssnano')(),
              ],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(svg|png|jpe?g|gif|webp|woff|woff2|eot|ttf|otf)$/,
        exclude: path.resolve('./assets/icons'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: path.resolve('./assets/icons'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'icons.svg',
              esModule: false,
            },
          },
          'svgo-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new SpriteLoaderPlugin(),
  ],
  devServer: {
    proxy: {
      '**': {
        target: process.env.BACKEND_URL || "http://backend:8000",
      },
    },
    allowedHosts: (process.env.ALLOWED_HOSTS || "localhost").split(/\s+/),
    host: '0.0.0.0',
    port: 3000,
    compress: true,
    // Polling is required inside Vagrant boxes
    watchOptions: {
      poll: true,
    },
    overlay: true,
    // Here you can specify folders that contain your views
    // So they’ll trigger a page reload when you change them
    // contentBase: ['./app/views'],
    // watchContentBase: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};
