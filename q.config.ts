module.exports = {
  pages: {
    title: "my-app"
  },
  // 开发环境配置
  devServer: {
    port: "5000"
  },
  // webpack配置
  configureWebpack: (config) => {
    return config;
  }
};
