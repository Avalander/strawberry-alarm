const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const commonConfig = require('./webpack.common.js')

module.exports = (baseDir, folders) => merge(commonConfig(baseDir, folders), {
	module: {
		rules: [{
			test: /\.scss/,
			use: [ 'style-loader', 'css-loader', {
				loader: 'sass-loader',
				options: {
					includePaths: [ path.resolve(baseDir, folders.SRC) ]
				}
			}]
		}]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.SourceMapDevToolPlugin({
			filename: '[name].js.map'
		})
	],
	devServer: {
		contentBase: path.resolve(baseDir, folders.DIST),
		compress: true,
		hot: true,
		stats: 'minimal',
		historyApiFallback: {
			index: '/index.html'
		}
	}
})
