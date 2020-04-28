const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const WebpackNotifierPlugin = require('webpack-notifier');
const postcssNormalize = require('postcss-normalize');
const StylelintPlugin = require('stylelint-webpack-plugin');

const PugCompiler = require('./pug-compiler');

const {
  cwd,
  PACKAGE_NAME,
  COPY_TO_BUNDLE,
  CSS_LOADER_OPTIONS,
  DEV_SERVER_CONFIG,
} = require('./template.config');

module.exports = (env) => ({
  mode: env,
  context: path.resolve(cwd, 'src'),
  entry: [path.resolve(cwd, 'src/index.ts'),path.resolve(cwd, 'src/index.scss')],
  devtool: env === 'development' ? 'inline-cheap-source-map' : undefined,
  devServer: env === 'development' ? DEV_SERVER_CONFIG : undefined,
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      src: path.resolve(cwd, 'src'),
      public: path.resolve(cwd, 'public'),
      styles: path.resolve(cwd, 'src/assets/styles'),
      images: path.resolve(cwd, 'src/assets/images'),
      scripts: path.resolve(cwd, 'src/assets/scripts'),
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: env == 'development',
          formatter: require('eslint-friendly-formatter'),
          failOnError: env == 'production',
          failOnWarning: env == 'production',
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.css$/,
        use: [
          env == 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: CSS_LOADER_OPTIONS(env),
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          env == 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: env !== 'production',
            },
          },
          'resolve-url-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
                postcssNormalize(),
              ],
              sourceMap: env !== 'production',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: env !== 'production',
              sassOptions: {
                includePaths: [path.resolve(cwd, './node_modules')]
              }
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 3000,
          name: 'assets/images/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          limit: 5000,
          name: 'assets/fonts/[name].[hash:7].[ext]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(COPY_TO_BUNDLE),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.resolve(cwd, 'tsconfig.json'),
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[hash:7].bundle.css',
      chunkFilename: '[id].css',
    }),
    new StylelintPlugin({
      cache: env == 'development',
      failOnError: env == 'production',
      failOnWarning: env == 'production',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: env == 'development' ? 'server' : 'disabled',
      analyzerPort: 8888,
      openAnalyzer: false,
      generateStatsFile: true,
    }),

    ...PugCompiler(env),

    new WebpackNotifierPlugin({
      title: PACKAGE_NAME,
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: env !== 'production',
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          filename: 'assets/js/vendor.[hash:7].bundle.js',
        },
      },
    },
  },
  output: {
    path: path.resolve(cwd, 'dist'),
    filename: 'assets/js/[name].[hash:7].bundle.js',
  },
});
