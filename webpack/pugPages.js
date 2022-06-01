const fs = require('fs');
const paths = require('./paths');

const pugPages = () =>
	fs.readdirSync(`${paths.src.pugPages}`).filter((file) => {
		return file.endsWith('.pug');
	});

module.exports = pugPages;
