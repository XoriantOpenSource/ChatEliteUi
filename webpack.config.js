/*!
 * Webpack-stream v3.2.0
 * Copyright (c) 2018 Kyle Robinson Young
 * Licensed under MIT (https://github.com/shama/webpack-stream/blob/master/LICENSE-MIT)
!*/


/*!
 * Webpack v2.2.1
 * Copyright JS Foundation and other contributors
 * Licensed under MIT (https://github.com/webpack/webpack/blob/master/LICENSE)
!*/
var webpack = require('webpack');

/*!
 * Autoprefixer v6.7.7
 * Copyright 2013 Andrey Sitnik <andrey@sitnik.ru>
 * Licensed under MIT (https://github.com/postcss/autoprefixer/blob/master/LICENSE)
!*/
var autoprefixer = require('autoprefixer');

/*!
 * Html-webpack-plugin v2.28.0
 * Copyright JS Foundation and other contributors
 * Licensed under MIT (https://github.com/jantimon/html-webpack-plugin/blob/master/LICENSE)
!*/
var HtmlWebpackPlugin = require('html-webpack-plugin');


var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var path = require('path');

/*!
 * Browser-sync v2.18.8
 * Licensed under Apache License 2.0 (https://github.com/BrowserSync/browser-sync/blob/master/LICENSE)
!*/
/*!
 * Browser-sync-webpack-plugin v1.1.4
 * Copyright (c) 2015 Valentyn Barmashyn
 * Licensed under MIT (https://github.com/Va1/browser-sync-webpack-plugin/blob/master/LICENCE)
!*/
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

        loaders: [
            /*!
            * Awesome-typescript-loader v3.1.2
            * Copyright (c) 2015 Stanislav Panferov
            * Licensed under MIT (https://github.com/s-panferov/awesome-typescript-loader/blob/master/LICENSE.md)
            !*/
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            /*!
            * Html-loader v0.4.5
            * Copyright JS Foundation and other contributors
            * Licensed under MIT (https://github.com/webpack-contrib/html-loader/blob/master/LICENSE)
            !*/
            {
                test: /\.html$/,
                loader: "html-loader?interpolate&minimize=false"
            },
            /*!
            * Style-loader v0.14.1
            * Copyright JS Foundation and other contributors 
            * Licensed under MIT (https://github.com/webpack-contrib/style-loader/blob/master/LICENSE)
            !*/
            /*!
            * Css-loader v0.27.3
            * Copyright JS Foundation and other contributors
            * Licensed under MIT (https://github.com/webpack-contrib/css-loader/blob/master/LICENSE)
            !*/
            /*!
            * Resolve-url-loader v2.1.0
            * Copyright (c) 2016 Ben Holloway
            * Licensed under MIT (https://github.com/bholloway/resolve-url-loader/blob/master/LICENCE)
            !*/
            /*!
            * Sass-loader v6.0.3
            * Copyright JS Foundation and other contributors
            * Licensed under MIT (https://github.com/webpack-contrib/sass-loader/blob/master/LICENSE)
            !*/
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!resolve-url-loader!sass-loader!import-glob-loader?sourceMap'
            },
            /*!
            * Url-loader v0.5.8
            * Copyright JS Foundation and other contributors
            * Licensed under MIT (https://github.com/webpack-contrib/url-loader/blob/master/LICENSE)
            !*/
            {
                test: /\.(woff2)$/,
                loader: 'url'
            },
            /*!
            * File-loader v0.10.1
            * Copyright JS Foundation and other contributors
            * Licensed under MIT (https://github.com/webpack-contrib/file-loader/blob/master/LICENSE)
            !*/
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
                /*!
                * Postcss-loader v1.3.3
                * Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>
                * Licensed under MIT (https://github.com/postcss/postcss-loader/blob/master/LICENSE)
                !*/
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

            /*!
            * Webpack-hot-middleware v2.17.1
            * Copyright JS Foundation and other contributors
            * Licensed under MIT (https://github.com/webpack-contrib/webpack-hot-middleware/blob/master/LICENSE)
            !*/
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