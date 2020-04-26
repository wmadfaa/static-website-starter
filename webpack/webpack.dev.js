const merge = require("webpack-merge");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const common = require("./webpack.common");

module.exports = merge(common('development'), {
  devtool: "inline-cheap-source-map",
  devServer: {
    contentBase: "dist",
  },
  // plugins: [new BundleAnalyzerPlugin()],
});
