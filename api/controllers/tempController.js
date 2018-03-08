'use strict';


var mongoose = require('mongoose'),
  Temp = mongoose.model('Temps');
var http = require('http');

function getTemp(city, response){
var emp = {};
var dynamicPath = '/data/2.5/weather?q=' + city + '&APPID=b14ad5675d346d0c48e5814506bb7ea1&units=metric';
var extServerOptions = {
    host: 'api.openweathermap.org',
    port: '80',
    path: dynamicPath,
    method: 'GET'
};
function get() {
    http.request(extServerOptions, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            emp = JSON.parse(data);
            console.log(emp.main.temp);
            postData(emp.main.temp, city, response);
        });
 
    }).end();
};
 
get();
 
 
console.log("Doing the Post Operations....");
}

function postData(temp, city, response){

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
response.json(cityTemperature);

}

exports.list_all_temp = function(req, res) {
  Temp.find({}, function(err, temp) {
    if (err)
      res.send(err);
    res.json(temp);
  });
};


exports.create_a_temp = function(req, res) {
  var new_temp = new Temp(req.body);
  new_temp.save(function(err, temp) {
    if (err)
      res.send(err);
    res.json(temp);
  });
};


exports.read_a_temp = function(req, res) {
  Temp.find({city: req.params.city}, function(err, temp) {
    if (err){
      res.send(err);
    }
    if(temp.length !== 0){
       res.json(temp);
       console.log(temp);
    }else{
      console.log("nocity");
      getTemp(req.params.city, res);

    }  

  });
};


exports.update_a_temp = function(req, res) {
  Temp.findOneAndUpdate({city: req.params.city}, req.body, {new: true}, function(err, temp) {
    if (err)
      res.send(err);
    res.json(temp);
  });
};


exports.delete_a_temp = function(req, res) {


  Temp.remove({
    city: req.params.city
  }, function(err, temp) {
    if (err)
      res.send(err);
    res.json({ message: 'Temp successfully deleted' });
  });
};