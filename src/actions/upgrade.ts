import updateNotifier from 'update-notifier';
import { PKG_INFO } from '../utils/constants';
import { info, log } from '../utils/logger';

// 检查更新
const notifier = updateNotifier({
  // 从 package.json 获取 name 和 version 进行查询
  pkg: PKG_INFO,
  // 设定检查更新周期，默认为 1000 * 60 * 60 * 24（1 天）
  // 这里设定为 1000 毫秒（1秒）
  updateCheckInterval: 1000
});

function upgrade() {
  // 当检测到版本时，notifier.update 会返回 Object
  // 此时可以用 notifier.update.latest 获取最新版本号
  if (notifier.update) {
    info(`新版本可用 => ${notifier.update.latest}`);
    log(`建议你在使用前更新`);
    notifier.notify();
  } else {
    info('当前已是最新版本');
  }
}

export default upgrade;
