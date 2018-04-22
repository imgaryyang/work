"use strict";
var babelpolyfill = require("babel-polyfill");
var path = require("path");
var webpack = require("webpack");

module.exports = {
    cache: true,
    entry: {
        app : ['./assets/js/app.jsx'],
    },
    output: {
        path: path.resolve(__dirname, './.tmp/public/js'),
        filename: '[name].js',
        chunkFilename: "[name].min.js",
        publicPath: 'js/'
    },
    externals: { 
    	'react' : 'React',
//		'react-router':'ReactRouter',
		'react-dom' : 'ReactDOM',
		'antd':'antd'
    }, //,,'rctui':'rctui'
    resolve: {
      root: [
        'node_modules'
      ],
      extensions:['','.js','.json']
    },
    watchDelay : 5000

};
