//const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const output_path = 'E:/dev/release/web/pages/ssm/product/';

module.exports = {
	entry: __dirname + '/pages/Index.jsx',//已多次提及的唯一入口文件
	output: {
		path: path.resolve(output_path),//打包后的文件存放的地方
		filename: 'bundle.js'//打包后输出文件的文件名
	},
	watch: true,
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				use: {
					loader: 'babel-loader',
				},
				exclude: /node_modules/
			},
			{
				test: /\.min\.css$/,
				use: [
					{ loader: 'style-loader' },
					{
						loader: 'css-loader',
						options: {
							modules: false
						}
					}
				]
			},
			{
				test: /^(?!.*\.min).*\.css/,
				use: [
					{ loader: 'style-loader' },
					{
						loader: 'css-loader',
						options: {
							modules: true
						}
					}
				]
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				use: 'file-loader'
			},
			{
				test: /\.(woff|woff2)$/,
				use: {
					loader: 'url-loader',
					options: {
						prefix: 'font',
						limit: 5000
					}
				}
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'url-loader',
					options: {
						mimetype: 'application/octet-stream',
						limit: 10000
					}
				}
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'url-loader',
					options: {
						mimetype: 'image/svg+xml',
						limit: 10000
					}
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/pages/index.html'//new 一个这个插件的实例，并传入相关的参数
		}),
		new ExtractTextPlugin('styles.css')
	],
};