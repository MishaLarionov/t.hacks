var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var restclient = require('node-rest-client').Client;
restclient = new restclient();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.listen(80, function(){
  console.log('listening on 80');
});
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  res.render('index');
});
app.post('/where', function(req, res) {
  var location = req.body.where;
});
