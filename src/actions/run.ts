import Webpack from "webpack";
import devConfig from "../libs/webpack/webpack.dev";
import WebpackDevServer from "webpack-dev-server";
import buildConfig from "../libs/webpack/webpack.prod";
import { getWebpackConfig } from "../utils/file";
import run from "../libs/webpack/webpack.dev";

type actionNameType = "dev" | "build";

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
    dev: () => run(),
    build: () => {
      runBuild();
    }
  };
  if (Object.keys(actionMap).includes(actionName)) {
    getWebpackConfig();
    actionMap[actionName]();
  } else {
    console.log("error command");
  }
};
