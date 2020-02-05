const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const fs = require('fs');
const argv = require('yargs').argv;
const CssUrlRelativePlugin = require('css-url-relative-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Какой вариант предпочительнее с const isDev ?
const isDev = process.env.NODE_ENV === 'development';
// const isDev = argv.mode === 'development';

const isProd = !isDev;

const PATHS = {
	src: path.join(__dirname, './src'),
	dist: path.join(__dirname, './dist')
};

const PAGES_DIR = PATHS.src;
const PAGES = fs
	.readdirSync(PAGES_DIR)
	.filter(fileName => fileName.endsWith('.html'));

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all'
		}
	};

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetWebpackPlugin(),
			new TerserWebpackPlugin()
		];
	}

	return config;
};

const cssLoaders = extra => {
	const loaders = [
		'style-loader',
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: isDev,
				reloadAll: true,
				sourceMap: true
			}
		},
		'css-loader',
		{
			loader: 'postcss-loader',
			options: {
				plugins: [
					isProd ? require('cssnano') : () => {},
					require('autoprefixer')
				]
			}
		}
	];

	if (extra) {
		loaders.push(extra);
	}

	return loaders;
};

const babelOptions = preset => {
	const options = {
		presets: ['@babel/preset-env'],
		plugins: ['@babel/plugin-proposal-class-properties']
	};

	if (preset) {
		options.presets.push(preset);
	}
	return options;
};

const filename = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
// const filename = ext => `[name].${ext}`;

const jsLoaders = () => {
	const loaders = [
		{
			loader: 'babel-loader',
			options: babelOptions()
		}
	];

	/* if (isDev) {
		loaders.push('eslint-loader');
	} */
	return loaders;
};

const plugins = () => {
	const base = [
		new CleanWebpackPlugin(),

		...PAGES.map(
			page =>
				new HTMLWebpackPlugin({
					template: `${PAGES_DIR}/${page}`,
					filename: `./${page}`,
					minify: {
						collapseWhiteSpace: isProd
					}
				})
		),
		new CopyWebpackPlugin([
			{ from: `${PATHS.src}/img`, to: `${PATHS.dist}/img` }
			// { from: `${PATHS.src}/fonts`, to: `${PATHS.dist}/fonts` }
		]),

		new CssUrlRelativePlugin(),

		new MiniCssExtractPlugin({
			// filename: filename('css')
			// filename: 'css/[name].css'
			filename: `css/${filename('css')}`
		}),

		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			jQuery: 'jquery',
			'window.jquery': 'jquery'
		})
		/* new webpack.SourceMapDevToolPlugin({
			filename: '[name].js.map'
		}) */
	];

	/* if (isProd) {
		base.push(new BundleAnalyzerPlugin());
	} */

	return base;
};

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
		modernizr: `${PATHS.src}/js/modernizr-3.6.0.min.js`,
		//jquery: `${PATHS.src}/js/jquery-2.2.4.min.js`,
		// plugins: `${PATHS.src}/js/plugins.js`,
		/* 'plugins.js': [
			path.resolve(__dirname, './src/js/jquery.init.plugins.js'),
			path.resolve(__dirname, './src/plugins/viewportchecker.min.js'),
			path.resolve(__dirname, './src/plugins/jquery.maskedinput.min.js'),
			path.resolve(__dirname, './src/plugins/slick.min.js'),
			path.resolve(__dirname, './src/plugins/jquery.photobox.min.js')
		], */
		bundle: ['@babel/polyfill', './index.js']
	},
	output: {
		//filename: filename('js'),
		filename: `js/${filename('js')}`,
		path: path.resolve(__dirname, 'dist'),
		publicPath: ''
	},
	devtool: isDev ? 'source-map' : '',
	resolve: {
		extensions: ['.js', '.scss', '.json'],
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	optimization: optimization(),
	devServer: {
		port: 8081,
		inline: true,
		//contentBase: [path.join(__dirname, 'src'), path.join(__dirname, 'dist')]
		contentBase: path.join(__dirname, 'src'),
		compress: true,
		stats: {
			children: false,
			maxModules: 0
		}
	},

	module: {
		rules: [
			{
				test: /\.s[ac]ss$/,
				// Какой из вариантов предпочительнее ?
				// ВАРИАНТ -1
				use: cssLoaders('sass-loader')
				// ВАРИАНТ -2
				/* use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								isProd ? require('cssnano') : () => {},
								require('autoprefixer')
							]
						}
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				] */

				// ВАРИАНТ - 3
				/* use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							config: { path: './src/js/postcss.config.js' }
						}
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				] */
			},
			{
				test: /\.css$/,
				use: cssLoaders()
				//Нужен ли код ниже ?
				/*use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							config: { path: './src/js/postcss.config.js' }
						}
					}
				]*/
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				include: [path.resolve(__dirname, './src/img/')],
				loader: 'file-loader',
				options: {
					outputPath: 'img/',
					name: '[name].[ext]'
				}
			},
			{
				test: /\.(eot|woff(2)?|ttf|svg)$/,
				include: [path.resolve(__dirname, './src/fonts/')],
				loader: 'file-loader',
				options: {
					//outputPath: 'fonts/',
					//name: '[name].[ext]'
					outputPath: './',
					name: '[path][name].[ext]'
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: jsLoaders()
			}
		]
	},

	plugins: plugins()
};
