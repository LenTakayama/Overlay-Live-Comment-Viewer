const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
// electronのfilesに含むもの
const buildDirPath = resolve(__dirname, 'build');
// 画像など
const publicDirPath = resolve(__dirname, 'public');

const base = {
  mode: isDev ? 'development' : 'production',
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: isDev ? 'inline-source-map' : false,
  optimization: {
    minimize: isDev ? false : true,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        parallel: true,
      }),
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
    // splitChunks: {
    //   name: 'vendor',
    //   chunks: 'initial',
    // },
  },
  resolve: {
    extensions: [
      '.json',
      '.js',
      '.jsx',
      'html',
      '.css',
      '.scss',
      '.ts',
      '.tsx',
    ],
    plugins: [new TsconfigPathsPlugin()],
  },
  caches: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
};

const tsLoaderConfig = {
  test: /.tsx?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'thread-loader',
      options: {
        workers: require('os').cpus().length - 1,
      },
    },
    {
      loader: 'babel-loader',
      options: {
        plugins: ['@babel/plugin-proposal-optional-chaining'],
        cacheDirectory: true,
      },
    },
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        happyPackMode: true,
        configFile: isDev ? 'tsconfig.json' : 'tsconfig.production.json',
      },
    },
  ],
};

const forkTsCheckerConfig = {
  eslint: {
    files: './src/**/*.{ts,tsx,js,jsx}',
  },
  typescript: {
    configFile: isDev ? 'tsconfig.json' : 'tsconfig.production.json',
    diagnosticOptions: {
      syntactic: true,
      semantic: true,
      declaration: true,
      global: false,
    },
  },
};

const cssLoaderConfig = {
  test: /\.scss$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: isDev,
        importLoaders: 2,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: isDev,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: isDev,
        sassOptions: {
          fiber: false,
        },
      },
    },
  ],
};

const main = {
  ...base,
  target: 'electron-main',
  entry: {
    main: join(__dirname, 'src', 'main'),
  },
  output: {
    filename: '[name].js',
    path: buildDirPath,
  },
  module: {
    rules: [tsLoaderConfig],
  },
  plugins: [new ForkTsCheckerWebpackPlugin(forkTsCheckerConfig)],
};

const preload = {
  ...base,
  target: 'electron-preload',
  entry: {
    preload: join(__dirname, 'src', 'preload'),
  },
  output: {
    filename: '[name].js',
    path: buildDirPath,
  },
  module: {
    rules: [tsLoaderConfig],
  },
  plugins: [new ForkTsCheckerWebpackPlugin(forkTsCheckerConfig)],
};

const renderer = {
  ...base,
  target: 'web',
  entry: {
    index: [
      join(__dirname, 'src', 'renderer', 'index.ts'),
      join(__dirname, 'src', 'renderer', 'index.scss'),
    ],
    notfound: [
      join(__dirname, 'src', 'renderer', 'notfound.ts'),
      join(__dirname, 'src', 'renderer', 'notfound.scss'),
    ],
    readme: [
      join(__dirname, 'src', 'renderer', 'readme.ts'),
      join(__dirname, 'src', 'renderer', 'readme.scss'),
    ],
  },
  output: {
    filename: '[name]-[hash].bundle.js',
    path: buildDirPath,
  },
  module: {
    rules: [tsLoaderConfig, cssLoaderConfig],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src', 'renderer', 'index.html'),
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src', 'renderer', 'notfound.html'),
      chunks: ['notfound'],
      filename: 'notfound.html',
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src', 'renderer', 'readme.html'),
      chunks: ['readme'],
      filename: 'readme.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].bundle.css',
      chunkFilename: '[id].css',
    }),
    new ForkTsCheckerWebpackPlugin(forkTsCheckerConfig),
  ],
};

const asset = {
  ...base,
  target: 'web',
  entry: {
    comment: join(__dirname, 'src', 'assets', 'comment.scss'),
  },
  output: {
    filename: '[name].bundle.js',
    path: publicDirPath,
  },
  module: {
    rules: [cssLoaderConfig],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: join(__dirname, 'src', 'assets'),
          to: publicDirPath,
          globOptions: {
            ignore: ['**/*.scss'],
          },
        },
      ],
    }),
    new FixStyleOnlyEntriesPlugin(),
  ],
};

module.exports = [main, preload, renderer, asset];
