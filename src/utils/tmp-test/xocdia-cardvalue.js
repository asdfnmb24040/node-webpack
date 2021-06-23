const cardValue = '010000000104'

console.log( parse( cardValue ) )

function parse ( cardValue ) {
	const formate = cardValue.substring( 0, 8 ).split( '' )
	const enumValue = cardValue.substring( 8, cardValue.length )
	let validValues = [];

	formate.forEach( ( f, i ) => {
		if ( i % 2 !== 0 ) {
			validValues.push( f )
		}
	} )

	return { validValues, enumValue };
}