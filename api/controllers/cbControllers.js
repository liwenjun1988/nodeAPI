'use strict';


var mongoose = require('mongoose'),
  Temp = mongoose.model('Companies');
var http = require('http');
var https = require('https');

function getTemp(ids, response){
var emp = {};
var dynamicPath = '/api/1/company/info?ids=' + ids;
console.log("dynamicPath: " + dynamicPath);
var extServerOptions = {
    host: 'api-dev.cbinsights.com',
    port: '443',
    path: dynamicPath,
//    path: '/api/1/company/info?ids=' + ids,
    method: 'GET'
};
function get() {
    https.request(extServerOptions, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
           console.log("original data is : " + data);

            emp = JSON.parse(data);
            console.log("emp is + " + typeof emp);
            console.log(emp[0]);
            postData(emp[0].idCompany, emp[0].company, emp[0].address, emp[0].description, emp[0].logo, ids, response);
        });
 
    }).end();
};
 
get();
 
 
console.log("Doing the Post Operations....");
}

function postData(idCompany, company, address, description, logo, ids, response){

var cityTemperature = JSON.stringify({
   'idCompany' : idCompany,
   'company': company,
   'address': address,
   'description': description,
   'logo': logo
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
var reqPost = https.request(extServerOptionsPost, function (res) {
    console.log("response statusCode: ", res.statusCode);
    res.on('data', function (data) {
//        console.log('Posting Result:\n');
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
      getTemp(req.params.companyid, res);

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