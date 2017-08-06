const path = require('path')

const folders = {
	SRC: 'src',
	DIST: 'dist'
}

module.exports = env => require(`./webpack/webpack.${env}.js`)(path.resolve(__dirname), folders)
