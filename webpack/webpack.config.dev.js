const Path = require('path');
const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin')

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    chunkFilename: 'js/[name].chunk.js',
  },
  devServer: {
    static: {
      directory: 'public',
    },
    compress: true,
    port: 8080,
    watchFiles: ['public/**/*'],
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new StylelintPlugin({
      files: Path.join('src', '**/*.s?(a|c)ss'),
    }),
    new ESLintPlugin({
      cache: true,
      formatter: 'stylish',
      eslintPath: require.resolve('eslint'),
      resolvePluginsRelativeTo: __dirname,
      ignore: true,
      useEslintrc: true,
    })
  ],
  module: {
    rules: [

      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          minimize: false,
        },
      },
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
      },
      {
        test: /\.s?css$/i,
        use: [
          "style-loader",
          "css-loader",
          'sass-loader',
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
});

