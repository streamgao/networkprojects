var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var wholeword=[];
var id = 0;
var color =[];

var h3mess = [];
var randomnames=['Alligator','Ant','April','Archie','Bashful','Bass','Bee','Bert','Betty Boop','Big Bird','Cheetah','Cricket','Crocodile','Cougar','Dolphin','Donatello','Dragonfly','Elmo','Firefly','Gazelle','Goldfish','Grasshopper','Hornet','Hummingbird','Jellyfish','Ladybug','Leonardo','Iron Man','Incredible Hulk','Mosquito','Moth'];


var people=function(id,name,color){
  this.score=0;
  this.id=id;
  this.NickName=name;
  this.color=color;
}

var peoples = [];

//var colors=[0,0,0,0,0,0,0];
var cs=[[0,'#ff0000'],[0,'#ff7200'],[0,'#f0ff00'],[0,'#00ff00'],[0,'#00ffff'],[0,'#0000ff'],[0,'#f000ff']];

//app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.get('/1', function(req, res){
  res.sendfile('1.html');
});
app.get('/2', function(req, res){
  res.sendfile('2.html');
});


http.listen(8080, function(){
  console.log('listening on :8080');
});


io.on('connect', function(socket){
  socket.on('session',function(msg){
    color=[ Math.floor(Math.random()*255),Math.floor(Math.random()*255), Math.floor(Math.random()*255) ];
    var iname = randomnames[getRandomInt(0,randomnames.length-1)];

    var p = new people(msg,iname,color);
    peoples.push(p);
    console.log('connection'+id+",name:"+iname);
  });

  socket.on('sessionName',function(msg){
      for( var i=0; i<peoples.length;i++ ){
        if( peoples[i].id == msg[0] ){ //if this session
          peoples[i].NickName=msg[1];
        }
      }
  });

  socket.on('restartall',function(){
    peoples=[];
  });


  socket.on('chat', function(msg){
      h3mess[0] = msg[1]; // the word
      for( var i=0; i<peoples.length;i++ ){
        if( peoples[i].id == msg[0] ){ //if this session
          h3mess[1]=peoples[i].color;

          if( wholeword.length>0 ){
            var last=wholeword[wholeword.length-1];

            if( last[last.length-1]==msg[1][0] )
                peoples[i].score += 10;
            else 
                peoples[i].score -= 10;
          }
        }
      }

      wholeword.push(msg[1]);
      io.emit('scores',peoples);
      io.sockets.emit('wholeword',h3mess);
  });//chat


  socket.on('colorchoice',function(msg){
    console.log('colorchoice:'+msg);
    rainbowcolor(msg);
    io.sockets.emit('colors',cs);
  });//colorchoice

});//connect



function rainbowcolor(num){
  //colors[num-1]++;
  cs[num-2][0]++;
  console.log(num+","+cs[num-2]);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}





