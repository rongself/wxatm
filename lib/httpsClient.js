'use strict';

var urlParser  = require('url');
var queryString = require('querystring');
var Promise = require('promise');
var httpClient = require('https');

var HttpsClient = function (options) {}

HttpsClient.prototype = {
    get: function (url,params,callback) {
        var promise = new Promise(function (resolve, reject) {
            //@TODO reject() Timeout Control
            url = urlParser.parse(url);
            var path = url.pathname + '?' + queryString.stringify(params);
            var option = {
                host: url.host,
                port: '443',
                path: path,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            var request = httpClient.request(option, function (response) {
                response.setEncoding('utf8');
                response.on('data', function (data) {
                    if (typeof callback == 'function') {
                        callback(data,response);
                    }
                    resolve(data,response);
                });
            });
            request.end();

            request.on('error', function(e) {
                reject(e);
            });

        });
        return promise;
    }
}
module.exports = HttpsClient;