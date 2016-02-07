var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

http.listen(8000, function(){
  console.log('listening on :8000');
});


var cs=[[0,'#ff0000'],[0,'#ff7200'],[0,'#f0ff00'],[0,'#00ff00'],[0,'#00ffff'],[0,'#0000ff'],[0,'#f000ff']];
var peoples=[];
for (var i = 0; i < 7; i++) {
  peoples[i]=[];
  //peoples[i][0]=i; //cs[i][1]
}
var randomChoice =[-1,-1,-1,-1,-1,-1,-1];

/*var colorcolumn=function(col,num){
  this.colindex=col;
  this.number=num;
  this.people=[];
}*/ 
//not good, coz u need 2 send the whole list of people every time instead of the one you need to use and it definitely is a waste of bandwith 


io.on('connect', function(socket){

  socket.on('colorchoice',function(msg){
    console.log('colorchoice:'+msg);
    rainbowcolor(msg);
    io.sockets.emit('colors',cs);
    
    //choose random people in the list
    for (var i = 0; i< peoples.length; i++) {
      console.log("peoplesi:"+peoples[i]);
      if (peoples[i].length>1){
        var randomnum=Math.round( Math.random()*peoples[i].length);
        console.log("peoples[i]:"+peoples[i]+","+randomnum+"color:"+cs[i][0]);
        randomChoice[i] = peoples[i][ Math.round( Math.random()*peoples[i].length) ] ;
      }else if( peoples[i].length==1 ){
        console.log("if only one peoplein the queue:"+ peoples[i]);
        randomChoice[i]=peoples[i][0];
      }
    }

    console.log("randomchoice: "+randomChoice); 

    io.sockets.emit('randomchoice',randomChoice);
  });//on colorchoice


  socket.on('deletepeer',function(peerdelete){
    var indexdelete = peerdelete[0]-1;
    for ( var i=0;i<peoples[indexdelete].length;i++ ){
      if (peoples[indexdelete][i]==peerdelete[1]){//delete
        peoples[indexdelete].spice(i,1);
        cs[indexdelete][0]--; // num of color--
      }
    }   
  });//peerdelete

  socket.on('restartall',function(){
    initvariables();
  });

  socket.on('ondrag',function(msg){
    console.log('ondrag:'+msg);
    //io.sockets.emit('colors',msg);
    socket.broadcast.emit('ondrag',msg); 
  });//on colorchoice

});//connect



function rainbowcolor(msg){
  //colors[num-1]++;
  var num = msg[0];
  cs[num-1][0]++;
  console.log(num+","+cs[num-1]);
  // for people list, not that without the first confusing one 
  peoples[num-1].push(msg[1]);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function initvariables(){
  cs=[[0,'#ff0000'],[0,'#ff7200'],[0,'#f0ff00'],[0,'#00ff00'],[0,'#00ffff'],[0,'#0000ff'],[0,'#f000ff']];
  peoples=[];
  for (var i = 0; i < 7; i++) {
    peoples[i]=[];
  }
  randomChoice =[-1,-1,-1,-1,-1,-1,-1];
}


