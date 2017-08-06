const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')

const commonConfig = require('./webpack.common.js')


module.exports = (baseDir, folders) => merge(commonConfig(baseDir, folders), {
	module: {
		rules: [{
			test: /\.scss/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [ 'css-loader', {
					loader: 'sass-loader',
					options: {
						includePaths: [ path.resolve(baseDir, folders.SRC) ]
					}
				}],
				publicPath: folders.DIST
			})
		}]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'main.css',
			allChunks: true
		})
	]
})
