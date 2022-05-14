const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
	entry: [
		'react-hot-loader/patch',
		'./src/index.tsx',
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						},
					},
					'postcss-loader',
				],
			},
			{
				test: /\.ts(x)?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	devServer: {
		'static': {
			directory: './dist',
		},
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: 'src/index.html' }],
		}),
	],
	resolve: {
		extensions: [
			'.tsx',
			'.ts',
			'.js',
		],
		alias: {
			'react-dom': '@hot-loader/react-dom',
			'regrain': path.resolve(__dirname, '..'),
		},
	},
};
module.exports = config;
