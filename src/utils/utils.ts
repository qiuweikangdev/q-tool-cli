import { resolve } from 'path';

// 获取项目绝对路径
export const getProjectPath = (projectName) =>
  resolve(process.cwd(), projectName);

// 获取所有的Prompt
export async function getPromptModules() {
  // 可进行扩展 ['babel'、'linter']
  const modules = await ['template', 'linter', 'pkgTool'].map(async (file) => {
    const { default: module } = await import(`../promptModules/${file}`);
    return module;
  });
  return modules;
}
