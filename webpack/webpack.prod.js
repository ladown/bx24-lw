const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const paths = require('./paths');
const HookPlugin = require('./hook-plugin');
const commonOptions = require('./webpack.common');

module.exports = merge(commonOptions, {
	mode: 'production',

	devtool: false,

	entry: {
		vendor: `${paths.src.vendors}/vendor.js`,
		common: `${paths.src.vendors}/common.js`,
		main: ['@babel/polyfill', `${paths.src.scripts}/index.js`],
	},

	module: {
		rules: [
			{
				test: /\.(c|sa|sc)ss$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
			},
		],
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: ({ chunk }) => `css/${chunk.name.replace('/js/', '/css/')}.css`,
		}),

		new HookPlugin('RunSvgSpriteGenerator', 'node ./webpack/svgSprite.js', 'beforeRun'),
	],

	optimization: {
		minimizer: [
			new ImageMinimizerPlugin({
				test: /.(jpe?g|png|gif|svg)$/i,
				exclude: /(sprite\.svg|favicons)/,
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: [
							['gifsicle', { interlaced: true }],
							['jpegtran', { progressive: true, quality: 'hight' }],
							['optipng', { optimizationLevel: 5, quality: [0.7, 1] }],
							'imagemin-svgo',
						],
					},
				},
			}),
		],
	},
});
