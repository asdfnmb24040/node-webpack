const request = require( 'request' );

( async function () {
	await getAgentOnlinePlayers( 'http://192.168.0.34:8880/', [ 123, 456 ] ).then( ( val ) => {
		console.log( { val } )
	} ).catch( async ( err ) => {
		console.log( { err } )
		var a = await getAgentOnlinePlayers( 'http://192.168.0.36:8880/', [ 123, 456 ] )
		console.log( { a } )
	} )
} )();



//获取代理线上人数
function getAgentOnlinePlayers ( gs, bigAgent ) {
	return new Promise( ( resolve, reject ) => {
		const agents = bigAgent.join();
		const url = gs + `getOnlinePlayersNum?agents=${agents}`;
		console.log( 'getAgentOnlinePlayers', { url } )
		request( { url: url, timeout: 1000 }, function ( error, response, responseData ) {
			if ( error || response.statusCode != 200 || responseData == "" ) {
				reject( error );
			} else {
				responseData = JSON.parse( responseData );
				if ( responseData.code == 0 ) {
					const result = responseData.playernum;
					resolve( result );
				}
			}
		} )
	} )
}