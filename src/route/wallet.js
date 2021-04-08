var express = require( 'express' );
var router = express.Router();
const utils = require( '../utils/utils' );
const moment = require( 'moment' );
const request = require( 'request' );
const crypto = require( 'crypto' );
var qs = require( 'querystring' );

// let balance = 1090;

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

const balance_map = new Map();
balance_map.set( 'Vicky001', 6000 );
balance_map.set( 'Vicky002', 7000 );
balance_map.set( 'Vicky003', 8000 );
balance_map.set( 'armand08_player', 9000 );

function getPlayerBalance ( param ) {
	const req_account = getRealAccount( param.account );

	console.log( { req_account } )

	if ( balance_map.has( req_account ) ) {
		return balance_map.get( req_account );
	} else {
		console.log( 'getPlayerBalance => cant found account' );
		return 0;
	}
}

function setPlayerBalance ( param, new_val ) {
	const req_account = getRealAccount( param.account );

	console.log( { req_account } )

	if ( balance_map.has( req_account ) ) {
		balance_map.set( req_account, new_val );
	} else {
		console.log( 'setPlayerBalance => cant found account' );
	}
}

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

function getRealChannelId ( account ) {
	const leng = account.indexOf( '_' );

	return account.substring( 0, leng );
}

function getRealAccount ( account ) {
	const leng = account.indexOf( '_' );

	return account.substring( leng + 1 );
}

router.get( '/addBalance', async ( req, res ) => {
	balance = req.query.balance;

	res.status( 200 ).send( balance )

} )

router.get( '/getBalance', async ( req, res ) => {

	console.log( req.query )
	let sql = `SELECT * FROM KYDB_NEW.Sys_ProxyAccount where ChannelId = '${getRealChannelId( req.query.account )}';`
	console.log( { sql } )
	const query_agent_md5_key = await queryAsync( sql, [] )
	// console.log( { query: query_agent_md5_key } )
	const agent_md5_key = query_agent_md5_key[ 0 ].Md5key;
	const param = utils.desDecode( agent_md5_key, req.query.param );
	const param_obj = JSON.parse( param );
	console.log( { param } );

	const balance = getPlayerBalance( param_obj );

	const res_obj = {
		channelId: param_obj.channelId,
		account: param_obj.account,
		balance: balance,
	}

	const json = JSON.stringify( res_obj );

	const param_return = utils.desEncode( agent_md5_key, json );
	console.log( { res_obj } )
	console.log( { param_return } )
	console.log( { balance_map } )

	setTimeout( () => {
		res.status( 200 ).send( param_return )
	}, 1000 );
} )

router.get( '/checkBalance', async ( req, res ) => {
	console.log( 'checkBalance=>', req.query )
	const param_raw = decodeURIComponent( req.query.param )
	let sql = `SELECT * FROM KYDB_NEW.Sys_ProxyAccount where ChannelId = '${getRealChannelId( req.query.account )}';`
	console.log( { sql } )
	const query_agent_md5_key = await queryAsync( sql, [] )

	const agent_md5_key = query_agent_md5_key[ 0 ].Md5key
	const agent_des_key = query_agent_md5_key[ 0 ].Deskey
	const param_decode = utils.desDecode( agent_md5_key, param_raw );
	const param = JSON.parse( param_decode );
	console.log( { param } );
	let balance = getPlayerBalance( param );
	const requestAmount = parseInt( param.requestAmount )
	const requestPass = param.requestAmount <= balance
	console.log( { requestAmount, balance } )

	if ( requestPass ) {
		balance -= requestAmount;
		setPlayerBalance( param, balance )
	}

	const res_obj = {
		channelId: param.channelId,
		account: param.account,
	}

	const json = JSON.stringify( res_obj );
	const param_return = utils.desEncode( agent_md5_key, json );
	console.log( { res_obj } )
	console.log( { param_return } )

	setTimeout( () => {
		if ( requestPass ) {
			res.status( 200 ).send( param_return )
		} else {
			res.status( 500 ).send( param_return )
		}
	}, 1000 );

	if ( requestPass ) {
		var result = await updateServerPlayerAmount( param, agent_des_key, agent_md5_key );
		console.log( { result } );
		console.log( { balance_map } )
	} else {
		console.log( '=== wallet is not enough balance so cant up score for player ===' )
	}
} )

const ChannelHandleRoute = 'http://192.168.1.208:89/channelHandle';
//const ChannelHandleRoute = 'http://127.0.0.1:89/channelHandle';

/**
 * @description 呼叫channelHandle進行上分
 * @param {Object} param 
 * @returns {Boolean} 是否上分成功
 */
const updateServerPlayerAmount = async ( param, agent_des_key, agent_md5_key ) => {
	return new Promise( ( resolve, reject ) => {

		console.log( { param, agent_md5_key, agent_des_key } );

		param.account = getRealAccount( param.account )
		param.channelId = param.channelId.toString();
		param.requestAmount = param.requestAmount / 100;
		param.money = param.requestAmount;
		param.orderid = param.channelId + moment().utcOffset( 8 ).format( 'YYMMDDHHmmssSSS' ) + param.account;
		param.s = 2;

		const timestamp = Date.now();
		console.log( param.channelId + timestamp + agent_md5_key )
		const key = crypto.createHash( 'md5' ).update( param.channelId + timestamp + agent_md5_key ).digest( 'hex' );
		const route = ChannelHandleRoute;
		const qs_encode = qs.stringify( param );
		console.log( { qs_encode } )
		const paramEncode = encodeURIComponent( utils.desEncode( agent_des_key, qs_encode ) );
		const args = `?agent=${param.channelId}&param=${paramEncode}&timestamp=${timestamp}&key=${key}`;
		const url = route + args;

		console.log( { url } )

		request( url, ( error, response, responseData ) => {

			console.log( JSON.stringify( { error, response, responseData } ) )

			if ( !!error && !response || !responseData || response.statusCode != 200 ) {
				resolve( false );
			} else {
				resolve( true );
			}
		} );
	} );
}

module.exports = router;