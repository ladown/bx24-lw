const fs = require('fs-extra');
const SVGSpriter = require('svg-sprite');
const paths = require('./paths');
const { optimize } = require('svgo');
const { hashElement } = require('folder-hash');

const config = {
	log: 'verbosity',
	mode: {
		inline: true,
		symbol: true,
	},
};

const spriter = new SVGSpriter(config);

const execute = async function (svgSrc = paths.src.icons, spriteTargetFile = paths.src.sprite) {
	console.log('__run SVG START');

	try {
		let hashJsonFile = `${spriteTargetFile}.json`;

		const options = {
			files: { include: ['*.svg'] },
		};

		let isHashed = await fs.existsSync(hashJsonFile);
		let hash = await hashElement(svgSrc, options);
		if (!hash && !hash.hash) {
			return console.error('hashing failed');
		}
		let folderHash = hash.hash;
		let goAhead = true;
		if (isHashed) {
			const hashObj = fs.readJsonSync(hashJsonFile);
			let savedFolderHash = hashObj.hash;
			if (savedFolderHash == folderHash) {
				goAhead = false;
			}
		}

		if (!goAhead) {
			console.log('__run SVG END (no needs)');
			return;
		}

		await fs.writeJson(hashJsonFile, { hash: folderHash });

		fs.readdirSync(svgSrc)
			.filter((fileName) => fileName.match(/^.+\.svg/gi))
			.forEach((fileName) => {
				if (!fileName.includes('sprite')) {
					let svgString = fs.readFileSync(`${svgSrc}/${fileName}`, { encoding: 'utf-8' });
					const optimizedResult = optimize(svgString, {
						js2svg: {
							pretty: true,
						},
						plugins: [
							'preset-default',
							{
								name: 'removeAttrs',
								params: {
									attrs: '(fill|stroke|stroke-width)',
								},
							},
						],
					});
					const optimizedSvgString = optimizedResult.data;
					spriter.add(`${svgSrc}/${fileName}`, null, optimizedSvgString);
				}
			});

		spriter.compile(function (error, result) {
			for (var mode in result) {
				for (var resource in result[mode]) {
					let svgSpriteString = result[mode][resource].contents;
					fs.writeFileSync(spriteTargetFile, svgSpriteString);
				}
			}

			console.log('__run SVG END');
		});
	} catch (err) {
		console.error(err);
	}
};

exports.execute = execute;

execute();
