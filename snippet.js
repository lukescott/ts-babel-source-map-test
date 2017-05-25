var tsc = require("typescript");
var babel = require('babel-core');
var babelPluginIstanbul = require('babel-plugin-istanbul').default;

var filename = "./src/foo/foo.ts";

var tsConfig = {
	fileName: filename,
	compilerOptions: {
		module: "es2015",
		target: "esnext",
		jsx: "preserve",
		baseUrl: ".",
		moduleResolution: "node",
		paths: {
			"*": [
				"src/*"
			]
		},
		sourceMap: true
	}
};

var babelConfig = {
	filename: filename,
	retainLines: true,
	inputSourceMap: inputSourceMap,
	sourceMap: true,
	auxiliaryCommentBefore: " istanbul ignore next ",
	presets: ["latest"],
	plugins: [
		"transform-class-properties",
		"transform-object-rest-spread",
		[babelPluginIstanbul, {
			cwd: ".",
			exclude: [],
			// inputSourceMap: inputSourceMap, // seems to do same thing as above
		}]
	]
};


var src = 'import bar from "../bar/bar"\
\
export default bar({\
	input(state, value = "") {\
		if (!value) {\
			return null\
		}\
		return state\
	},\
})';
var transpileOut = tsc.transpileModule(src, tsConfig);
var inputSourceMap = JSON.parse(transpileOut.sourceMapText);
var babelOut = babel.transform(transpileOut.outputText, babelConfig);

console.log("tsc out:", transpileOut.sourceMapText);
console.log("babel out:", JSON.stringify(babelOut.map));
