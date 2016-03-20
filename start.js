/* eslint default-case:0, no-console: 0  */
global.watch = true;

const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');
const path = require('path');
const fs = require('fs-extra');

const DIST = webpackConfig.THEME_NAME;
const INIT = {
  completed: false,
  delay: 5000,
};
const bundler = webpack(webpackConfig);
const bs = browserSync.create();

// clean DIST directory
fs.emptyDir(DIST, serveBrowsersync);

/**
 * Start BrowserSync.
 * @param err
 * @returns {*}
 */
function serveBrowsersync(err) {
  if (err) return console.error(err);

  // Start server. Delay callback.
  return bs.init(getOptions(), () => setTimeout(cbSetInit, INIT.delay));

  // Init is complete.
  function cbSetInit() {INIT.completed = true;}
}

/**
 * Get browser-sync options.
 * @returns {{files: *[], open: boolean, proxy: {target: string, middleware: *[], ws: boolean}}}
 */
function getOptions() {
  return {
    files: [
      {
        match: [ 'src/**/*.@(css|txt|png|php|pot|twig)' ],
        fn: handleFileCopyRemoveReload,
      },
    ],

    open: false,

    proxy: {
      target: 'local.wordpress.dev',
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: webpackConfig.output.publicPath,
          stats: webpackConfig.stats,
          noInfo: webpackConfig.noInfo,
        }),
        webpackHotMiddleware(bundler),
      ],
      ws: true,

    },
  };
}

/**
 * Watch non-webpack files, sync with DIST, reload server.
 *
 * @param event
 * @param file
 */
function handleFileCopyRemoveReload(event, file) {
  const srcFile = path.resolve(file);
  const destFile = path.resolve(getDest(srcFile));

  switch (event) {
    case 'add':
      fs.copy(srcFile, destFile, cbReloadBrowser);
      break;
    case 'change':
      fs.copy(srcFile, destFile, cbReloadBrowser);
      break;
    case 'unlink':
      fs.remove(destFile, cbReloadBrowser);
      break;
    case 'unlinkDir':
      fs.remove(destFile, cbReloadBrowser);
      break;
  }

  // Reload browser.
  function cbReloadBrowser(err) {
    if (err) return console.error(err);

    // Guard, only reload after initial copy, only if php files.
    if (!INIT.completed || !srcFile.match(/\.(?:php|twig)$/)) return undefined;

    return bs.reload();
  }
}

/**
 * Preserve file structure from src to DIST.
 * @param file
 * @returns {*}
 */
function getDest(file) {
  const relativeFromDirname = path.relative(__dirname, file);
  const relativeFromSrc = relativeFromDirname.split(path.sep).slice(1).join(path.sep);
  return path.join(DIST, relativeFromSrc);
}
