// import {
//   downloadTemplate,
//   generateEslint,
//   initProjectDir,
//   isFileExist,
// } from "../utils/file1";
// import { USER_HOME } from "../utils/constants";
import path from "path";
import { chalk, fs } from "zx";
import { get } from "lodash";
import inquirer from "inquirer";
import PromptModuleAPI from "../promptModules/PromptModuleAPI";
// import Linter from "../promptModules/linter";
import Creator from "../utils/Creator";
import Generator from "../utils/Generator";
import PackageManager from "../utils/PackageManager";

export default async (projecrName) => {
  const targetDir = path.join(process.cwd(), projecrName);
  // 如果目标目录已存在，删除现有文件并继续
  //   目标目录“my-vue-app”不为空。删除现有文件并继续
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        name: "overwrite",
        type: "confirm",
        message: `目标目录 ${chalk.cyan(targetDir)} 不为空,删除现有文件并继续`,
      },
    ]);
    if (!overwrite) {
      console.log(chalk.red("✖") + " 取消操作");
      return;
    }
    // 如果覆盖则删除目录
    console.log(`\n删除中 ${chalk.cyan(targetDir)}...`);
    await fs.remove(targetDir);
  }

  // 各个模块的交互提示语
  // 获取各个模块的交互提示语
  const creator = new Creator();
  const promptModules = await getPromptModules();
  const promptAPI = new PromptModuleAPI(creator);

  for await (const module of promptModules) {
    module(promptAPI);
  }

  // 清空控制台
  // clearConsole();
  // 弹出交互提示语并获取用户的选择
  const answers = await inquirer.prompt(creator.getPrompts());
  //   const { eslintConfig, template } = answers;
  // package.json 文件内容
  const pkg = {
    name: projecrName,
    version: "0.0.0",
    private: true,
    dependencies: {},
    devDependencies: {},
  };
  const generator = new Generator(pkg, targetDir, { ...answers, projecrName });
  const pm = new PackageManager({
    targetPath: targetDir,
    pkgTool: answers.pkgTool,
  });

  for await (const feature of Object.keys(answers)) {
    if (feature === "template") {
      const type = get(answers, "template");
      const cliTemplate = await import("q-cli-template");
      await get(cliTemplate, ["default", `${type}Template`])(
        generator,
        answers
      );
    }
  }
  await generator.generate();
  await pm.install();
  // 4）模板使用提示
  console.log(`\r\nSuccessfully created project ${chalk.cyan(projecrName)}`);
  console.log(`\r\n  cd ${chalk.cyan(projecrName)}`);
  console.log(`  ${pm.pkgTool} run dev\r\n`);
};

// 1、下载模板 【定义一个缓存的存储路径，第一次下载的时候，下载到缓存路径中】
// 2、更新模板 【如果缓存路径模板存在，则更新模板，即更新package.json信息以及对应模板文件的内容信息 】
// 3、安装模板 【把缓存的存储路径的模板拷贝到当前目录下】

// 获取所有的Prompt
async function getPromptModules() {
  // 可进行扩展 ['babel'、'linter']
  const modules = await ["template", "pkgTool"].map(async (file) => {
    const { default: module } = await import(`../promptModules/${file}`);
    return module;
  });
  return modules;
}
