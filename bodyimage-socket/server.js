var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

http.listen(8000, function(){
  console.log('listening on :8000');
});


io.on('connect', function(socket){

  socket.on('ondrag',function(msg){
    console.log('ondrag:'+msg);
    //io.sockets.emit('colors',msg);
    socket.broadcast.emit('ondrag',msg); 
  });//on colorchoice

});//connect

