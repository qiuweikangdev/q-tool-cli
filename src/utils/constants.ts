import path from 'path';
import { readJsonFile } from './file';

export const NAME = readJsonFile(path.resolve(__dirname, '../../package.json'))
  .name as string;

//当前 package.json 的版本号
export const VERSION = readJsonFile(
  path.resolve(__dirname, '../../package.json')
).version as string;

export const PKG_INFO = readJsonFile(
  path.resolve(__dirname, '../../package.json')
);

// 用户的根目录,其中 mac、linux下使用：process.env.HOME、windows下使用:process.env.USERPROFILE
export const USER_HOME = process.env.HOME || process.env.USERPROFILE;
