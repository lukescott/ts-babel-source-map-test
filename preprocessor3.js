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
		canInstrument: false,
		process(src, filename, config, transformOptions) {
			let inputSourceMap
			if (filename.endsWith(".ts") || filename.endsWith(".tsx")) {
				let compilerOptions = Object.assign({},
					tsConfig.compilerOptions, {
						sourceMap: true,
						module: "commonjs",
						target: "es2015",
					}
				)
				let transpileOut = tsc.transpileModule(src, {
					fileName: filename,
					compilerOptions
				});
				src = transpileOut.outputText
				inputSourceMap = JSON.parse(transpileOut.sourceMapText)
			}
			return {code: src, map: inputSourceMap}
		}
	};
};

module.exports = createTransformer();
module.exports.createTransformer = createTransformer;
