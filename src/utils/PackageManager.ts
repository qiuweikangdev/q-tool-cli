import { $, cd } from "zx";
import { error, log } from "./logger";
$.verbose = false;
/**
 * 包管理
 */
class PackageManager {
  targetPath: any;
  storePath: any;
  pkgTool: any;
  constructor(options) {
    this.targetPath = options.targetPath; // 目标路径
    this.pkgTool = options.pkgTool || "npm"; // 包管理工具 npm/yarn
  }

  async install() {
    log("\n正在安装依赖...\n");
    try {
      await cd(this.targetPath);
      $.verbose = true; // 显示安装依赖的进度信息
      await $`${this.pkgTool} install --registry=https://registry.npm.taobao.org`;
    } catch (e) {
      error(`安装失败，退出码 ${e.exitCode}`);
    }
  }
}

export default PackageManager;
