// import { Question } from "inquirer";

export type PromptModuleType = {
  creator: any;
  injectPrompt: (feature: Record<string, unknown>) => void;
};

class PromptModuleAPI {
  creator: any;
  constructor(creator) {
    this.creator = creator;
  }

  injectPrompt(prompt) {
    this.creator.injectedPrompts.push(prompt);
  }
}
export default PromptModuleAPI;
