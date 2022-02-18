import create from './actions/create';
import { program } from 'commander';
import run from './actions/run';
import { VERSION } from './utils/constants';
import upgrade from './actions/upgrade';

program
  .command('create <projectName>')
  .description('create project')
  .action(create);

program.command('run [config]').description('run webpack config').action(run);

program
  .command('upgrade')
  .description('check q-tool-cli version')
  .action(upgrade);

program.addHelpText(
  'after',
  `
  Example create a project:
    $ q-tool create demo  创建一个项目
    $ q-tool run dev  启动开发环境
    $ q-tool run build  启动生产环境
    $ q-tool upgrade  检查版本
`
);

// 自定义help信息
program.helpInformation = () => ''; //把原来的help信息清空
// 通过on来监听--help参数
program.on('--help', () => {
  console.log('help info');
});

// 实现debug模式
program.on('option:debug', () => {
  // 这里，使用 --debug 没有效果
  if (program.opts().debug) {
    /**
     * loglevel 日志级别
     * 要报告的日志级别，把日志都写入调试日志，如果命令执行失败，则打印该文件的路径
     * verbose：所有消息以 Trace 级别或更工作流追踪记录
     */
    // 6.2.1 中可以用 program.debug 替换
    process.env.LOG_LEVEL = 'verbose';
  }
});

// 版本
program.version(VERSION, '-V, --version');

program.parse(process.argv);
