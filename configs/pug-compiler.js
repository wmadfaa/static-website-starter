const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const defaultOptions = {
  watchDir: "src",
  cwd: process.cwd(),
  moveIndexToRoot: true,
};

function PugCompiler(env, options = {}) {
  const { watchDir, cwd, moveIndexToRoot } = { ...defaultOptions, ...options };

  const rootFolder = path.resolve(cwd, watchDir);
  const pattern = `${rootFolder}/**/**.pug`;
  const files = glob.sync(pattern, { mark: true });

  let hasIndex = false;
  const pages = [];

  files.forEach((file) => {
    const relative_file_path = file.replace(`${rootFolder}/`, "");
    let filename = relative_file_path.replace(/pug$/, "html");
    if (
      moveIndexToRoot &&
      !hasIndex &&
      path.parse(relative_file_path).name == "index"
    ) {
      filename = "index.html";
    }
    const options = {
      filename: filename,
      template: relative_file_path,
      inject: true,
    };
    if (env == "production") {
      options = {
        ...options,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        },
      };
    }
    pages.push(new HtmlWebpackPlugin(options));
  });

  return pages;
}

module.exports = PugCompiler;
