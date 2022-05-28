const { merge } = require('webpack-merge');

const common = require('./webpack.common');
const HookPlugin = require('./hook-plugin');
const paths = require('./paths');

module.exports = merge(common, {
	mode: 'development',

	devtool: 'eval-cheap-source-map',

	devServer: {
		static: paths.src.default,
		compress: true,
		port: 'auto',
		open: true,
		historyApiFallback: true,
	},

	plugins: [new HookPlugin('RunSvgSpriteGenerator', 'node ./webpack/svgSprite.js', 'emit')],
});
