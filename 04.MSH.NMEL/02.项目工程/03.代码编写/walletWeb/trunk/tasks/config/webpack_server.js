"use strict";

/**
 * Compile WebPack
 *
 * ---------------------------------------------------------------
 */
module.exports = function(grunt) {

    var webpackConfig = require("../../webpack.config.js");

    grunt.config.set("webpack-dev-server", {
        dev: {
            entry: 'assets/js/site.jsx',
            output: {
                path: '.tmp/public/web/js/',
            },
            port: 1400
        }
    });

    grunt.loadNpmTasks("webpack-dev-server");
};
