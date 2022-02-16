export default {
  pages: {
    title: "my-app"
  },
  // 开发环境配置
  devServer: {
    port: "5000"
  },
  configureWebpack: (config) => {
    // webpack配置
    return config;
  }
};
