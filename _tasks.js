const path = require('path');
const url = require('url');

const fs = require('fs-promise');
const archiver = require('archiver');
const prettyBytes = require('pretty-bytes');
const chalk = require('chalk');
const _ = require('lodash');

const npmPackage = require('./package.json');
const webpackConfig = require('./webpack.config');
const { log } = require('./_utils');

const DIST = webpackConfig.data.THEME_NAME;
const ZIP_FILE = `${DIST}.zip`;

module.exports = { clean, meta, composer, zip };

// ===========================================================================
// Tasks
// ===========================================================================
async function clean() {
  // preserve top level folder
  await fs.emptyDir(DIST);

  try {
    return await fs.unlink(ZIP_FILE);
  }
  catch (e) {
    console.error(e.toString()); // eslint-disable-line no-console
    return false;
  }
}

async function meta(production = false, stats = null, extra = {}, version = npmPackage.version) {
  if (!stats) {
    // use default data
    return await fs.writeJson('src/__meta__.json', require('./_meta.json'));
  }

  const dependencyMap = getDependencyMap(stats.chunks || []);
  const manifest = getManifest(stats.assets || [], dependencyMap);

  // merge json
  const data = _.merge({}, { production, version }, manifest, extra);

  if (stats && webpackConfig.debug) {
    // update default data
    await writeDefaults('./_meta.json', data);
  }

  return await fs.writeJson('src/__meta__.json', data);
}

async function composer() {
  const localVendor = 'vendor';
  const distVendor = path.join(DIST, 'vendor');

  await fs.emptyDir(distVendor);

  return await fs.copy(localVendor, distVendor, { clobber: true });
}

async function zip() {
  // create a stream
  const out = fs.createWriteStream(path.join(__dirname, ZIP_FILE));

  //setup archive instance
  const archive = archiver.create('zip');

  // event, log stats on close
  out.on('close', () => {
    const size = prettyBytes(archive.pointer());
    log(`${chalk.white.bold(size)} written to ${chalk.white.dim(ZIP_FILE)}`);
  });

  // event, handle error
  archive.on('error', (err) => { throw err;});

  // include directory
  archive.directory(DIST);

  // pipe archive data to write stream
  archive.pipe(out);

  // write zip file and close stream
  return await archive.finalize();
}

// ===========================================================================
// Utils
// ===========================================================================
function getDependencyMap(chunks, prefix = `${DIST}.`) {
  // create map from each asset
  return chunks.reduce(addChunkToMap, {});

  function addChunkToMap(chunkMap, chunk) {
    // Guard, uninteresting entry
    if (!chunk.names || !chunk.names.length) {return chunkMap;}

    const parents = chunk.parents.map(id => {
      //lookup parent by id
      const parent = _.find(chunks, { id });

      //use parent name with prefix
      return prefix + getChunkName(parent);
    });

    // add chunk-parent data to map
    return _.merge(chunkMap, { [ getChunkName(chunk) ]: { parents } });
  }
}

function getChunkName(chunk) { return chunk.name || chunk.names[ 0 ];}

function getManifest(assets, dependencyMap, prefix = `${DIST}.`) {
  // create manifest object from each asset
  return assets.reduce(addAssetToManifest, { styles: {}, scripts: {} });

  function addAssetToManifest(data, asset) {
    // split pathname from query string
    const { pathname, query } = url.parse(asset.name);

    // Guard, uninteresting entry
    if (asset.emitted !== true || !asset.chunkNames.length) {return data;}

    const name = getChunkName(asset);

    // discover script - vs - style
    let folder;

    if (pathname.endsWith('.js')) {folder = 'scripts';}

    if (pathname.endsWith('.css')) {folder = 'styles';}

    // guard, not script or style
    if (!folder) {return data;}

    // add chunk to manifest by shortname
    return _.merge(data, {
      [ folder ]: {
        [ name ]: {
          name: prefix + name,
          path: pathname,
          version: query,
          parents: dependencyMap[ name ].parents,
        },
      },
    });
  }
}

/**
 * Create default meta data json for development.
 *
 * @param file
 * @param data
 * @returns {Promise}
 */
async function writeDefaults(file, data) {
  // set version data to null
  const styles = _.mapValues(data.styles, removeVersion);
  const scripts = _.mapValues(data.scripts, removeVersion);

  // create an object, write it to file
  return await fs.writeJson(file, _.merge({}, data, { styles, scripts, production: false }));

  function removeVersion(entry) {
    return _.merge({}, entry, { version: null });
  }
}
