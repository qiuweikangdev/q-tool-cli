import { find, get, includes, keys } from "lodash";
import path from "path";
import { Configuration } from "../types/configuration";
import { $, fs, globby } from "zx";
import { getProjectPath } from "./utils";
import readline from "readline";

/**
 * 读取指定路径下 json 文件
 * @param filename json 文件的路径
 */
export function readJsonFile(filename: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filename, { encoding: "utf-8" }));
}

/**
 * 验证当前目录下是否已经存在指定文件
 * @param filename 文件名
 */
export async function isFileExist(filename: string): Promise<Boolean> {
  // 文件路径
  const file = getProjectPath(filename);
  return fs.existsSync(file);
}

/**
 * writeFileTree 方法将内存中的字符串模板文件生成在磁盘中
 * @param {string} dir
 * @param {Record<string,string|Buffer>} files
 * @param {Record<string,string|Buffer>} [previousFiles]
 * @param {Set<string>} [include]
    writeFileTree(path.join(process.cwd(), "test"), { "package.json": "name:test" });
 */
export function writeFileTree(dir, files) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    // 确保目录存在，如果目录结构不存在，则创建
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
  });
}

// 参考vue-cli源码
// 获取调用者的文件目录路径
// 获取调用栈信息 ： 通过错误栈来获取路径，并通过正则匹配获取模板的根目录
export function extractCallDir() {
  // 存储当前的堆栈路径，保存到obj中
  const obj: any = {};
  Error.captureStackTrace(obj);
  // 在 generator\xx 等各个模块中 调用 generator.render()
  // 将会排在调用栈中的第四行，也就是 obj.stack.split('\n')[3]
  const callSite = obj.stack.split("\n")[3];
  // 通过打印信息，得到如 callSite：
  // 命名函数：at Object.exports.default (D:\xx\q-tool\xxxx\generator\react\index.js:6:15)
  // 在命名函数内调用时堆栈的正则表达式
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
  // 在匿名内部调用时堆栈的正则表达式
  const anonymousStackRegExp = /at (.*):\d+:\d+$/; // 匹配当前模板路径

  let matchResult = callSite.match(namedStackRegExp);
  if (!matchResult) {
    matchResult = callSite.match(anonymousStackRegExp);
  }
  const fileName = matchResult[1];
  // 获取对应文件的目录
  return path.dirname(fileName);
}

/**
 *
 * @returns 入口文件 优先级index.tsx < main.tsx > index.ts > main.ts
 */
export function getEntry() {
  const file = globby.globbySync(["**/*"], {
    cwd: path.resolve(process.cwd(), "src") // 当前工作目录
  });
  return (
    find(
      file,
      (item) =>
        includes(item, "index.tsx") || // 兼容react
        includes(item, "main.tsx") ||
        includes(item, "index.ts") || // 兼容vue
        includes(item, "main.ts")
    ) || "index.tsx"
  );
}

/**
 *  获取模板文件类型 react/vue
 */
export function getTemplateType() {
  const filePath = path.resolve(process.cwd(), "package.json");
  if (fs.existsSync(filePath)) {
    var pkg = fs.readFileSync(path.resolve(filePath), "utf-8");
    const pkgJSON = JSON.parse(pkg);
    const dependencies = get(pkgJSON, ["dependencies"]);
    if (keys(dependencies).includes("vue")) {
      return "vue";
    }
    return "react";
  }
  return "react";
}

/**  兼容ts/js
 *  读取webpack配置文件信息,q.config.ts/q.config.js
 */
export async function getWebpackConfig(): Promise<Configuration> {
  let config = {};
  try {
    const files = globby.globbySync(["**/q.config.**"], {
      cwd: process.cwd(),
      ignore: ["node_modules"]
    });
    const filePath = find(
      files,
      (item) => item.includes("q.config.ts") || item.includes("q.config.js")
    );
    config = require(getProjectPath(filePath));
  } catch (e) {
    config = require(path.resolve(__dirname, "../../q.config.ts"));
    fs.copySync(
      path.resolve(__dirname, "../../q.config.ts"),
      getProjectPath("q.config.ts")
    );
  } finally {
    return config;
  }
}
