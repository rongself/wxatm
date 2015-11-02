/**
 * Created by rongself on 2015/11/2.
 */
"use strict"
module.exports.get = function (type) {
    switch(type){
        case 'redis':
            var RedisCache = require('./redis');
            return new RedisCache();
            break;
        case 'memory':
            var Memory = require('./memory');
            return new Memory();
            break;
        default:
            break;
    }
    return false;
}
