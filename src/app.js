const express = require( 'express' )
const app = express()
const port = 3001
const path = require( 'path' );
const bodyParser = require( 'body-parser' )
const home = require( './route/home' );
const wallet = require( './route/wallet' );
const gameApi = require( './route/gameApi' );

console.log( 'the server is running. port:' + port )

// app.get( '/', ( req, res ) => {
// 	res.send( 'Hello World!' )
// } )

app.post( '/', ( req, res ) => {
	console.log( 'init post =>>>', req.body )
	res.send( 'Hello World!' )
} )

app.listen( port, () => {
	console.log( `app listening at http://localhost:${port}` )
} )

app.set( 'views', path.join( __dirname, './views' ) );
app.set( 'view engine', 'ejs' );
app.use( bodyParser.json() )
app.use( bodyParser.urlencoded( { extended: true } ) )
app.use( '/home', home );
app.use( '/wallet', wallet );
app.use( '/gameApi', gameApi );

setInterval( () => {
	console.log( 'I\'m still alive.' );
}, 60000 );