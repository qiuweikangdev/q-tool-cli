import { resolve } from 'path';
import { getWebpackConfig } from '../../utils/file';
import Webpack, { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import merge from 'webpack-merge';
import webpackCommon from './webpack.common';

const devConfig: Configuration = {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: resolve('./dist')
  }
};

function runDev(options) {
  const config = getWebpackConfig();
  const commonConfig = webpackCommon();
  const webpackConfig = merge(commonConfig, devConfig);
  const { devServer: devParam = {}, configureWebpack } = config;
  const devServerConfig = {
    hot: true,
    open: true,
    host: 'localhost',
    port: 5000,
    ...devParam
  };
  const compiler = Webpack(configureWebpack(webpackConfig));
  const devServer = new WebpackDevServer(devServerConfig, compiler);
  devServer.startCallback(() => {
    console.log('启动中...');
  });
}

export default runDev;
