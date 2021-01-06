const path = require("path")
const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const __root = path.resolve(__dirname, "../")

module.exports = {
  entry: {
    index: [
      "./src/scripts/index.ts",
      "./src/styles/main.scss",
    ]
  },
  output: {
    path: path.resolve(__root, "dist"),
    filename: "scripts/[name].[chunkhash].js",
    chunkFilename: "scripts/[name].[chunkhash].js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: path.resolve(__root, 'src', 'scripts'),
      },
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        include: path.resolve(__root, 'src', 'scripts'),
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: [
          { loader: "glslify-import-loader" },
          { loader: "raw-loader", options: { esModule: false } },
          { loader: "glslify-loader" },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              path: path.resolve(__root, "dist"),
              name: "styles/[name].css",
            },
          },
          { loader: "extract-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              webpackImporter: false,
              sassOptions: {
                includePaths: ["./node_modules"],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".scss"],
    alias: {
      "@src": path.resolve(__root, "src/"),
      "@core": path.resolve(__root, "src/scripts/_core/")
    },
    plugins: [
      new TsconfigPathsPlugin(),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__root, "static") }],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
}
