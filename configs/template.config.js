const path = require("path");
const fs = require("fs");

const cwd = process.cwd();

const PACKAGE_NAME = JSON.parse(
  fs.readFileSync(path.resolve(cwd, "package.json"))
).name;

const COPY_TO_BUNDLE = [
  {
    from: path.resolve(cwd, "public"),
    to: "public",
  },
];

const CSS_LOADER_OPTIONS = (env) => ({
  importLoaders: 1,
  sourceMap: env !== "production",
  minimize: true,
  colormin: false,
});

const DEV_SERVER_CONFIG = {
  contentBase: "dist",
};

module.exports = {
  cwd,
  PACKAGE_NAME,
  COPY_TO_BUNDLE,
  CSS_LOADER_OPTIONS,
  DEV_SERVER_CONFIG,
};
