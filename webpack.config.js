const path = require('path');
var DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');

const config = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js',
		library: {
			name: 'regrain',
			type: "commonjs"
		}
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader',
			exclude: /node_modules/,
			options: {

			}
		}]
	},
	externals: [
		'react'
	]
}


module.exports = config;
