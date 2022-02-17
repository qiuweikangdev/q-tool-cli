import run from "../libs/webpack/webpack.dev";
import build from "../libs/webpack/webpack.prod";

type actionNameType = "dev" | "build";

export default (actionName: actionNameType, options) => {
  const actionMap = {
    dev: () => run(options),
    build: () => build(options)
  };
  if (Object.keys(actionMap).includes(actionName)) {
    actionMap[actionName]();
  } else {
    console.log("error command");
  }
};
