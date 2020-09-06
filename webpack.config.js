const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const base = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'inline-source-map' : false,
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
  },
};

const tsLoaderConfig = {
  test: /.tsx?$/,
  exclude: /node_modules/,
  use: [
    { loader: 'cache-loader' },
    {
      loader: 'thread-loader',
      options: {
        // there should be 1 cpu for the fork-ts-checker-webpack-plugin
        workers: require('os').cpus().length - 1,
      },
    },
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        happyPackMode: true,
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

const main = {
  ...base,
  target: 'electron-main',
  entry: {
    main: join(__dirname, 'src', 'main'),
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
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
    path: resolve(__dirname, 'dist'),
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
    setting: [
      join(__dirname, 'src', 'renderer', 'setting.ts'),
      join(__dirname, 'src', 'renderer', 'setting.scss'),
    ],
  },
  output: {
    filename: '[name]-[hash].bundle.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      tsLoaderConfig,
      {
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
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: join(__dirname, 'src', 'renderer', 'index.html'),
      chunks: ['index'],
    }),
    new MiniCssExtractPlugin(),
    new ForkTsCheckerWebpackPlugin(forkTsCheckerConfig),
  ],
};

module.exports = [main, preload, renderer];
