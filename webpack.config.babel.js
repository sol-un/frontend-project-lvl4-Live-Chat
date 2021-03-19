// @ts-check
import webpack from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import dotenv from 'dotenv';

dotenv.config();

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  externals: {
    gon: 'gon',
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: path.join(__dirname, 'dist', 'public'),
    publicPath: '/assets/',
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    publicPath: '/assets/',
    compress: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.EnvironmentPlugin(['ROLLBAR_ACCESS_TOKEN']),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
};
