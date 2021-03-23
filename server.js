const express = require( 'express' )
const app = express()
const port = 3001

console.log( 'the server is open port:' + port )

app.get( '/', ( req, res ) => {
	res.send( 'Hello World!' )
} )

app.listen( port, () => {
	console.log( `Example app listening at http://localhost:${port}` )
} )