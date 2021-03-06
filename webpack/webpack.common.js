const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (baseDir, folders) => ({
	entry: {
		main: path.resolve(baseDir, folders.SRC, 'main.js')
	},
	output: {
		path: path.resolve(baseDir, folders.DIST),
		filename: '[name].bundle.js',
		//sourceMapFilename: '[name].map'
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
		}, {
			test: /\.jpe?g$|\.svg$|\.png$|\.json$/,
			exclude: /node_modules/,
			include: /assets/,
			use: {
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]'
				}
			}
		}, {
			test: /\.json/,
			exclude: /assets/,
			use: 'json-loader'
		}, {
			test: /\.(otf|ttf|woff|woff2)/,
			use: 'file-loader?name=fonts/[name].[ext]'
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
