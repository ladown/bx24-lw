const path = require('path');

module.exports = {
	src: {
		default: path.resolve(__dirname, '../src/'),
		scripts: path.resolve(__dirname, '../src/js/'),
		sprite: path.resolve(__dirname, '../src/icons/sprite.svg'),
		pugPages: path.resolve(__dirname, '../src/pug/pages'),
		vendors: path.resolve(__dirname, '../src/vendors/'),
		icons: path.resolve(__dirname, '../src/icons/'),
		imgs: path.resolve(__dirname, '../src/images/'),
		favicon: path.resolve(__dirname, '../src/images/favicons/'),
	},
	build: {
		default: path.resolve(__dirname, '../build/'),
		sprite: path.resolve(__dirname, '../build/icons/'),
		vendors: path.resolve(__dirname, '../build/vendors/'),
		imgs: path.resolve(__dirname, '../build/images/'),
		favicon: path.resolve(__dirname, '../build/images/favicons/'),
	},
};
