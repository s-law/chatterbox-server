var express = require('express');
// var cors = require('cors');
var app = express();
var fs = require('fs');
var path = require('path');

var dataStore = {
  results: []
};

var logPath = path.join(__dirname, './log.txt');

fs.readFile(logPath, function(err, data) {
  if (err) {
    throw err;
  }
  var dataToBeLoaded = data.toString().split('\n');
  for (var i = 0; i < dataToBeLoaded.length; i++) {
    dataToBeLoaded[i] = JSON.parse(dataToBeLoaded[i]);
  }
  dataStore.results = dataToBeLoaded;
});

app.use(express.static(__dirname + '/client'));

app.route('/classes/messages')
.get(function(req, res) {
  res.send(JSON.stringify(dataStore));
})
.post(function(req, res) {
  var dataHolder = '';
  req.on('data', function(data) {
    dataHolder += data;
  }).on('end', function() {
    dataStore.results.push(JSON.parse(dataHolder));
    fs.appendFile(logPath, '\n' + dataHolder, function (err) {});
    res.sendStatus(201);
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});