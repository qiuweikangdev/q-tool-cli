import { resolve } from "path";
import { getWebpackConfig } from "../../utils/file";
import Webpack, { Configuration } from "webpack";
import WebpackDevServer from "webpack-dev-server";
import merge from "webpack-merge";
import webpackCommon from "./webpack.common";

const devConfig: Configuration = {
  mode: "development",
  output: {
    filename: "[name].bundle.js",
    path: resolve("./dist")
  }
};

const webpackConfig = merge(webpackCommon, devConfig);

const run = () => {
  const configureWebpack = getWebpackConfig();
  const compiler = Webpack(webpackConfig);
  const devServerConfig = {
    // static: path.resolve(process.cwd(), "/public"),
    hot: true,
    open: true,
    host: "localhost",
    port: 8000
    // ...get(devParam, "devServer", {}),
  };
  const devServer = new WebpackDevServer(devServerConfig, compiler);
  devServer.startCallback(() => {
    console.log("启动中...");
  });
};

export default run;
