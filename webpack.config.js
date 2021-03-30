/* webpack.config.js ： Webpack 的設定檔 */
const path = require( 'path' );
const nodeExternals = require( 'webpack-node-externals' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const clientConfig = {
	target: 'node',
	entry: {
		'index': './src/app.js'
	},
	node: {
		__dirname: false,
		__filename: true,
	},
	// 設定要不要先轉譯這個位置
	output: {
		path: path.join( __dirname, 'dist' ),
		// 獲取絕對路徑的方法
		filename: '[name].bundle.js'
	},
	externals: [ nodeExternals() ],
	// 擴展
	plugins: [
		new webpack.IgnorePlugin( /terser-webpack-plugin/ ),
		new CopyPlugin( {
			patterns: [
				{ from: path.join( __dirname, 'src/views' ), to: path.join( __dirname, 'dist/views' ) },
			]
			// 指定來源與目的地
		} )
	],
}
module.exports = [ clientConfig ];