var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports.webpack = { 
	options : {
		devtool : 'eval',
		entry : {
			app : './assets/js/app.jsx',
		},
		output : {
			path : path.resolve(__dirname, '../.tmp/public/js'),
			filename : '[name].js',
			chunkFilename : "[name].min.js",
			publicPath : '/js/'
		},
		externals : {
			'react' : 'React',
			'react-router':'ReactRouter',
			'react-dom' : 'ReactDOM',
			'antd':'antd'
		},// ,,'rctui':'rctui'
		plugins : [new CopyWebpackPlugin([{
	          from: 'assets/',
	          to: path.join(__dirname, '../.tmp/public/'),
	          force: true
	      }]), ],
		module : {
			loaders : [ {
				test : /\.jsx$/,
				loader : 'babel',
				query : {
					presets : [ "react", "es2015" ],
					plugins : [ "transform-object-rest-spread" ]
				}
			}, {
				test : /\.json$/,
				loader : 'file-loader'
			},{
				test : /.ttf([\?]?.*)$/,
				loader : "file-loader"
			}, {
				test : /\.(eot|woff|woff2|svg)([\?]?.*)$/,
				loader : "file-loader"
			}, {
				test : /\.(css|less)$/,
				loader : 'style-loader!css-loader!postcss-loader!less-loader'
			}, {
				test : /\.(png|jpg|jpeg|gif)$/,
				loader : 'url-loader?limit=10000&name=./images/[name].[ext]'
			} ]
		}

	},
	watchOptions : {
		aggregateTimeout : 300
	}
};
