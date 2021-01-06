const { merge } = require("webpack-merge")
const common = require("./common.js")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new ESLintPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
    })
  ],
})
