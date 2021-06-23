const rate = 100;
const rate_fault = '0.00';

const getMonthGrowingRate = ( last_month_val, this_month_val, lang ) => {
	const default_val = 'none';

	if ( !!last_month_val ) {
		return ( this_month_val * 100 / last_month_val - 100 ).toFixed( 2 ) + '%';
	} else {
		return default_val
	}
}

const getRate = ( val ) => {
	if ( isNotVaildNum( val ) ) {
		return rate_fault;
	}

	if ( val == 0 || !!val ) {
		const cul_rate = culRate( val );
		const formate_rate = formateRate( cul_rate );

		return formate_rate;
	} else {
		console.error( 'getRate val is not vaild =>', val )
		return rate_fault;
	}
}

const culRate = ( val ) => {
	const default_val = 0;

	try {
		if ( isNotVaildNum( val ) ) {
			return default_val;
		}

		return +( val / rate ); //main part

	} catch ( error ) {
		console.error( { error } );

		return default_val;
	}
}

const formateRate = ( val ) => {
	try {
		if ( isNotVaildNum( val ) ) {
			return rate_fault;
		}

		return formatFloat( val, 2 );

	} catch ( error ) {
		console.error( { error } );

		return rate_fault;
	}
}

const formatFloat = ( num, pos ) => {
	const size = Math.pow( 10, pos );
	const value = Math.round( num * size ) / size;
	const str = value.toFixed( 2 );

	return str
}

const isNotVaildNum = ( val ) => {
	if ( isNaN( val ) || val === Infinity || val === -Infinity ) {
		return true;
	} else {
		return false;
	}
}

/**
 * 將數字轉換成百分比的形式
 *
 * 例如 0.75 經過轉換後會變成 75%
 *
 * @param {string | number} num - 欲轉換的數字
 * @return {string} 轉換後的百分比數字
 */
function convertToPercentageString ( num ) {
	const result = accurateMultiplication( num, 100 );
	return `${formateRate( result )}%`;
}

/**
 * 精準乘法
 *
 * 以往使用一般乘法例如 519.43 * 100 會產生誤差得到51942.9999999
 *
 * 使用此function可以解決精度誤差問題
 *
 * 備註:由於回傳的型態還是number，因此還是有number型態先天儲存上的長度限制
 *
 * @param {string | number} num1 - 被乘數
 * @param {string | number} num2 - 乘數
 * @return {number} 相乘後的結果
 */
function accurateMultiplication ( num1, num2 ) {
	const s1 = num1.toString();
	const s2 = num2.toString();
	let d = 0; // 小數點後總位數

	try {
		d += s1.split( '.' )[ 1 ].length;
	} catch ( e ) { }

	try {
		d += s2.split( '.' )[ 1 ].length;
	} catch ( e ) { }

	// 都換成整數後相乘再還原小數點位置
	return Number( s1.replace( '.', '' ) ) * Number( s2.replace( '.', '' ) ) / Math.pow( 10, d );
}

module.exports = {
	getMonthGrowingRate,
	getRate,
	culRate,
	formateRate,
	convertToPercentageString,
	accurateMultiplication,
	isNotVaildNum
};
