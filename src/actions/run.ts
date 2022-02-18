import runDev from '../libs/webpack/webpack.dev';
import runBuild from '../libs/webpack/webpack.prod';

type actionNameType = 'dev' | 'build';

export default (actionName: actionNameType, options) => {
  const actionMap = {
    dev: () => runDev(options),
    build: () => runBuild(options)
  };
  if (Object.keys(actionMap).includes(actionName)) {
    actionMap[actionName]();
  } else {
    console.log('error command');
  }
};
