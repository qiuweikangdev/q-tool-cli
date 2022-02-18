import { isObject } from 'lodash';
import path from 'path';
import { fs, globby } from 'zx';
import { extractCallDir, writeFileTree } from './file';
import ejs from 'ejs';

export type GeneratorType = {
  render: (v: any) => void;
  extendPackage: (v: any) => void;
};

class Generator {
  files: any;
  pkg: any;
  context: any;
  options: any;
  constructor(pkg, context, options, files = {}) {
    this.pkg = pkg;
    this.context = context;
    this.options = options;
    this.files = {};
  }

  // 扩展package.json, 生成对应的dependencies、devDependencies、script等
  extendPackage(fields) {
    const pkg = this.pkg;
    for (const key in fields) {
      const value = fields[key];
      const existing = pkg[key];
      if (
        isObject(value) &&
        (key === 'dependencies' ||
          key === 'devDependencies' ||
          key === 'scripts')
      ) {
        pkg[key] = Object.assign(existing || {}, value);
      } else {
        pkg[key] = value;
      }
    }
  }

  // 合并选项
  _resolveData(additionalData) {
    return {
      options: this.options,
      ...additionalData
    };
  }

  /**
   * 将模板文件渲染
   */
  async render(source, additionalData = {}, ejsOptions = {}) {
    const baseDir = extractCallDir(); // 获取调用者的文件目录路径
    source = path.resolve(baseDir, source);
    const _files = await globby(['**/*'], {
      cwd: source, // 当前工作目录
      dot: true // 允许匹配以.开头的
    });
    const data = this._resolveData(additionalData);
    for (const rawPath of _files) {
      const sourcePath = path.resolve(source, rawPath);
      // 解析文件内容
      const content = await this.renderFile(sourcePath, data, ejsOptions);
      Object.assign(this.files, { [rawPath]: content });
    }
  }

  // 利用 ejs 渲染模板文件,解析文件内容
  async renderFile(name, data, ejsOptions) {
    const template = fs.readFileSync(name, 'utf-8');
    const yamlFront = await import('yaml-front-matter');
    // 解析为 YAML 文档
    const parsed = yamlFront.loadFront(template);
    const content = parsed.__content;
    let finalTemplate = content.trim() + `\n`;
    // 返回渲染结果的字符串
    return ejs.render(finalTemplate, data, ejsOptions);
  }

  // 写入文件，将模板文件、package.json、eslint等配置文件写入
  generate() {
    this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n';
    // 将所有文件写入到用户要创建的目录
    writeFileTree(this.context, this.files);
  }
}

export default Generator;
