"use strict";

var path = require("path");
var webpack = require("webpack");

module.exports = {
    cache: true,
    entry: {
        site : ['./assets/js/site.jsx'],
        login : ['./assets/js/login.jsx'],
        app : ['./assets/js/app.jsx'],
		homepage : ['./assets/js/homepage.jsx']
    },
    output: {
        path: path.resolve(__dirname, './.tmp/public/web/js'),
        filename: '[name].js',
        chunkFilename: "[name].min.js",
        publicPath: 'web/js/'
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
