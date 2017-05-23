const tsc = require("typescript")
const tsConfig = require("./tsconfig.json") || {}
const babel = require('babel-core')
const jestPreset = require('babel-preset-jest')
const babelPluginIstanbul = require('babel-plugin-istanbul').default

const createTransformer = (options) => {
	options = Object.assign({}, options, {
		plugins: (options && options.plugins) || [],
		presets: ((options && options.presets) || []).concat([jestPreset]),
		retainLines: true
	});
	delete options.cacheDirectory;
	delete options.filename;
	return {
		canInstrument: true,
		process(src, filename, config, transformOptions) {
			let inputSourceMap
			const theseOptions = Object.assign({
				filename,
				inputSourceMap,
			}, options);
			if (transformOptions && transformOptions.instrument) {
				theseOptions.auxiliaryCommentBefore = ' istanbul ignore next ';
				theseOptions.plugins = theseOptions.plugins.concat([
					[
						babelPluginIstanbul, {
							cwd: config.rootDir,
							exclude: [],
							// inputSourceMap, // seems to do same thing as above
						}
					]
				]);
			}
			return babel.transform(src, theseOptions).code
		}
	};
};

module.exports = createTransformer();
module.exports.createTransformer = createTransformer;
