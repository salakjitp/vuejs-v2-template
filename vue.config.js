const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pages: {
    index: {
      // entry for the page
      entry: "src/main.js",
      // the source template
      template: "public/index.html",
      // output as dist/index.html
      filename: "index.html",
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: "ระบบ",
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },
  configureWebpack: {
    output: {
      filename: "[name].[hash].js",
      chunkFilename: "[name].[hash].js",
    },
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
        "@": path.resolve("src"),
        src: path.resolve("src"),
        assets: path.resolve("src/assets"),
        components: path.resolve("src/components"),
        services: path.resolve("src/services"),
      },
    },
  }, 
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/main.scss";`
      }
    }
  }
});
