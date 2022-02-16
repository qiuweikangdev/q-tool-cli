import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration as WebpackConfig } from "webpack";
export type Configuration = {
  /**
   *  生成HTML页面配置：https://webpack.js.org/plugins/html-webpack-plugin/
   */
  pages?: HtmlWebpackPlugin.Options;
  /**
   *  开发环境配置： https://webpack.js.org/configuration/dev-server/
   */
  devServer?: {};
  /**
   *  如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
   */
  configureWebpack?: (config: WebpackConfig) => WebpackConfig;
};
