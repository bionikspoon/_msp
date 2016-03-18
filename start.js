global.watch = true;

const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const identity = require('lodash').identity;

const bundler = webpack(webpackConfig);

const DIST = webpackConfig.THEME_NAME;


fs.emptyDir(DIST, serveBrowsersync);

function serveBrowsersync(err) {
    if (err) return console.error(err);

    browserSync({
        files: [{
            match: ['src/**/*.@(css|txt|png|php|pot)'],
            fn(event, file) {
                switch (event) {
                    case 'add':
                        fs.copy(file, getDest(file));
                        break;
                    case 'change':
                        fs.copy(file, getDest(file));
                        break;
                    case 'unlink':
                        fs.remove(getDest(file));
                        break;
                    case 'unlinkDir':
                        fs.remove(getDest(file));
                        break;
                }
            },
        }],

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

                function (req, res, next) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    next();
                }

            ],
            ws: true,

        },
    });
}


function getDest(file) {
    const relativeFromDirname = path.relative(__dirname, file);
    const relativeFromSrc = relativeFromDirname.split(path.sep).slice(1).join(path.sep);
    return path.join(DIST, relativeFromSrc);
}

