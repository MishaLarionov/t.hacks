var express = require('express');
var app = express();

var restclient = require('node-rest-client').Client;
restclient = new restclient();

app.listen(80, function(){
  console.log('listening on 80');
});
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  res.render('index');
});
app.post('/where', function(req, res) {
  location = req.body.where;
});
app.use(express.static(__dirname + '/public'));
