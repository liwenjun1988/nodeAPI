var express = require('express'),
    router = express.Router(),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Task = require('./api/models/tempModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tempdb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/tempRoutes');
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

var http = require('http');
var https = require('https');
//1. 
var emp = {};
var city = "";
//2.
var extServerOptions = {
    host: 'api-dev.cbinsights.com',
    port: '443',
    path: '/api/1/company/info?ids=15529',
    method: 'GET'
};

//3.
function get() {
    https.request(extServerOptions, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            emp = JSON.parse(data);
            console.log(JSON.stringify(data));
//            postData(emp.main.temp, emp.name);
        });
 
    }).end();
};
 
get();
 
console.log("Doing the Post Operations....");
//4

function postData(temp, city){

var cityTemperature = JSON.stringify({
   'temperature' : temp,
   'city': city
});
 
 
//5
var extServerOptionsPost = {
    host: 'localhost',
    port: '3000',
    path: '/temp',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
        //'Content-Length': temp.length
    }
};
 
 
//6
var reqPost = http.request(extServerOptionsPost, function (res) {
    console.log("response statusCode: ", res.statusCode);
    res.on('data', function (data) {
        console.log('Posting Result:\n');
        process.stdout.write(data);
        console.log('\n\nPOST Operation Completed');
    });
});

// 7
reqPost.write(cityTemperature);

reqPost.end();
reqPost.on('error', function (e) {
    console.error(e);
});

}

 
//get();
