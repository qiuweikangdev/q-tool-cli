import { PromptModuleType } from "./PromptModuleAPI";

export default (prompt: PromptModuleType) => {
  prompt.injectPrompt({
    name: "eslintConfig",
    type: "confirm",
    message: "是否生成eslint配置文件?",
    default: true,
  });
};
