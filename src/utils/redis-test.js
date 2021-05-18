var redis = require( 'redis' );// 召唤redis
var redisUtil = require( './redisUtil' );

var redis_config = {
	host: '192.168.1.208',
	port: 6050,
	options: {},
	password: ''
};

var redisClient = redis.createClient( redis_config.port, redis_config.host, {} );

// if ( redis_config.password != '' ) {
// 	redisClient.auth( redis_config.password );
// }
redisClient.on( 'error', ( err ) => {
	utils.log( 'Error ' + err );
} );
var client = new redisUtil( redisClient );

const playerMap = new Map();

getInfo( () => {
	var arr = Array.from( playerMap.keys() )
	var newArr = [];
	arr.forEach( item => {
		item = item.replace( 'platformRecords:', '' )
		newArr.push( item );
	} )
	console.log( newArr );
} )

function getInfo ( callback ) {
	client.getKeys( "platformRecords:*", function ( err, keys ) {
		// reply is null when the key is missing

		keys.forEach( ( key, idx ) => {

			client.hgetall( key, ( err, res ) => {
				const playerInfo = JSON.parse( res.all );
				playerMap.set( key, playerInfo );

				if ( idx + 1 === keys.length ) {
					callback();
				}
			} );
		} );
	} );
}




