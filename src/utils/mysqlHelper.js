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

console.log( '=== mysql connect ===' )

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

module.exports.queryAsync = queryAsync;