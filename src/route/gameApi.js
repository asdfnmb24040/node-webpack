var express = require( 'express' );
var router = express.Router();
const crypto = require( 'crypto' );
const mysql = require( 'mysql' );
var qs = require( 'querystring' );
const utils = require( '../utils/utils' );
const request = require( 'request' );
const mysqlHelper = require( '../utils/mysqlHelper' );

const ChannelHandleRoute = 'http://192.168.11.48:89/channelHandle';
const ChannelRecordHandleRoute = 'http://127.0.0.1:90/getRecordHandle';
// const ChannelRecordHandleRoute = 'http://192.168.1.208:90/getRecordHandle';

router.get( '/getRecordHandle', async ( req, res ) => {

	console.log( { req: req.query } )

	const param = {};
	param.account = req.query.account;
	param.recordID = req.query.recordID;
	param.kindID = req.query.kindID;
	param.channelId = req.query.channelId.toString();
	param.s = req.query.s;

	let sql = `SELECT * FROM KYDB_NEW.Sys_ProxyAccount where ChannelId = '${param.account}';`
	console.log( { sql } )
	const query_agent_md5_key = await mysqlHelper.queryAsync( sql, [] )
	const agent_md5_key = query_agent_md5_key[ 0 ].Md5key
	const agent_des_key = query_agent_md5_key[ 0 ].Deskey
	console.log( { param, agent_md5_key, agent_des_key } );


	const timestamp = Date.now();
	console.log( param.channelId + timestamp + agent_md5_key )
	const key = crypto.createHash( 'md5' ).update( param.channelId + timestamp + agent_md5_key ).digest( 'hex' );
	const route = ChannelRecordHandleRoute;
	const qs_encode = qs.stringify( param );
	console.log( { qs_encode } )
	const paramEncode = encodeURIComponent( utils.desEncode( agent_des_key, qs_encode ) );
	const args = `?&agent=${param.channelId}&param=${paramEncode}&timestamp=${timestamp}&key=${key}&lang=${req.query.lang}`;
	const url = route + args;

	console.log( { '傳給後台的路由': url } )

	request( { url, timeout: 1000 }, ( error, response, responseData ) => {

		// console.log( JSON.stringify( { error, response, responseData } ) )

		if ( !!error && !response || !responseData || response.statusCode != 200 ) {
			res.status( 500 ).send( error )
		} else {
			try {
				const Obj = JSON.parse( response.body );
				if ( !!Obj.d.data ) {
					const resultObj = Obj.d.data;
					res.status( 200 ).send( resultObj )
				} else {
					res.status( 200 ).send( Obj )
				}

			} catch ( error ) {
				res.status( 500 ).send( error )
			}

		}
	} );
} )



module.exports = router;