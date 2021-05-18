function redisUtil ( redisClient ) {
	this.redisClient = redisClient;
}
/**
 * 过去所有的key
 */
redisUtil.prototype.getKeys = function ( key, callback ) {
	this.redisClient.keys( key.toString(), callback );
};
/**
 * 根据key值获取缓存
 * @param key
 * @param callback
 */
redisUtil.prototype.get = function ( key, callback ) {
	this.redisClient.get( key.toString(), callback );
};
/**
 * 保存数据
 * @param key
 * @param value
 * @param expiration 过期时间(单位：秒)
 */
redisUtil.prototype.set = function ( key, value, expiration ) {
	this.redisClient.set( key.toString(), value.toString() );
	if ( expiration ) {
		this.redisClient.expire( key.toString(), expiration );
	}
};
/**
 * 根据key值获取缓存
 * @param key
 * @param field
 * @param callback
 */
redisUtil.prototype.hget = function ( key, field, callback ) {
	this.redisClient.hget( key.toString(), field.toString(), callback );
};
/**
 * 根据key值获取缓存
 * @param key
 * @param callback
 */
redisUtil.prototype.hgetall = function ( key, callback ) {
	this.redisClient.hgetall( key.toString(), callback );
};
/**
 * 保存数据
 * @param key
 * @param value
 * @param field
 * @param callback
 */
redisUtil.prototype.hset = function ( key, field, value, callback ) {
	this.redisClient.hset( key.toString(), field.toString(), value.toString(), ( err, res ) => {
		if ( err ) {
			console.error( err );
		}
		if ( callback ) {
			callback( err, res );
		}
	} );
};
/**
 * 保存数据
 * @param key
 * @param kvList
 * @param callback 过期时间(单位：秒)
 */
redisUtil.prototype.hmset = function ( key, kvList, callback ) {
	this.redisClient.hmset( key.toString(), kvList, ( err, res ) => {
		if ( err ) {
			console.error( err );
		}
		if ( callback ) {
			callback( err, res );
		}
	} );
};
/**
 * 從list的尾端推入一個element
 * @param key
 * @param element
 * @param callback
 */
redisUtil.prototype.rpush = function ( key, element, callback ) {
	this.redisClient.rpush( key.toString(), element, callback );
};
/**
 * 從list的開頭取出第一個element
 * @param key
 * @param callback
 */
redisUtil.prototype.lpop = function ( key, callback ) {
	this.redisClient.lpop( key.toString(), callback );
};
/**
 * 根据key值删除
 * @param key
 */
redisUtil.prototype.del = function ( key ) {
	this.redisClient.del( key.toString(), ( err, res ) => {
		if ( err ) {
			console.error( err );
		}
	} );
};
/**
 * 根据key值删除
 * @param key
 * @param field
 */
redisUtil.prototype.hdel = function ( key, field ) {
	this.redisClient.hdel( key.toString(), field.toString(), ( err, res ) => {
		if ( err ) {
			console.error( err );
		}
	} );
};
module.exports = redisUtil;
