require('babel-polyfill');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NPMInstallPlugin = require('npm-install-webpack-plugin');
const chalk = require('chalk');
const _ = require('lodash');

// ===========================================================================
// CONSTANTS
// ===========================================================================
const THEME_NAME = '_msp';
const PATHS = { // :off
    src: unipath('src'),
    build: unipath(THEME_NAME),
    modules: unipath('node_modules'),
    base: unipath('.'),
}; // :on

const LOADER_INCLUDES = [PATHS.src()];

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

// ===========================================================================
// SETUP ENV
// ===========================================================================

const TARGET = process.env.npm_lifecycle_event;
const ENV = getEnv(TARGET);
const DEBUG = !process.argv.includes('release');
const VERBOSE = process.argv.includes('verbose');
const WATCH = global.watch;

// ===========================================================================
// NOTIFY
// ===========================================================================

log('ENV', ENV);
log('DEBUG', DEBUG);
log('VERBOSE', VERBOSE);
log('WATCH', WATCH);


// ===========================================================================
// CONFIG EXPORT
// ===========================================================================
module.exports = {
    THEME_NAME: THEME_NAME,

    entry: getEntry(ENV),

    output: { // :off
        path: PATHS.build(),
        publicPath: ENV === PRODUCTION ? '/' : '//localhost:3000/wp-content/themes/manuphatak.com/',
        filename: 'js/[name].js',
        sourceMapFilename: '[file].map',
        sourcePrefix: '  ',
    }, // :on

    module: {
        preLoaders: getPreLoaders(ENV),
        loaders: getLoaders(ENV),
    },

    resolve: {
        extensions: ['', '.json', '.js'],
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

    postcss(bundler) {
        return [
            require('postcss-import')({addDependencyTo: bundler}),
            require('precss')(),
            require('autoprefixer')({browsers: ['last 2 versions']}),
        ];
    },
};

// ===========================================================================
// CONFIG ENV DEFINITIONS
// ===========================================================================

function getEntry(env) {
    const entry = {};
    entry.main = [
        'babel-polyfill',
        PATHS.src('scss', 'style.scss'),
    ];

    entry['navigation'] = [PATHS.src('js', 'navigation.js')];
    entry['skip-link-focus-fix'] = [PATHS.src('js', 'skip-link-focus-fix.js')];

    switch (env) {
        case DEVELOPMENT:
            entry.main.push('webpack-hot-middleware/client?http://localhost:3000');
            entry.main.push('webpack/hot/only-dev-server');
            break;

        case PRODUCTION:
            break;


    }
    entry.main.push(PATHS.src('js', 'main.js'));
    entry.main.push(PATHS.src('scss', 'main.scss'));

    return entry;
}

function getPreLoaders(env) {
    const preLoaders = [];

    switch (env) {
        case PRODUCTION:
            preLoaders.push({
                test: /\.js$/, include: LOADER_INCLUDES, loaders: ['eslint', 'jscs'],
            });
            break;

        case DEVELOPMENT:
            preLoaders.push({
                test: /\.js$/, include: LOADER_INCLUDES, loaders: ['eslint', 'jscs'],
            });
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
    const JS_LOADER = { // :off
        test: /\.js$/,
        include: LOADER_INCLUDES,
        loader: 'babel',
        query: {
            cacheDirectory: true,
        },
    }; // :on
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
            loaders.push({// :off
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
            });// :on
            break;

        case DEVELOPMENT:
            loaders.push({ // :off
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
            }); // :on
            JS_LOADER.loader = 'babel?cacheDirectory';
            delete JS_LOADER.query;
            break;

    }

    return loaders;
}

function getPlugins(env) {
    const plugins = [ // :off
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env),
        }),
    ]; // :on
    plugins.push(new ExtractTextPlugin('style.css'));
    switch (env) {
        case PRODUCTION:
            plugins.push(new webpack.optimize.UglifyJsPlugin({
                compress: {warnings: false},
            }));

            plugins.push(new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest'],
            }));
            plugins.push(new webpack.optimize.DedupePlugin());
            break;

        case DEVELOPMENT:

            plugins.push(new NPMInstallPlugin({save: true}));
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

/**
 * Log a colorful message to the console.
 *
 * @param {string} description - Name of the variable to log
 * @param {*} data - Variable
 * @returns {void}
 */
function log(description, data) {
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