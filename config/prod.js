const { merge } = require("webpack-merge")
const common = require("./common.js")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
    })
  ],
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
})
