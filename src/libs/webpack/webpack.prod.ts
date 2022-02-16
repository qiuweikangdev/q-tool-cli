import path from "path";
import { Configuration } from "webpack";
import merge from "webpack-merge";
import webpackCommon from "./webpack.common";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const buildConfig: Configuration = merge(webpackCommon, {
  mode: "production",
  devtool: "hidden-source-map",
  output: {
    path: path.resolve("./dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    clean: true
  },
  plugins: []
});

// 打包内容分析
// buildConfig.plugins.push(new BundleAnalyzerPlugin());

export default buildConfig;
