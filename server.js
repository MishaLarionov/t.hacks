var Client = require('node-wolfram');
var Wolfram = new Client(process.env.WOLFRAM_KEY);

var request = require('request').defaults({ encoding: null })

var jpeg = require('jpeg-js');

var Jimp = require("jimp");

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var restclient = require('node-rest-client').Client;
restclient = new restclient();

function getCoords(input, res) {
  return(Wolfram.query(input + " coordinates", function(err, result) {
    if (err)
      console.log(err);
    else {
      console.log(result.queryresult);
      if (result.queryresult.didyoumeans) {
        console.log("Did you mean: " + result.queryresult.didyoumeans.didyoumean.replace(' coordinates',''));
      } else {
        for(var a=0; a<result.queryresult.pod.length; a++) {
          var pod = result.queryresult.pod[a];
          if (pod.$.title == "Result") {
            coord = pod.subpod[0].plaintext[0].split(", ");
            coords = [coord[1], coord[0]];
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
            var blueChannel;
            restclient.get("https://api.skywatch.co/data/time/2016/location/" + formattedcoords + "/source/landsat-8/level/1/cloudcover/5/band/green", {headers: {"x-api-key": process.env.SKYWATCH_KEY}}, function (data, response) {
              console.log(data);
              request.get(data[0].download_path, function (error, response, body) {
                console.log("downloaded");
                if (!error && response.statusCode == 200) {
                  console.log("200");
                  blueChannel = new Buffer(body);
                  console.log("buffered");
                  Jimp.read(blueChannel, function (err, image) {
                    console.log("read");
                    image.resize(1280, 720);
                    console.log("bam, resized");
                    res.write(image.getBuffer(Jimp.MIME_JPEG));
                    console.log("written");
                  });
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
  getCoords(location, res);
});
