import { includes, upperFirst } from 'lodash';
import path from 'path';
import { chalk, fs } from 'zx';
import { get, set } from 'lodash';
import inquirer from 'inquirer';
import PromptModuleAPI from '../promptModules/PromptModuleAPI';
import { NAME, VERSION } from './../utils/constants';
import Creator from '../utils/Creator';
import Generator from '../utils/Generator';
import PackageManager from '../utils/PackageManager';
import cliTemplate from 'q-cli-template';
import { getPromptModules } from '../utils/utils';

export default async (projecrName) => {
  const targetDir = path.join(process.cwd(), projecrName);
  // 如果目标目录已存在，删除现有文件并继续
  //   目标目录“my-vue-app”不为空。删除现有文件并继续
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        name: 'overwrite',
        type: 'confirm',
        message: `目标目录 ${chalk.cyan(targetDir)} 不为空,删除现有文件并继续`
      }
    ]);
    if (!overwrite) {
      console.log(chalk.red('✖') + ' 取消操作');
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

  // 弹出交互提示语并获取用户的选择
  const answers = await inquirer.prompt(creator.getPrompts());
  // package.json 文件内容
  const pkg = {
    name: projecrName,
    version: '0.0.0',
    private: true,
    dependencies: {},
    devDependencies: {
      [NAME]: VERSION
    }
  };
  const generator = new Generator(pkg, targetDir, { ...answers, projecrName });
  const pm = new PackageManager({
    targetPath: targetDir,
    pkgTool: answers.pkgTool
  });
  const type = get(answers, 'template');
  for await (const feature of Object.keys(answers)) {
    if (feature === 'template') {
      await get(cliTemplate, `${type}Template`)(generator, answers);
    } else if (feature === 'linter') {
      await get(cliTemplate, `eslint${upperFirst(type)}`)(generator, answers);
    }
  }

  await generator.generate();
  await pm.install();
  // 4）模板使用提示
  console.log(`\r\nSuccessfully created project ${chalk.cyan(projecrName)}`);
  console.log(`\r\n  cd ${chalk.cyan(projecrName)}`);
  console.log(`  ${pm.pkgTool} run dev\r\n`);
};
