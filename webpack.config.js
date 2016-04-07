/* eslint dot-notation:0, default-case:0  */
/* jscs:disable requireDotNotation*/
require('babel-polyfill');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NPMInstallPlugin = require('npm-install-webpack-plugin');
const path = require('path');

const { logLine, unipath } = require('./_utils');

// ===========================================================================
// CONSTANTS
// ===========================================================================
const THEME_NAME = '_msp';
const PROXY_TARGET = 'local.wordpress.dev';
const HOST = 'localhost';
const PORT = 3000;
const PATHS = {
  src: unipath('src'),
  build: unipath(THEME_NAME),
  modules: unipath('node_modules'),
  base: unipath('.'),
};

const LOADER_INCLUDES = [ PATHS.src() ];

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

// ===========================================================================
// SETUP ENV
// ===========================================================================

const TARGET = process.env.npm_lifecycle_event;
const ENV = getEnv(TARGET);
const DEBUG = !process.argv.includes('release');
const VERBOSE = process.argv.includes('verbose');
const WATCH = global.watch || false;

// ===========================================================================
// NOTIFY
// ===========================================================================

logLine('ENV', ENV);
logLine('DEBUG', DEBUG);
logLine('VERBOSE', VERBOSE);
logLine('WATCH', WATCH);

// ===========================================================================
// CONFIG EXPORT
// ===========================================================================
module.exports = {
  entry: getEntry(ENV),

  output: {
    path: PATHS.build(),
    publicPath: ENV === PRODUCTION ? '/' : `//${HOST}:${PORT}/wp-content/themes/${THEME_NAME}/`,
    filename: 'js/[name].js',
    sourceMapFilename: '[file].map',
    sourcePrefix: '  ',
  },

  module: {
    preLoaders: getPreLoaders(ENV),
    loaders: getLoaders(ENV),
  },

  resolve: {
    extensions: [ '', '.json', '.js' ],
  },

  cache: DEBUG,

  debug: DEBUG,

  devtool: getDevtool(ENV),

  plugins: getPlugins(ENV),

  target: 'web',

  progress: true,

  watch: WATCH,

  noInfo: !VERBOSE,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
    children: VERBOSE,
  },

  data: {
    THEME_NAME,
    FILE_MAP: {
      // '/sass' -> ''
      [ `${path.sep}sass` ]: '',
    },
    PROXY_TARGET,
  },

  postcss(bundler) {
    return [
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('autoprefixer')({ browsers: [ 'last 2 versions' ] }),
    ];
  },
};

// ===========================================================================
// CONFIG ENV DEFINITIONS
// ===========================================================================

function getEntry(env) {
  const entry = {};
  entry.main = [ PATHS.src('sass', 'style.scss') ];

  entry.vendor = Object.keys(require('./package.json').dependencies);
  entry.manifest = [];
  entry.customizer = PATHS.src('js', 'customizer.js');

  switch (env) {
    case DEVELOPMENT:
      entry.main.push(`webpack-hot-middleware/client?http://${HOST}:${PORT}`);
      entry.main.push('webpack/hot/only-dev-server');
      break;

    case PRODUCTION:
      break;
  }
  entry.vendor.push(PATHS.modules('material-design-lite', 'material.js'));
  entry.main.push(PATHS.src('js', 'main.js'));
  entry.main.push(PATHS.src('sass', 'main.scss'));

  return entry;
}

function getPreLoaders(env) {
  const preLoaders = [
    {
      test: /\.js$/, include: LOADER_INCLUDES, loaders: [ 'eslint', 'jscs' ],
    },
  ];

  switch (env) {
    case PRODUCTION:
      break;

    case DEVELOPMENT:
      break;

  }
  return preLoaders;
}

function getDevtool(env) {
  switch (env) {
    case PRODUCTION:
      return 'source-map';

    case DEVELOPMENT:
      return 'inline-source-map';

    default:
      return false;
  }
}

function getLoaders(env) {
  const JS_LOADER = {
    test: /\.js$/,
    include: LOADER_INCLUDES,
    loader: 'babel',
    query: {
      cacheDirectory: true,
    },
  };
  const loaders = [
    JS_LOADER,
    {
      test: /\.json$/,
      include: LOADER_INCLUDES,
      loader: 'json',
    },
    {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      include: LOADER_INCLUDES,
      loader: 'url?limit=10000&mimetype=application/font-woff',
    },
    {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      include: LOADER_INCLUDES,
      loader: 'url?limit=10000&mimetype=application/font-woff',
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      include: LOADER_INCLUDES,
      loader: 'url?limit=10000&mimetype=application/octet-stream',
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      include: LOADER_INCLUDES,
      loader: 'file',
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      include: LOADER_INCLUDES,
      loader: 'url?limit=10000&mimetype=image/svg+xml',
    },
    {
      test: /\.(png|jpg|jpeg|gif)$/,
      include: LOADER_INCLUDES,
      loader: 'url?limit=10000',
    },
    {
      test: /\.(wav|mp3)$/,
      include: LOADER_INCLUDES,
      loader: 'file',
    },
  ];

  switch (env) {
    case PRODUCTION:
      loaders.push({
        test: /\.s?css$/,
        include: LOADER_INCLUDES,
        loader: ExtractTextPlugin.extract((
          ''
          + 'css'
          + '?sourceMap'
          + '&importLoaders=2'
          + '!'
          + 'postcss'
          + '?sourceMap'
          + '!'
          + 'sass'
          + '?sourceMap'
        )),
      });
      break;

    case DEVELOPMENT:
      loaders.push({
        test: /\.s?css$/,
        includes: LOADER_INCLUDES,
        loaders: [
          'style'
          + '?sourceMap',
          'css'
          + '?sourceMap'
          + '&importLoaders=2',
          'postcss'
          + '?sourceMap',
          'sass'
          + '?sourceMap',
        ],
      });
      JS_LOADER.loader = 'babel?cacheDirectory';
      delete JS_LOADER.query;
      break;

  }

  return loaders;
}

function getPlugins(env) {
  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ];
  plugins.push(new ExtractTextPlugin('style.css'));
  switch (env) {
    case PRODUCTION:
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
      }));

      plugins.push(new webpack.optimize.CommonsChunkPlugin({
        names: [ 'vendor', 'manifest' ],
      }));
      plugins.push(new webpack.optimize.DedupePlugin());
      break;

    case DEVELOPMENT:

      plugins.push(new NPMInstallPlugin({ save: true }));
      plugins.push(new webpack.HotModuleReplacementPlugin());
      plugins.push(new webpack.NoErrorsPlugin());
      break;

  }

  return plugins;
}

// ===========================================================================
// UTILS
// ===========================================================================

/**
 * Get env from npm script target.
 *
 * @param {string} target
 * @returns {string}
 */
function getEnv(target) {
  switch (target) {
    case 'start':
      return DEVELOPMENT;

    case 'build':
      return PRODUCTION;

    case 'stats':
      return PRODUCTION;

    default:
      return DEVELOPMENT;
  }
}

