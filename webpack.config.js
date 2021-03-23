/* webpack.config.js ： Webpack 的設定檔 */
const path = require( 'path' );
const nodeExternals = require( 'webpack-node-externals' );
const clientConfig = {
	target: 'node',
	entry: {
		'index': './server.js'
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
	// 這個是擴展，太複雜本系列不會帶到，請到webpack官網查看
}
module.exports = [ clientConfig ];