import url from 'url';
import path from 'path';

const isProduction = (process.env.NODE_ENV === "production") || false;

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';

const smp = new SpeedMeasurePlugin();

const ASSET_MIN_SIZE_IN_BYTES = 102400;
const ASSET_MAX_SIZE_IN_BYTES = 768000;

const minPaths = {}
const publicPath = url.resolve(`./`, `/`);

const sourceMapDevToolOptions = {
    "filename": "[file].map[query]",
    "moduleFilenameTemplate": "[resource-path]",
    "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
    "sourceRoot": "webpack:///",
    "publicPath": publicPath,
}

export default smp.wrap({
    "mode": process.env.NODE_ENV || "development",
    "target": 'web',
    "resolve": {
        "extensions": [".tsx", ".ts", ".js", ".wasm"],
        "modules": [
            "./node_modules"
        ],
        "symlinks": true,
        "alias": { ...minPaths },
        "mainFields": [
            "browser",
            "module",
            "main"
        ],
        "fallback": {
            // "url": require.resolve('url/'),
            // "querystring": require.resolve('querystring/'),
            // "process": require.resolve('process/'),
            "fs": false,
            "path": false,
            "crypto": false,
            "tls": false,
            "net": false,
            "module": false,
            "clearImmediate": false,
            "setImmediate": false,
        },
    },
    "resolveLoader": {
        "modules": ["./node_modules"],
        "alias": { ...minPaths },
    },
    "entry": ["./src/index.ts"], // "@babel/polyfill",
    "output": {
        "path": path.resolve(process.cwd(), './dist'),
        "publicPath": publicPath,
        "filename": "[id].js",
        "chunkFilename": "[id].c.js",
        // "sourceMapFilename": "[file].map[query]",
        "crossOriginLoading": "anonymous",
        "pathinfo": false,
        // "globalObject": "global"
    },
    ...isProduction ? {
        "performance": {
            hints: false,
            maxEntrypointSize: ASSET_MAX_SIZE_IN_BYTES,
            maxAssetSize: ASSET_MAX_SIZE_IN_BYTES,
        },
    } : {},
    "optimization": {
        minimize: isProduction,
        // minimizer: [
        //     new TerserPlugin({
        //         parallel: true,
        //         test: /\.js(\?.*)?$/i,
        //     }),
        // ],
        // usedExports: true,
        // removeAvailableModules: false,
        // removeEmptyChunks: false,
        // namedModules: true,
        // namedChunks: true,
        // chunkIds: 'natural',
        // moduleIds: 'named',
        // splitChunks: {
        //     minSize: ASSET_MIN_SIZE_IN_BYTES,
        //     maxSize: ASSET_MAX_SIZE_IN_BYTES,
        //     // chunks: 'async',
        //     minChunks: 1,
        //     maxAsyncRequests: 30,
        //     maxInitialRequests: 30,
        //     automaticNameDelimiter: '~',
        //     // enforceSizeThreshold: 50000,
        //     cacheGroups: {
        //         common: {
        //             name: 'common',
        //             chunks: 'all',
        //             test: /[\\/]node_modules[\\/]/,
        //             priority: -10,
        //         },
        //         default: false,
        //     },
        // },
    },
    "module": {
        "rules": [
            {
                "test": /\.(tsx|ts|js)$/,
                "loader": 'ts-loader',
                "options": {
                    "transpileOnly": true,
                    "configFile": path.resolve(process.cwd(), "./tsconfig.json"),
                },
                include(resourcePath) {
                    const includePath = path.resolve(process.cwd(), resourcePath)
                    const includePathRegExp = `\\${path.sep}i-like-bonsai(\\${path.sep}src|$)`

                    if (!new RegExp(includePathRegExp, 'g').test(includePath)) {
                        return false;
                    }
                    return true;
                },
            },
            {
                "test": /\.(wasm)$/i,
                "type": "asset/resource",
                "generator": {
                    "filename": "[hash][ext][query]"
                },
            },
        ]
    },
    "experiments": {
        "asyncWebAssembly": true,
    },
    "plugins": [
        new HtmlWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin({
            "typescript": {
                "configFile": path.resolve(process.cwd(), "./tsconfig.json"),
            }
        }),
        new webpack.ProgressPlugin({
            activeModules : false,
        }),
        new CircularDependencyPlugin({
            "exclude": /(\\|\/)node_modules(\\|\/)/,
            "failOnError": false,
            "onDetected": false,
            "cwd": process.cwd(),
        }),
        isProduction
            ? new webpack.SourceMapDevToolPlugin(sourceMapDevToolOptions)
            : new webpack.EvalSourceMapDevToolPlugin(sourceMapDevToolOptions),
        new webpack.ProvidePlugin({
            // 'Promise': 'bluebird/js/browser/bluebird.min',
            'NativeURL': 'url-parse/dist/url-parse.min',
            'path': 'path-browserify',
        }),
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    ],
    "node": {
        "global": true,
        // __filename: "node-module",
        // "fs": "empty",
        // "url": true,
        // "querystring": true,
        // "path": "empty",
        // "crypto": "empty",
        // "tls": "empty",
        // "net": "empty",
        // "process": true,
        // "module": false,
        // "clearImmediate": false,
        // "setImmediate": false,
    },
    "devtool": false,
    "infrastructureLogging": { level: 'warn' },
    "stats": 'minimal'
});
