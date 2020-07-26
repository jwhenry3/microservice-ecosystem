const path = require('path');
const pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser.js');
const Copy = require('copy-webpack-plugin');

module.exports = {
  entry: './game/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist', 'game'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
    ],
  },
  plugins: [
    new Copy({
      patterns: [
        {
          from: 'game/index.html',
          to: '',
        },
        {
          from: 'game/assets',
          to: 'assets',
        },
      ],
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist', 'game'),
    publicPath: '/dist/game',
    host: '127.0.0.1',
    port: 8080,
    open: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaser,
    },
  },
};
