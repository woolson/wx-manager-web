var path = require('path')
var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'
var vueLoaderConfig = require('./vue-loader.conf.js')

function resolve (dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	entry: {
		app: './src/main.js',
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		library: '[name]_library',
		publicPath: isProduction
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath,
	},
	resolve: {
		extensions: ['.js', '.vue', '.json', '.styl', '.less'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'src': resolve('src'),
		},
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig,
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test')],
			},
			{
				test: /\.pug$/,
				loader: 'pug-loader',
				include: [resolve('src')],
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]'),
				},
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]'),
				},
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
				},
			},
		],
	},
}
