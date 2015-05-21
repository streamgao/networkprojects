var express = require('express');
var util = require('util');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var port = process.env.PORT || 5000;
var http = require('http');
var session = require('express-session');
var app = express();

var express = require('express');

//var anotherfile = require('./js/mss.js');

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}


app.use(express.static('public'));
app.use(allowCrossDomain);
app.set('view engine', 'ejs');



/* both the server and replica set level. 30 second connection timeout*/
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };       

/* Mongoose */
//process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test'
var mongodbUri='mongodb://heroku_app35722273:rkvlhlcmfjdn28fcm7hfjh362r@ds061721.mongolab.com:61721/heroku_app35722273';  
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri, options);
var db = mongoose.connection;


var aqiRecordModel  = require('./models/airquality');


db.on('error', function(error){
    console.log('Error connecting to Mongo: ',error);  //db.on('error', console.error.bind(console, 'connection error:'));
});

db.once('open', function(){
  console.log('Successfully connected to mongoose!');
});






/*____________url redirect begin_________________*/

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
  next();
 });

app.get('/',function(req,res){
  res.render('index');
});


app.get('/latest', function(req, res){
  /* select aqi from airquality order by _id DESC   */
  aqiRecordModel.find().sort( { date: -1 } ).limit(1)
  .exec( function(err,aqi){
    console.log(err);
    if(err) throw err;
    res.send( aqi[0] );
    console.log(aqi);
  });

});//get 2

app.get('/save/aqi=:airquality/temp=:temperature/date=:datetime',function(req,res){
  console.log("save");
  var aqiRead = req.params.airquality;
  var tempRead = req.params.temperature;
  var dateRead = req.params.datetime;

  var da= new Date(dateRead);
  console.log(dateRead);
  console.log(da);

  var aqiNew = new aqiRecordModel({
    aqi: aqiRead,
    temp:tempRead,
    date: new Date(),
  });

  console.log( new Date() );

  aqiNew.save(function(err){
    console.log('error:',err);
    console.log('aqi:',aqiNew);
    res.send('done');
  });

});


app.get('/history', function(req,res){
  aqiRecordModel.find({}).sort( { date: -1 } ).exec(function(err, aqhistory) {
    if(err) throw err;
    console.log(aqhistory);

    res.render('history', {histories: aqhistory, aqi:aqhistory.aqi, date:aqhistory.date});
  });
  
});

app.get('/historydata',allowCrossDomain, function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  aqiRecordModel.find({}).exec(function(err, aqhistory) {  //no date sort -1!!
    if(err) throw err;
    res.send(aqhistory);
  });
});

app.get('/graph',function(req,res){
  res.render('graph');
});

/*
app.post('/form', function(request, response){
  console.log('POST /form');
  console.log('request query: ', util.inspect(request.query));
  console.log('request body: ', util.inspect(request.body));

  var data = {query: request.query, body: request.body};

  response.send(util.inspect(data));
});
*/

app.listen(port, function(){
  console.log('app started on port',port);
});
/*____________url redirect_________________*/



