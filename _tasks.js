const path = require('path');

const fs = require('fs-promise');
const archiver = require('archiver');
const prettyBytes = require('pretty-bytes');
const chalk = require('chalk');

const webpackConfig = require('./webpack.config');
const { log } = require('./_utils');

const DIST = webpackConfig.data.THEME_NAME;
const ZIP_FILE = `${DIST}.zip`;

module.exports = { clean, composer, zip };

async function clean() {
  // preserve top level folder
  await fs.emptyDir(DIST);

  await fs.unlink(ZIP_FILE);
}

async function composer() {
  const [ localVendor, distVendor ] = [ 'vendor', path.join(DIST, 'vendor') ];

  await fs.emptyDir(distVendor);

  await fs.copy(localVendor, distVendor, { clobber: true });
}

async function zip() {
  const out = fs.createWriteStream(path.join(__dirname, ZIP_FILE));
  const archive = archiver.create('zip');

  out.on('close', () => {
    const size = prettyBytes(archive.pointer());
    log(`${chalk.white.bold(size)} written to ${chalk.white.dim(ZIP_FILE)}`);
  });

  archive.on('error', (err) => { throw err;});
  archive.directory(DIST);
  archive.pipe(out);

  await archive.finalize();
}
