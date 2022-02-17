import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration, WebpackPluginInstance } from "webpack";
import Webpackbar from "webpackbar";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";
import { ModuleOptions } from "webpack";
import { getEntry, getTemplateType } from "../../utils/file";
import { getWebpackConfig } from "../../utils/file";
import { compact } from "lodash";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

async function genPlugins(
  plugins?: WebpackPluginInstance
): Promise<WebpackPluginInstance[]> {
  const config = await getWebpackConfig();
  const { pages } = config;
  return compact([
    new Webpackbar(), // webpack 打包进度条工具
    // 生成 index.html
    new HtmlWebpackPlugin({
      title: "my-app",
      filename: "index.html",
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
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
    }),
    plugins
  ]);
}

const genModule: ModuleOptions = {
  rules: [
    {
      test: /\.(jsx|js)?$/,
      use: "babel-loader",
      exclude: /node_modules/,
      include: path.resolve(process.cwd(), "src")
    },
    {
      test: /\.(tsx|ts)?$/,
      loader: "ts-loader",
      options: {
        happyPackMode: true,
        transpileOnly: true
      },
      include: path.resolve(process.cwd(), "src"),
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    },
    {
      test: /\.less$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: true
          }
        },
        "less-loader"
      ]
    },
    {
      test: /\.(png|svg|jpg|gif|ico)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            esModule: false
          }
        }
      ]
    },
    {
      test: /\.(woff|eot|ttf)\??.*$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 8192
          }
        }
      ]
    }
  ]
};

// 打包内容分析
// buildConfig.plugins.push(new BundleAnalyzerPlugin());

async function webpackCommon(): Promise<Configuration> {
  let plugins = [];
  if (getTemplateType() === "vue") {
    plugins = await genPlugins(new VueLoaderPlugin());
    genModule.rules.unshift({
      test: /.vue$/,
      use: "vue-loader"
    });
  }
  return {
    context: process.cwd(), //  find tsconfig.json
    entry: path.resolve(process.cwd(), "src", getEntry()),
    plugins,
    module: genModule,
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      // 配置别名
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },
    // 缓存
    cache: {
      type: "filesystem" // 使用文件缓存
    },
    optimization: {
      sideEffects: true,
      splitChunks: { chunks: "all" },
      usedExports: true
    }
  };
}
export default webpackCommon;
