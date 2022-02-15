import { PromptModuleType } from "./PromptModuleAPI";

export default (prompt: PromptModuleType) => {
  prompt.injectPrompt({
    name: "pkgTool",
    type: "list",
    message: "请选择包管理工具",
    choices: ["yarn", "npm"]
  });
};
