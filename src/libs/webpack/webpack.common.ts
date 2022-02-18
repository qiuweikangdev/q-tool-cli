import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration, WebpackPluginInstance } from 'webpack';
import Webpackbar from 'webpackbar';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { ModuleOptions } from 'webpack';
import { getEntry, getTemplateType } from '../../utils/file';
import { getWebpackConfig } from '../../utils/file';
import { getProjectPath } from '../../utils/utils';
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

function genPlugins(): WebpackPluginInstance[] {
  const config = getWebpackConfig();
  const { pages } = config;
  return [
    new Webpackbar(), // webpack 打包进度条工具
    // 生成 index.html
    new HtmlWebpackPlugin({
      title: 'my-app',
      filename: 'index.html',
      template: './public/index.html',
      favicon: './public/favicon.ico',
      ...pages
    }),
    // ts类型检查
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true
        }
      }
    })
  ];
}

const genModule: ModuleOptions = {
  rules: [
    {
      test: /\.(jsx|js)?$/,
      use: 'babel-loader',
      exclude: /node_modules/,
      include: path.resolve(process.cwd(), 'src')
    },
    {
      test: /\.(tsx|ts)?$/,
      loader: 'ts-loader',
      options: {
        happyPackMode: true,
        transpileOnly: true
      },
      include: path.resolve(process.cwd(), 'src'),
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.less$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true
          }
        },
        'less-loader'
      ]
    },
    {
      test: /\.(png|jpe?g|gif|svg|ico|eot|ttf|woff|woff2)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'img/[name]_[hash:6][ext]'
      }
    }
  ]
};

// 打包内容分析
// buildConfig.plugins.push(new BundleAnalyzerPlugin());

function webpackCommon(): Configuration {
  let plugins = genPlugins();
  if (getTemplateType() === 'vue') {
    plugins.push(new VueLoaderPlugin());
    genModule.rules.unshift({
      test: /.vue$/,
      use: 'vue-loader'
    });
  }
  return {
    entry: getProjectPath(`src/${getEntry()}`),
    plugins,
    module: genModule,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      // 配置别名
      alias: {
        '@': getProjectPath('src')
      }
    },
    // 缓存
    cache: {
      type: 'filesystem' // 使用文件缓存
    },
    optimization: {
      sideEffects: true,
      splitChunks: { chunks: 'all' },
      usedExports: true
    }
  };
}
export default webpackCommon;
