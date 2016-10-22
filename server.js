var Client = require('node-wolfram');
var Wolfram = new Client(process.env.WOLFRAM_KEY);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var restclient = require('node-rest-client').Client;
restclient = new restclient();

function getCoords(input) {
  return(Wolfram.query(input + " coordinates", function(err, result) {
    if(err)
      console.log(err);
    else {
      if (result.queryresult.didyoumeans) {
        return("Did you mean: " + result.queryresult.didyoumeans.didyoumean.replace(' coordinates',''););
      } else {
        for(var a=0; a<result.queryresult.pod.length; a++) {
          var pod = result.queryresult.pod[a];
          if (pod.$.title == "Result") {
            return(pod.subpod.plaintext);
          }
        }
      }
    }
  }));
}

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
  var apiResult = getCoords(location);
  if (apiResult.startsWith("Did you mean")) {
    //Nothing worked
  } else {
    //It worked
  }
});
