// Modules
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
const isTest = ENV === 'test';
var isProd = ENV === 'release';

module.exports = function makeWebpackConfig() {

    var config = {};

    if (!isTest) {
        config.entry = {
            app: './entry.ts'
        };
    }

    config.context = path.resolve(__dirname, 'src'),



        config.output = {
            // Absolute output directory
            path: __dirname + (isProd ? '/dist' : '/debug'),
            publicPath: '',
            filename: 'collab-[hash].js',
            chunkFilename: 'collab-[hash].js'
        };



    if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'source-map';
    }



    config.module = {

        loaders: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader'
        },
        {
            test: /\.html$/,
            loader: "html-loader?interpolate&minimize=false"
        },
        {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!resolve-url-loader!sass-loader!import-glob-loader?sourceMap'
        },
        {
            test: /\.(woff2)$/,
            loader: 'url'
        },
        {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file-loader'
        },
        {
            test: /firebase-messaging-sw.js$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        }
        ]
    }

    config.resolve = {
        extensions: ['.ts', '.js', '.png', '.jpeg', '.jpg']
    }

    config.plugins = [

        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer({
                        browsers: ['last 2 version']
                    })
                ],
                htmlLoader: {
                    ignoreCustomFragments: [/\{\{.*?}}/]
                }
            }
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        })

    ]

    if (!isTest) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: './index.html'
            })
        );
    }

    if (!isTest && !isProd) {
        //debug mdoe
        config.plugins.push(
            new BrowserSyncPlugin({
                https: ENV !== 'http',
                host: 'localhost',
                port: 8080,
                ghostMode: false,
                server: { baseDir: ['debug'] }
            })
        );

    }

    if (isProd) {
        //while going to production
        config.plugins.push(
            new webpack.NoErrorsPlugin(),

            new webpack.optimize.OccurrenceOrderPlugin(),

            new webpack.optimize.DedupePlugin(),

            new webpack.optimize.UglifyJsPlugin({
                sourceMap: false,
                mangle: true,
                compress: { warnings: false }
            })
        )
    }

    return config;
}();