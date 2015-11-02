/**
 * Created by rongself on 2015/11/2.
 */
"use strict"
var Promise = require('promise');

var MemoryCache = function () {}
MemoryCache.prototype = {
    store:{},
    get: function (key) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.store[key]) {
                resolve(self.store[key]);
            }else{
                resolve(null);
            }
        });
    },

    set: function (key,value) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.store[key] = value;
            resolve(value);
        });
    }

}

module.exports = MemoryCache;

