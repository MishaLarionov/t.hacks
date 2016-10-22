var Client = require('node-wolfram');
var Wolfram = new Client(process.env.WOLFRAM_KEY);

var request = require('request').defaults({ encoding: null })

var jpeg = require('jpeg-js');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var restclient = require('node-rest-client').Client;
restclient = new restclient();

function getCoords(input) {
  return(Wolfram.query(input + " coordinates", function(err, result) {
    if (err)
      console.log(err);
    else {
      if (result.queryresult.didyoumeans) {
        console.log("Did you mean: " + result.queryresult.didyoumeans.didyoumean.replace(' coordinates',''));
      } else {
        for(var a=0; a<result.queryresult.pod.length; a++) {
          var pod = result.queryresult.pod[a];
          if (pod.$.title == "Result") {
            coords = pod.subpod[0].plaintext[0].split(", ");
            console.log(coords);
            for (var i = 0; i < coords.length; i++) {
              coords[i] = coords[i].split(" ");
              for (var j = 0; j < coords[i].length; j++) {
                coords[i][j] = coords[i][j].replace(/\D/g,'');
                if (j == 0) {
                  if (i == 0) {
                    var formattedcoords = [];
                  }
                  formattedcoords[i] = parseInt(coords[i][j]);
                } else if (j == 1) {
                  formattedcoords[i] += parseInt(coords[i][j]) / 60;
                } else if (j == 2) {
                  formattedcoords[i] += parseInt(coords[i][j]) / 3600;
                }
              }
            }
            formattedcoords = formattedcoords.toString();
            console.log(formattedcoords);
            var redChannel, greenChannel, blueChannel;
            restclient.get("https://api.skywatch.co/data/time/2016-07/location/" + formattedcoords + "/source/landsat-8/level/3/cloudcover/0/band/red", {headers: {"x-api-key": process.env.SKYWATCH_KEY}}, function (data, response) {
              console.log(data);
              request.get(data[0].download_path, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  redChannel = new Buffer(body);
                }
              });
            });
            restclient.get("https://api.skywatch.co/data/time/2016-07/location/" + formattedcoords + "/source/landsat-8/level/3/cloudcover/0/band/green", {headers: {"x-api-key": process.env.SKYWATCH_KEY}}, function (data, response) {
              console.log(data);
              request.get(data[0].download_path, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  greenChannel = new Buffer(body);
                }
              });
            });
            restclient.get("https://api.skywatch.co/data/time/2016-07/location/" + formattedcoords + "/source/landsat-8/level/3/cloudcover/0/band/blue", {headers: {"x-api-key": process.env.SKYWATCH_KEY}}, function (data, response) {
              console.log(data);
              request.get(data[0].download_path, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  blueChannel = new Buffer(body);
                }
              });
            });
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
  getCoords(location);
});
