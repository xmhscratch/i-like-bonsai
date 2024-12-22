const url = require('url');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const smp = new SpeedMeasurePlugin();

const {
    SourceMapDevToolPlugin,
    EvalSourceMapDevToolPlugin,
} = require('webpack');
// const { CommonsChunkPlugin } = require('webpack').optimize;
// const ModuleResolverPlugin = require('babel-plugin-module-resolver').default;
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const PROJECT_ROOT_PATH = path.join(process.cwd());

const isProduction = true;

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

module.exports = smp.wrap({
    "mode": process.env.NODE_ENV || "development",
    "target": "web",
    "resolve": {
        "extensions": [".tsx", ".ts", ".js"],
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
    "entry": {
        "bootrap": ["./src/index.ts"], // "@babel/polyfill",
    },
    "output": {
        "path": path.join(PROJECT_ROOT_PATH, './dist'),
        "publicPath": publicPath,
        "filename": "[id].js",
        "chunkFilename": "[id].c.js",
        // "sourceMapFilename": "[file].map[query]",
        "crossOriginLoading": "anonymous",
        "pathinfo": false,
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
        usedExports: true,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        // namedModules: true,
        // namedChunks: true,
        chunkIds: 'natural',
        moduleIds: 'named',
        splitChunks: {
            minSize: ASSET_MIN_SIZE_IN_BYTES,
            maxSize: ASSET_MAX_SIZE_IN_BYTES,
            // chunks: 'async',
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            automaticNameDelimiter: '~',
            // enforceSizeThreshold: 50000,
            cacheGroups: {
                common: {
                    name: 'common',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
                default: false,
            },
        },
    },
    "module": {
        "rules": [
            {
                "test": /\.(tsx|ts|js)$/,
                "use": [
                    // {
                    //     "loader": 'babel-loader',
                    //     "options": {
                    //         "presets": [
                    //             [
                    //                 "@babel/preset-env",
                    //                 {
                    //                     "useBuiltIns": "entry",
                    //                     "corejs": "3.22",
                    //                     "targets": "> 0.25%, not dead"
                    //                 }
                    //             ],
                    //             ["@babel/preset-typescript", { "allowNamespaces": true }],
                    //         ],
                    //         "plugins": [
                    //             ["@babel/plugin-proposal-decorators", { "legacy": true }],
                    //             ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
                    //             ["@babel/plugin-proposal-private-methods", { "loose": true }],
                    //             ["@babel/plugin-proposal-class-properties", { "loose": true }],
                    //             "@babel/plugin-transform-arrow-functions",
                    //             "@babel/plugin-transform-runtime",
                    //             "@babel/plugin-proposal-nullish-coalescing-operator",
                    //             "lodash",
                    //         ]
                    //     },
                    // },
                    {
                        "loader": 'ts-loader',
                        "options": {
                            "transpileOnly": true,
                            "configFile": path.resolve(__dirname, "./tsconfig.json"),
                        },
                    },
                ],
                "exclude": /(node_modules)/,
            },
            {
                "test": /\.(wasm)$/i,
                "type": "javascript/auto",
                "use": [
                    {
                        "loader": 'arraybuffer-loader',
                        "options": {},
                    },
                ],
            },
        ]
    },
    "plugins": [
        new HtmlWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin({
            "typescript": {
                "configFile": path.resolve(__dirname, "./tsconfig.json"),
            }
        }),
        new ProgressPlugin({
            activeModules : false,
        }),
        new CircularDependencyPlugin({
            "exclude": /(\\|\/)node_modules(\\|\/)/,
            "failOnError": false,
            "onDetected": false,
            "cwd": PROJECT_ROOT_PATH,
        }),
        isProduction
            ? new SourceMapDevToolPlugin(sourceMapDevToolOptions)
            : new EvalSourceMapDevToolPlugin(sourceMapDevToolOptions),
        new ProvidePlugin({
            // 'Promise': 'bluebird/js/browser/bluebird.min',
            'NativeURL': 'url-parse/dist/url-parse.min',
            'path': 'path-browserify',
        }),
        // isProduction ? null : new BundleAnalyzerPlugin({
        //     // Can be `server`, `static` or `disabled`.
        //     // In `server` mode analyzer will start HTTP server to show bundle report.
        //     // In `static` mode single HTML file with bundle report will be generated.
        //     // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
        //     analyzerMode: isProduction ? "static" : "server",
        //     // // Host that will be used in `server` mode to start HTTP server.
        //     analyzerHost: '0.0.0.0',
        //     // // Port that will be used in `server` mode to start HTTP server.
        //     analyzerPort: 3664,
        //     // Path to bundle report file that will be generated in `static` mode.
        //     // Relative to bundles output directory.
        //     reportFilename: "report.html",
        //     // Module sizes to show in report by default.
        //     // Should be one of `stat`, `parsed` or `gzip`.
        //     // See "Definitions" section for more information.
        //     defaultSizes: "parsed",
        //     // Automatically open report in default browser
        //     openAnalyzer: false,
        //     // If `true`, Webpack Stats JSON file will be generated in bundles output directory
        //     generateStatsFile: true,
        //     // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
        //     // Relative to bundles output directory.
        //     statsFilename: "stats.json",
        //     // Options for `stats.toJson()` method.
        //     // For example you can exclude sources of your modules from stats file with `source: false` option.
        //     // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        //     statsOptions: null,
        //     // Log level. Can be 'info', 'warn', 'error' or 'silent'.
        //     logLevel: "info"
        // }),
    ],
    "node": {
        "global": true,
        __filename: "node-module",
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
