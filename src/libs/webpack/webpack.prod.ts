import path from 'path';
import Webpack, { Configuration } from 'webpack';
import merge from 'webpack-merge';
import webpackCommon from './webpack.common';
import { getWebpackConfig } from '../../utils/file';

const buildConfig: Configuration = {
  mode: 'production',
  devtool: 'hidden-source-map',
  output: {
    path: path.resolve('./dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    clean: true
  }
};

function runBuild(options) {
  const config = getWebpackConfig();
  const { configureWebpack } = config;
  const webpackConfig = merge(webpackCommon(), buildConfig);
  const compiler = Webpack(configureWebpack(webpackConfig));
  compiler.run((err, stats) => {
    stats.toJson('minimal');
    if (err) console.log(err);
    if (stats.hasErrors()) {
      console.log(new Error('Build failed with errors.'));
    }
    if (stats.hasWarnings()) {
      console.warn(stats.hasWarnings());
    }
  });
}

export default runBuild;
