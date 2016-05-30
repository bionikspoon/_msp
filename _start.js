/* eslint default-case:0, no-console: 0  */

// ===========================================================================
// ENV
// ===========================================================================
global.watch = true;
process.env.TWIG_CACHE_TIMEOUT = 0;

const fs = require('fs-promise');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');
const htmlInjector = require('bs-html-injector');
const chalk = require('chalk');
const { task, log, timeout, mapPath } = require('./_utils');
const { clean, composer, meta } = require('./_tasks');
const bundler = webpack(webpackConfig);

// ===========================================================================
// CONFIG
// ===========================================================================

const INIT_DELAY = 5000;

const DIST = webpackConfig.data.THEME_NAME;
const FILE_MAP = webpackConfig.data.FILE_MAP;
const PROXY_TARGET = webpackConfig.data.PROXY_TARGET;

const bsOptions = {
  files: [
    {
      // scss/js handled by webpack
      match: [ 'src/**/*.json', 'src/**/*.!(scss|js)' ],

      // copy from SRC to DIST, inject html diff
      fn: synchronize(DIST),
    },
    {
      match: [ 'vendor/autoload.php' ],
      async fn() {
        if (!injector.activated) {return;}

        await composer();
      },
    },
  ],

  // open browser
  open: false,

  proxy: {
    // VVV host proxy
    target: PROXY_TARGET,
    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        stats: webpackConfig.stats,
        noInfo: webpackConfig.noInfo,
      }),

      // HMR for styles and scripts
      webpackHotMiddleware(bundler),
    ],

    // not sure if this required.  the middleware WS might by automatic
    ws: true,
  },
};

// ===========================================================================
// Run
// ===========================================================================

(async function main() {
  const bs = await task(setup);
  await task(clean);
  await task(composer);
  await task(meta, false);
  await task(up, bs);
}());

// ===========================================================================
// Tasks
// ===========================================================================

async function setup() {
  // create BS instance
  const _bs = browserSync.create();

  // promisify bs.init method
  _bs.initAsync = function initAsync(config) { // eslint-disable-line no-param-reassign
    return new Promise((resolve, reject) => {
      try {
        this.init(config, resolve);
      }
      catch (e) {
        reject(e);
      }
    });
  };

  // connect html injector
  _bs.use(htmlInjector);

  return _bs;
}

async function up(_bs) {
  // start server and file watchers
  await _bs.initAsync(bsOptions);

  // activate htmlInjector
  await injector.activate(INIT_DELAY);

  // notify
  log(chalk.white.bold.bgBlue('HTML injection initiated'));
}

// ===========================================================================
// Utils
// ===========================================================================

function synchronize(dist) {
  return async function wrapper(event, srcFile) {
    // keep file structure
    const destFile = mapPath(srcFile, dist, FILE_MAP);

    // add remove files
    try {
      switch (event) {
        case 'add':
          await fs.copy(srcFile, destFile);
          break;
        case 'change':
          await fs.copy(srcFile, destFile);
          break;
        case 'unlink':
          await fs.remove(destFile);
          break;
        case 'unlinkDir':
          await fs.remove(destFile);
          break;
      }

      // JS/CSS injected via HMR, PHP updates injected here
      if (srcFile.match(/\.(?:php|twig)$/)) {
        // state machine, skips injection first few seconds
        injector(destFile);
      }
    }
    catch (e) {
      console.error(e);
    }
  };
}

function injector() {
  return injector.call();
}

injector.call = function noop() {};

injector.active = function inject(file) {
  log(chalk.dim('Injecting html: ') + file);
};

injector.activated = false;

injector.activate = async function activate(delay = INIT_DELAY, func = htmlInjector) {
  await timeout(delay);
  injector.call = func;
  injector.activated = true;
};
