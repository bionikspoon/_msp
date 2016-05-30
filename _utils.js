/* eslint dot-notation:0, default-case:0, prefer-rest-params:0, no-console: 0  */
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');

module.exports = { mapPath, timeout, task, log, logLine, unipath };

function mapPath(src, dist, fileMap = {}) {
  // replace fileMap KEYs with VALUES
  const srcFile = Object.keys(fileMap).reduce(substitutePath(fileMap), src);

  // get relative path
  const relativeFromDirname = path.relative(__dirname, srcFile);

  // drop root directory (src)
  const relativeFromSrc = relativeFromDirname.split(path.sep).slice(1).join(path.sep);

  // join the result with dist directory
  return path.join(dist, relativeFromSrc);

  //reducer, traverse fileMap object replacing strings
  function substitutePath(_fileMap) {
    return (filePath, search) => {
      const replace = _fileMap[search];
      return filePath.replace(search, replace);
    };
  }
}

function timeout(delay) {
  // promisify setTimeout
  return new Promise(resolve => {setTimeout(resolve, delay);});
}

async function task(func, ...args) {
  const name = chalk.green.bold(func.name);

  // capture start time
  const start = new Date();

  // notify
  log(`Starting ${name}...`, start);

  // run wrapped function
  const results = await func(...args);

  // capture end time
  const end = new Date();

  // elapsed time
  const diff = end.getTime() - start.getTime();

  //notify
  log(`Finished ${name} after ${formatElapsed(diff)}`, end);

  return results;

  function formatElapsed(time) {
    return chalk.white.bold(`${time}ms`);
  }
}

function log(message, time = new Date()) {
  const localeTime = time.toLocaleTimeString();
  const formattedTime = chalk.dim(`[${localeTime}]`);
  return console.error(`${formattedTime} ${message}`);
}

/**
 * Log a colorful message to the console.
 *
 * @param {string} description - Name of the variable to log
 * @param {*} data - Variable
 * @returns {void}
 */
function logLine(description, data) {
  const message = _.padEnd(` ${_.padEnd(`${description}:`, 8)} ${data} `, process.stdout.columns);
  console.error(chalk.bold.white.bgBlue(message));
}

/**
 * Create a path -> resolve -> join partial.
 *
 * @param {string} base - Base path
 * @returns {Function}
 */
function unipath(base) {
  return join;

  /**
   * Get fully resolved path from arguments.
   *
   * @param {...string} paths - Paths to join
   * @returns {*|{extensions}|{filePath}|{filePath, configName}}
   */
  function join(paths/* ...paths */) { // eslint-disable-line no-unused-vars
    const _paths = [base].concat(Array.from(arguments));
    return path.resolve(path.join.apply(null, _paths));
  }
}
