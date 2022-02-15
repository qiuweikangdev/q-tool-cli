// import { Linter } from lint";
import path from "path";
import { fs } from "zx";

/**
 *  eslint 配置 https://github.com/eslint/eslint/blob/5769cc23eca7197bb5993a0201cc269a056d4dfd/docs/developer-guide/nodejs-api.md
 */
async function createEslintConfig({ rootDir, templateName }) {
  //   const config = {
  //     extends: ["prettier", "plugin:prettier/recommended"],
  //     settings: {
  //       react: {},
  //     },
  //   };
  // 写入.eslintrc.json
  const file = path.join(rootDir, ".eslintrc.json");
  //   const config = get(eslintConfig, `eslint${templateName}`);
  //   console.log(eslintConfig, "eslintConfig");

  console.log(templateName, "templateName");
  const config = {};
  //   console.log(config, "config");

  try {
    //  flag: "wx" 是文件系统标志，w表示打开文件进行写入 x表示如果路径存在则失败
    await fs.writeFile(file, `${JSON.stringify(config, null, 2)}`, {
      flag: "wx"
    });
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "EEXIST") {
      console.error(
        "Error trying to save the Eslint configuration file:",
        `${file} already exists.`
      );
    } else {
      console.error(e);
    }
  }
  return config;
}

export default createEslintConfig;
