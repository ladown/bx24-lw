const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const paths = require('./paths');
const pugPages = require('./pugPages')();
const { generateTemplaet } = require('./pageList');

fs.writeFileSync(`${paths.src.pugPages}/index.pug`, generateTemplaet(), { encoding: 'utf8' });

module.exports = {
	target: 'web',

	entry: {
		pages: `${paths.src.scripts}/pug-files.js`,
		main: ['@babel/polyfill', `${paths.src.scripts}/index.js`],
	},

	output: {
		path: paths.build.default,
		filename: './js/[name].js',
		clean: true,
	},

	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: paths.src.sprite,
					to: paths.build.sprite,
				},
				{
					from: paths.src.imgs,
					to: paths.build.imgs,
					globOptions: {
						// ignore: ['backgrounds/*.*'],
						ignore: ['backgrounds/*.*', 'favicons/*.*'],
					},
				},
				{
					from: `${paths.src.default}/robots.txt`,
					to: `${paths.build.default}/robots.txt`,
				},
			],
		}),

		...pugPages.map((file) => {
			return new HtmlWebpackPlugin({
				template: `${paths.src.pugPages}/${file}`,
				filename: path.join(paths.build.default, file.replace('.pug', '.html')),
				// favicon: `${paths.src.favicon}/favicon.svg`,
				minify: false,
				inject: 'body',
				alwaysWriteToDisk: true,
			});
		}),

		new FaviconsWebpackPlugin({
			logo: `${paths.src.favicon}/favicon.svg`,
			cache: true,
			outputPath: paths.build.favicon,
			prefix: './images/favicons/',
			inject: true,
			favicons: {
				lang: 'en-US',
				background: '#fff',
				theme_color: '#fff',
				appleStatusBarStyle: 'black-translucent', // Style for Apple status bar: "black-translucent", "default", "black". `string`
				icons: {
					android: true,
					appleIcon: true,
					appleStartup: false,
					favicons: true,
					windows: true,
					yandex: false,
				},
			},
		}),
	],

	module: {
		rules: [
			{
				test: /\.pug$/,
				loader: '@webdiscus/pug-loader',
				options: {
					pretty: true,
				},
			},

			{
				test: /\.m?js$/,
				exclude: [
					/(node_modules|bower_components)/,
					`${paths.src.vendors}/vendor.js`,
					`${paths.src.vendors}/common.js`,
				],
				use: {
					loader: 'babel-loader',
				},
			},

			{
				test: /\.(c|sa|sc)ss$/i,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},

			{
				test: /\.(woff(2)?|ttf(2)?|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /(node_modules|bower_components)/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},

			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				exclude: [/(node_modules|bower_components)/, /sprite\.svg/],
				type: 'asset',
				generator: {
					filename: 'img/backgrounds/[name][ext]',
				},
			},
		],
	},
};
