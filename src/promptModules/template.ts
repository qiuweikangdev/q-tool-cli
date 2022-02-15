import { PromptModuleType } from "./PromptModuleAPI";

export default (prompt: PromptModuleType) => {
  prompt.injectPrompt({
    name: "template",
    type: "list",
    message: "请选择模板文件",
    choices: ["vue", "react"],
  });
};
