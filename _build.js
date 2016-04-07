/* eslint no-console: 0  */
const webpack = require('webpack');
const config = require('./webpack.config');
const fs = require('fs-promise');
const { task, mapPath } = require('./_utils');
const glob = require('glob');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ProgressBar = require('progress');
const chalk = require('chalk');
const path = require('path');
const bs = require('browser-sync').create();

const { clean, composer, zip } = require('./_tasks');

// ===========================================================================
// CONFIG
// ===========================================================================
const DIST = config.data.THEME_NAME;
const FILE_MAP = config.data.FILE_MAP;
const PROXY_TARGET = config.data.PROXY_TARGET;
const SERVE = process.argv.includes('serve');
const PROFILE = process.argv.includes('profile');

// ===========================================================================
// Run
// ===========================================================================
(async function main() {
  try {
    await task(clean);
    await task(copy);
    await task(composer);
    const stats = await task(bundle);
    await task(zip);

    if (PROFILE) {
      await task(profile, stats);
    }

    if (SERVE) {
      await serve();
    }
  }
  catch (err) {
    console.error(err.stack);
  }
}());

// ===========================================================================
// Tasks
// ===========================================================================

async function copy() {
  const files = await globAsync('src/**/*.!(js|scss)');

  files.forEach(async(file) => {
    const fileDest = mapPath(file, DIST, FILE_MAP);
    await fs.copy(file, fileDest);
  });
}

async function bundle() {
  if (PROFILE) { config.profile = true;}

  const stats = await runWebpack(config);

  // print webpack output
  console.error(stats.toString(config.stats));

  return stats;
}

async function profile(stats) {
  const statsFile = path.join(__dirname, 'stats.json');
  await fs.outputJson(statsFile, stats.toJson());
}

async function serve() {
  bs.init({ proxy: PROXY_TARGET });
}

// ===========================================================================
// Utils
// ===========================================================================

async function globAsync(match, options = {}) {
  return new Promise((resolve, reject) => {
    glob(match, options, cb);
    function cb(error, results) {
      if (error) {return reject(error);}

      return resolve(results);
    }
  });
}

function runWebpack(webpackConfig) {
  // terminal width
  const CONTENT_WIDTH = 11;
  const WIDTH = process.stdout.columns - CONTENT_WIDTH;
  const PERCENT = 100;
  const TEMPLATE = ':message → :bar :elapseds';

  const data = {
    percentage: 0,
    message: '',
  };

  // create a ProgressBar object handle
  const progress = new ProgressBar(TEMPLATE, { // :off
    total: PERCENT,
    complete: chalk.magenta('█'),
    incomplete: chalk.dim.gray('░'),
    clear: true,
  }); // :on

  return new Promise((resolve, reject) => {
    const bundler = webpack(webpackConfig);

    // subscribe to webpack progress
    bundler.apply(new ProgressPlugin(updateProgress));

    // hackery
    // resend last status to update clock.
    const intervalHandle = setInterval(tickStatus, PERCENT);

    // run the build;
    bundler.run((error, stats) => {
      // use progress callback to resolve promise
      progress.callback = () => error ? reject(error) : resolve(stats);

      clearInterval(intervalHandle);

      // complete progress bar
      updateProgress(1, 'Complete');
    });
  });

  /**
   * Set progress bar % complete and message.
   *
   * @param {number} percentage
   * @param {string} message
   * @returns {void}
   */
  function updateProgress(percentage, message) {
    progress.width = WIDTH - message.length;
    data.percentage = percentage;
    data.message = message;
    progress.update(percentage, { message });
  }

  /**
   * Resend last update to keep the clock ticking on large chunks.
   */
  function tickStatus() {
    progress.update(data.percentage, { message: data.message });
  }
}
