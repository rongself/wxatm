'use strict';

var Promise = require('promise');
var https = require('./httpsClient');
var client = new https();

function _extends (obj1, obj2) {
    var obj = obj1
    if(typeof obj2 === 'object'){
        for(var key in obj2){
            obj[key] = obj2[key];
        }
    }
    return obj;
}

var AccessToken = function (appId, appSecret,store,options) {
    var defaultOptions = {
        key:'wx:token:'+appId,
        expireOffset:900
    }
    options = _extends(defaultOptions,options);

    if (typeof store !== 'object') throw new Error('arg store must be a object');
    if (typeof store.get !== 'function') throw new Error('store object must implement get function');
    if (typeof store.set !== 'function') throw new Error('store object must implement set function');

    this.cache = store;
    this.uri = 'https://api.weixin.qq.com/cgi-bin/token';
    this.params = {
        grant_type:'client_credential',
        appid:appId,
        secret:appSecret
    };
    this.key = options.key;
    this.expireOffset = options.expireOffset;

}

AccessToken.prototype = {

    getToken: function (appId, appSecret) {
        var self = this;
        if(appId) self.params.appid = appId;
        if(appSecret) self.params.secret = appSecret;

        return new Promise(function (resolve, reject) {
            self.getCache().then(function (data) {
                var now = parseInt(Date.now()/1000);
                if(data || (data&&now < data.expires_time)){
                    console.log('token form cache:' + self.key);
                    resolve(data.access_token);
                }else{
                    self.refreshToken().then(
                        function (data) {
                            resolve(data);
                        },
                        function (err) {
                            reject(err);
                        }
                    );
                }
            });
        });

    },

    refreshToken: function (appId, appSecret) {
        var self = this;
        if(appId) self.params.appid = appId;
        if(appSecret) self.params.secret = appSecret;

        return new Promise(function (resolve, reject) {
            client.get(self.uri,self.params).then(function (data) {

                if(typeof data === 'string'){

                    data = JSON.parse(data);

                }

                if (data.errcode) {

                    reject(data.errcode + ':' + data.errmsg);

                }else{

                    var time = new Date();
                    data['create_time'] = parseInt(time.getTime()/1000);
                    data['expires_time'] = data.create_time + data.expires_in - self.expireOffset;
                    self.setCache(data);
                    console.log('token refresh');
                    resolve(data);

                }
            },function(err){
                reject(err);
            });
        });
    },

    getCache: function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.cache.get(self.key).then(function(data){

                if(typeof data === 'string'){
                    data = JSON.parse(data);
                }

                resolve(data)
            });
        });
    },

    setCache: function (data) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.cache.set(self.key,data).then(function(err){

                if(err) reject(err);

                resolve(data);

            });
        });
    }
}

module.exports = AccessToken;
