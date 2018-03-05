"use strict";


var path = require("path");
var webpack = require("webpack");

/**
 * Compile WebPack
 *
 * ---------------------------------------------------------------
 */
module.exports = function(grunt) {

    var webpackConfig = require("../../webpack.config.js");

    grunt.config.set("webpack", {
        options: webpackConfig,
        build: {

        },
        dev: {
            devtool: 'eval',
            debug: true,
            stats: {
                // Configure the console output
                colors: true,
                modules: true,
                reasons: true
            },
            // stats: false disables the stats output

            storeStatsTo: "xyz", // writes the status to a variable named xyz
            // you may use it later in grunt i.e. <%= xyz.hash %>

            progress: true, // Don't show progress
            // Defaults to true

            failOnError: false, // don't report error to grunt if webpack find errors
            // Use this if webpack errors are tolerable and grunt should continue

            watch: true, // use webpacks watcher
            // You need to keep the grunt process alive

            keepalive: true, // don't finish the grunt task
            // Use this in combination with the watch option

            inline: true, // embed the webpack-dev-server runtime into the bundle
            // Defaults to false

            hot: false,

            plugins: [
//                new webpack.HotModuleReplacementPlugin(),
                // new webpack.NoErrorsPlugin()
                //      new webpack.optimize.UglifyJsPlugin({
                //          compress: {
                //              warnings: false
                //          }
                //      }),
                // new CopyWebpackPlugin([{
                //     from: 'assets/',
                //     to: path.join(__dirname, '../.tmp/public/web/'),
                //     force: true
                // }]),
            ],
            module: {
                loaders: [{
                        test: /\.jsx?$/,
                        loader: 'babel',
                        exclude: /node_modules/,
                        query: {
                            presets: ["react", "es2015"],
                            plugins: ["transform-object-rest-spread", ["antd", { "style": "css" }]]
                        }
                    },
                    { test: /\.json$/, loader: 'file-loader' },
                    { test: /.ttf([\?]?.*)$/, loader: "file-loader" },
                    { test: /\.(eot|woff|woff2|svg)([\?]?.*)$/, loader: "file-loader" },
                    { test: /\.css$/, loader: "style!css" },
                    { test: /\.less/, loader: 'style-loader!css-loader!less-loader' },
                    {
                        test: /\.(png|jpg|jpeg|gif)$/,
                        loader: 'url-loader?limit=10000&name=./images/[name].[ext]'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-webpack");
};
