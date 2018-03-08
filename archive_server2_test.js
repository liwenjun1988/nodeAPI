'use strict';
var http = require('http');
var https = require('https');
var url = require('url');
var express = require('express');
var querystring = require('querystring');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

var app = express ();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', function(req, res) {
	console.log('body');
   console.log('body: ' + JSON.stringify(req.body));
   var receivedUrl = req.body.sendUrl;
   var data = querystring.stringify(req.headers);
   var parsedUrl = url.parse(receivedUrl);
   var port;
   if(!parsedUrl.port){
      port = (parsedUrl.protocol == 'https:')? 443 : 80;
   }
   else{
      port = parsedUrl.port;
   }
   var query_parameter = (!parsedUrl.query)? data: (parsedUrl.query + "&" + data);
   var options ={
      host: parsedUrl.hostname,
      port: port,
      path: parsedUrl.pathname + '?' + query_parameter,
     // path: parsedUrl.path + data,
      method: 'GET'
   };
      var callback = function(response) {
      var str = '';
      response.on('data', function(d){
        process.stdout.write(d);
        str += d;
     });
      response.on('end', function(){
        console.log(str);
      });
      res.setHeader('Content-Type', 'application/json');
      res.json({
      statusCode: response.statusCode,
      requestUrl: options,
      responseHeaders: response.headers
    })
    }

    var httpreq = (parsedUrl.protocol == 'https:')? https.request(options, callback) : http.request(options, callback);
    httpreq.on('error', function(e){
      console.error(e);
    });
    httpreq.end();
});

app.listen(port);
console.log('weather RESTful API server started on:' + port);

