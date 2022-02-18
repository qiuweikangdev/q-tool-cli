import stripAnsi from 'strip-ansi';
import { chalk } from 'zx';

const format = (label, msg) =>
  msg
    .split('\n')
    .map((line, i) =>
      i === 0 ? `${label} ${line}` : line.padStart(stripAnsi(label).length)
    )
    .join('\n');

const chalkTag = (msg) => chalk.bgBlackBright.white.dim(` ${msg} `);

export const log = (msg = '', tag = null) => {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
};

export const info = (msg, tag = null) => {
  console.log(
    format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg)
  );
};

export const warn = (msg, tag = null) => {
  console.warn(
    format(
      chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''),
      chalk.yellow(msg)
    )
  );
};

export const error = (msg, tag = null) => {
  console.error(
    format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg))
  );
  if (msg instanceof Error) {
    console.error(msg.stack);
  }
};

export const success = (msg, tag = null) => {
  console.log(
    format(
      chalk.black(' SUCCESS ') + (tag ? chalkTag(tag) : ''),
      chalk.green(msg)
    )
  );
};

// 清空控制台
// 参考：https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/clearConsole.js
export const clearConsole = () => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
};
