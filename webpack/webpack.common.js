const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (baseDir, folders) => ({
	entry: {
		main: path.resolve(baseDir, folders.SRC, 'main.js')
	},
	output: {
		path: path.resolve(baseDir, folders.DIST),
		filename: '[name].bundle.js',
		sourceMapFilename: '[name].map'
	},
	module: {
		rules: [{
			test: /\.js/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [ 'es2015' ],
					plugins: [ 'transform-object-rest-spread' ]
				}
			}
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(folders.SRC, 'index.html'),
			filename: 'index.html'
		})
	],
	resolve: {
		modules: [
			path.resolve(baseDir, folders.SRC),
			'node_modules'
		]
	}
})
