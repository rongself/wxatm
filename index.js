#!/usr/bin/env node
"use strict"
var http = require('http');
var express = require('express');
var AccessToken = require('./lib/accessToken');
var config = require('./config.json');
var storeFactory = require('./lib/store/factory');

var app = express();
var wxAppId = config.wxAppId;
var wxAppSecret = config.wxAppSecret;
var apps = config.auth.apps;
var token = new AccessToken(wxAppId,wxAppSecret,storeFactory.get(config.store || 'memory'));

token.refreshToken().then(
    function (data) {},
    function (err) {
        console.error(err);
    }
);

var Auth = {
    isValid: function (req) {

        if (!req.headers.authorization) return false;

        var encoded = req.headers.authorization.split(' ')[1];
        var decoded = new Buffer(encoded, 'base64').toString('utf8');
        var id = decoded.split(':')[0];
        var secret = decoded.split(':')[1];

        for (var i = 0; i < apps.length; i++) {
            if(id === apps[i].appId && secret === apps[i].appSecret){
                return true;
            }
        }

        return false;

    }

}


app.get('/access-token.json', function (req,res) {

    if (config.auth.enable !== false && !Auth.isValid(req)) {
        return res.sendStatus(401);
    }

    token.getToken().then(
        function (data) {
            res.json({accessToken:data});
        },
        function (err) {
            res.sendStatus(504);
            console.error(err);
        }
    );

});

app.post('/refresh', function (req,res) {

    if (config.auth.enable !==false && !Auth.isValid(req)) {
        return res.sendStatus(401);
    }

    token.refreshToken().then(
        function (data) {
            res.sendStatus(200);
        },
        function (err) {
            res.sendStatus(504);
            console.error(err);
        }
    );

});

var httpServer = http.createServer(app);
httpServer.listen(config.port || 80);
console.log('Http server started,port:'+ (config.port || 80));

//Handle https
if(config.https && config.https.enable === true){
    var fs = require('fs');
    var https = require('https');

    var privateKey  = fs.readFileSync(config.https.sslKey, 'utf8');
    var certificate = fs.readFileSync(config.https.sslCert, 'utf8');
    var credentials = {key: privateKey, cert: certificate};

    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(config.https.port || 443);
    console.log('Https server started,port:'+ (config.https.port || 443));
}