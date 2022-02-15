// 统一管理Prompts
class Creator {
  injectedPrompts: any[];
  constructor() {
    this.injectedPrompts = []; // 存放所有的prompt
  }
  getPrompts() {
    return this.injectedPrompts;
  }
}
export default Creator;
