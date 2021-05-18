const fs = require( 'fs' );
const source = '../asset/language/lang_th.properties';

main();

async function main () {
	const fileContent = await readFile( source );

	let map = new Map();

	if ( !!fileContent && Array.isArray( fileContent ) ) {

		const mark = '=';
		fileContent.forEach( item => {
			const isVaild = !!item && item.indexOf( mark ) != -1

			if ( isVaild ) {
				const key = item.split( mark )[ 0 ].trim();
				const value = item.split( mark )[ 1 ].trim();

				map.set( key, value );
			}
		} )
	}

	console.log( map )
}

async function readFile ( path ) {
	return new Promise( ( resolve, reject ) => {
		fs.readFile( path, function ( err, data ) {
			if ( err ) {
				reject( err );
			}
			resolve( parseToArray( data ) );
		} );
	} );
}

function parseToArray ( raw ) {
	let arr = raw.toString().split( '\r\n' )
	arr = arr.filter( f => {
		return !!f
	} )
	return arr;
}
