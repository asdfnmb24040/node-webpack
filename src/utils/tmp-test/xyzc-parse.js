var $ = {
	i18n: {
		prop: ( key ) => {
			return key;
		}
	}
}
const com = require( '../calculateHelper' );

const options = JSON.parse( '{"accounts":"user#663","gameName":"Paikang","roomData":{"ServerID":5041,"ServerName":"Paikang新手房","ServerDLLName":null,"KindID":504,"NodeID":null,"SortID":null,"GameID":504,"TableCount":null,"ServerType":null,"ServerPort":null,"DataBaseName":null,"DataBaseAddr":null,"ServiceAddr":null,"VideoAddr":null,"CellScore":1000,"RevenueRatio":null,"RestrictScore":null,"MinEnterScore":null,"MaxEnterScore":null,"MaxPlayer":null,"MatchInning":null,"ServerRule":null,"ServerNote":null,"CreateDateTime":null,"ModifyDateTime":null,"PlazaID":null,"Saturation":null,"AndroidMinLeaveScore":null,"AndroidMaxLeaveScore":null,"ChairCount":null,"TableFee":null,"TakeMoney":null,"OnLine":null,"OfflineTimesKick":null,"ShowPlayerName":null},"big_data":{},"agentType":"TG","isagent":0}' );
const cuz_bigData = JSON.parse( '{"tm":1623226890,"roomType":3,"act":[{"bet":1000,"ty":1,"time":0}],"att":[{"platform":10170,"win":false,"chip":100000,"gameNo":"50-1623226890-4578143-1","changes":-800,"take":1000,"lineCode":"lco4","name":"user#30","total":1000,"rid":214748364830,"aid":0,"validBet":1000,"pos":0}],"tableId":2000200000,"room":10001,"td":1623226890,"pub1":0.2,"dl":0,"gamesn":4578143}' )
options.big_data = cuz_bigData;

const xyzpParse = {};
xyzpParse.XYZP_RecordParse = function ( options ) {
	console.log( cuz_bigData )
	const equal = ' ';
	const split = ', '
	var result = "";
	var roomData = options.roomData;
	var big_data = options.big_data;
	if ( big_data ) {
		var act = big_data.act;
		// if (options.isagent != 1)
		//     result += JSON.stringify(act) + "\r\n\r\n";
		result += roomData.ServerName + "\r\n";
		result += $.i18n.prop( 'playerAcc' ) + equal + options.accounts + "\r\n";

		var att = big_data.att;
		var pub1 = big_data.pub1;  // 老版游戏结果
		var wlinfo = "";
		//玩家牌局信息
		for ( var i = 0; i < att.length; i++ ) {
			var chip = att[ i ][ "chip" ] ? parseFloat( att[ i ][ "chip" ] ) : 0;
			var validbet = att[ i ][ "validBet" ] ? parseFloat( att[ i ][ "validBet" ] ) : 0;
			var changes = att[ i ][ "changes" ] ? parseFloat( att[ i ][ "changes" ] ) : 0;

			chip = com.getRate( chip )
			validbet = com.getRate( validbet )
			changes = com.getRate( changes )

			result += $.i18n.prop( 'CarriedAmount' ) + equal + chip + "\r\n";
			wlinfo += $.i18n.prop( 'WinLossScoreOfThisSet' ) + equal + changes;
			if ( pub1 == 0 )
				wlinfo += split + $.i18n.prop( 'NotWinning' );
			else
				wlinfo += split + $.i18n.prop( 'DrawMultiple' ) + equal + pub1;
			wlinfo += split + $.i18n.prop( 'BetScore' ) + equal + validbet + "\r\n";
		}
		//玩家操作信息
		for ( var i = 0; i < act.length; i++ ) {
			var bet = act[ i ][ "bet" ] ? parseFloat( act[ i ][ "bet" ] ) : 0;
			var ty = act[ i ][ "ty" ] ? parseInt( act[ i ][ "ty" ] ) : 0;
			var time = act[ i ][ "time" ] || "";

			bet = com.getRate( bet )

			result += time ? $.i18n.prop( 'OpenForSeconds' ) + time + split : "";
			if ( ty == 1 ) {
				result += $.i18n.prop( 'Bet' );
				result += split + $.i18n.prop( 'Amount' ) + equal + bet;
			}
			result += "\r\n";
		}
		result += wlinfo + "\r\n";
	}
	return result;
}

console.log( xyzpParse.XYZP_RecordParse( options ) );