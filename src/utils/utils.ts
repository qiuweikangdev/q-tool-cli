import { resolve } from "path";

// 获取项目绝对路径
export const getProjectPath = (projectName) =>
  resolve(process.cwd(), projectName);
