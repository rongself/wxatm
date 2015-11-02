"use strict"
var Promise = require('promise');
var redis = require('redis');
var cache = redis.createClient();

var RedisCache = function () {

}

RedisCache.prototype = {

    get: function (key) {
        return new Promise(function (resolve, reject) {
            cache.hgetall(key,function(err,data){

                if(err){
                    reject(err);
                }

                if(typeof data === 'string'){
                    data = JSON.parse(data);
                }

                resolve(data)
            });
        });
    },
    
    set: function (key,value) {
        return new Promise(function (resolve, reject) {
            cache.hmset(key,value,function(err){

                if(err) reject(err);

                resolve(value);

            });
        });
    }

}

module.exports = RedisCache;
