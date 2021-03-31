var express = require( 'express' );
var router = express.Router();
const utils = require( '../utils/utils' );
const moment = require( 'moment' );
const request = require( 'request' );

let balance = 6000;
// const agent_MD5_key = '4F5271D1935125D8'

const mysql = require( 'mysql' );
const connection = mysql.createConnection( {
	// host: '192.168.11.60',
	host: '192.168.1.208',
	port: 3306,
	database: 'KYDB_NEW',
	user: 'root',
	password: '123456',
	connectionLimit: 20,
	charset: 'utf8mb4',
	dateStrings: true,
	multipleStatements: true,
} );

connection.connect();

async function queryAsync ( sql, values ) {
	return new Promise( ( resolve, reject ) => {
		connection.query( sql, values, function ( err, result, fields ) {
			if ( err ) {
				reject( err );
			} else {
				resolve( result );
			}
		} );
	} );
}

function getChannelId ( account ) {
	console.log( { account } );
	return account.substring( 0, 6 );
}

router.get( '/addBalance', async ( req, res ) => {
	balance = req.query.balance;

	res.status( 200 ).send( balance )

} )

router.get( '/getBalance', async ( req, res ) => {
	console.log( req.query )
	let sql = `SELECT * FROM KYDB_NEW.Sys_ProxyAccount where channelid = '${req.query.account}';`
	console.log( { sql } )
	const query_agent_md5_key = await queryAsync( sql, [] )
	// console.log( { query: query_agent_md5_key } )
	const agent_md5_key = query_agent_md5_key[ 0 ].Md5key;
	const param = utils.desDecode( agent_md5_key, req.query.param );
	const param_obj = JSON.parse( param );
	console.log( { param } );
	const res_obj = {
		channelId: param_obj.channelId,
		account: param_obj.account,
		balance: balance,
	}

	const json = JSON.stringify( res_obj );

	const param_return = utils.desEncode( agent_md5_key, json );
	console.log( { res_obj } )
	console.log( { param_return } )

	setTimeout( () => {
		res.status( 200 ).send( param_return )
	}, 1000 );
} )

router.get( '/checkBalance', async ( req, res ) => {
	console.log( 'checkBalance=>', req.query )
	const param_raw = decodeURIComponent( req.query.param )
	let sql = `SELECT * FROM KYDB_NEW.Sys_ProxyAccount where channelid = '${req.query.account}';`
	console.log( { sql } )
	const query_agent_md5_key = await queryAsync( sql, [] )

	const agent_md5_key = query_agent_md5_key[ 0 ].Md5key
	const param_decode = utils.desDecode( agent_md5_key, param_raw );
	const param = JSON.parse( param_decode );
	console.log( { param } );
	const requestAmount = parseInt( param.requestAmount )
	const requestPass = param.requestAmount <= balance

	if ( requestPass ) {
		balance -= requestAmount;
	}

	const res_obj = {
		channelId: param.channelId,
		account: param.account,
	}

	const json = JSON.stringify( res_obj );
	const param_return = utils.desEncode( agent_md5_key, json );
	console.log( { res_obj } )
	console.log( { param_return } )

	var result = await updateServerPlayerAmount( param );

	console.log( { result } );

	setTimeout( () => {
		if ( requestPass ) {
			res.status( 200 ).send( param_return )
		} else {
			res.status( 500 ).send( param_return )
		}
	}, 1000 );


} )

const ChannelHandleRoute = 'http://192.168.1.208:89/channelHandle';
/**
 * @description 呼叫channelHandle進行上分
 * @param {Object} param 
 * @returns {Boolean} 是否上分成功
 */
const updateServerPlayerAmount = async ( param ) => {
	return new Promise( ( resolve, reject ) => {
		const orderid = param.channelId + moment().utcOffset( 8 ).format( 'YYMMDDHHmmss' );;
		const route = ChannelHandleRoute;
		const timestamp = Date.now();
		const args = `?agent=${param.channelId}&param={"money":${param.requestAmount},"account":"${param.account}","orderid":${orderid},"s":2}&timestamp="${timestamp}"`;
		const url = route + args;

		request( url, ( error, response, responseData ) => {

			console.log( JSON.stringify( { error, response, responseData } ) )

			if ( !!error && !response || !responseData || response.statusCode != 200 ) {
				resolve( false );
			} else {
				console.log( JSON.stringify( responseData ) );
				resolve( true );
			}
		} );
	} );
}


module.exports = router;