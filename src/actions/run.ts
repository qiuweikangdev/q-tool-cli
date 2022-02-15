import Webpack from "webpack";
import devConfig from "../lib/webpack/webpack.dev";
import WebpackDevServer from "webpack-dev-server";
import buildConfig from "../lib/webpack/webpack.prod";
// import Generator from "../utils/Generator";
// import path from "path";
// import { get } from "lodash";

type actionNameType = "dev" | "build";

async function runDev() {
  //   const generator = new Generator();
  //   generator.generatorToolConfig();
  //   获取q.config配置文件 devParam.devServer配置合并
  //   const toolPath = path.join(process.cwd(), "/q.config.js");
  //   console.log(toolPath, "toolPath");
  //   const toolConfigJSON = await import(toolPath);
  //   console.log(toolConfigJSON, "toolConfigJSON");
  //   const { devParam } = toolConfigJSON;
  const compiler = Webpack(devConfig);
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
}

function runBuild() {
  const compiler = Webpack(buildConfig);
  compiler.run((err, stats) => {
    stats.toJson("minimal");
    if (err) console.log(err);
    if (stats.hasErrors()) {
      console.log(new Error("Build failed with errors."));
    }
    if (stats.hasWarnings()) {
      console.warn(stats.hasWarnings());
    }
  });
}

export default (actionName: actionNameType, options) => {
  const actionMap = {
    dev: () => {
      runDev();
    },
    build: () => {
      runBuild();
    }
  };
  if (Object.keys(actionMap).includes(actionName)) {
    actionMap[actionName]();
  } else {
    console.log("error command");
  }
};
