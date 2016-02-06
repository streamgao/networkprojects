/**
 * Created by Stream Gao on 12/20/15.
 */
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var connected = false;
var os = require('os');

app.use(express.static(__dirname + '/public'));
//app.set(express.static(__dirname + '/public'));
// app.set('view engine', 'ejs');

// app.get('/wintershow/:option?',function(req,res){
//   console.log("run");
//   res.sendfile('wintershow.html');
//   // fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
//   //     res.send(text);
//   // });
//   res.render("index",{param:req.params.option})
// });
//{{param}}

http.listen(3000, function(){
  console.log('listening on :3000');
  GetLocalIPAddr();
});


// var singleone = function(id, name, postername, ori, retouched){
//     this.id=id;
//     this.name=name;
//     this.postername = postername;
//     this.original = ori;
//     this.retouched=retouched;
// };
// var peoples = [];
// var send = [];


io.on('connect', function(socket){
  connected = true;

  socket.on('requestip',function(){
    console.log(socket.id);
    var clientIp = socket.request.connection.remoteAddress;
    console.log("ip:"+clientIp+","+io.sockets.connected[socket.id]['handshake']['address']);

    io.sockets.connected[socket.id].emit('requestip',clientIp);
    //io.engine.clients[socket.id].emit('requestip',clientIp);
    //io.eio.clients[socket.id].emit('requestip',clientIp);
  });

  socket.on('ondrag',function(msg){
    socket.broadcast.emit('ondrag',msg); 
    console.log(msg);
    //io.sockets.emit('colors',msg);
  });//on colorchoice
 
  socket.on('nextlayerdone',function(msg){ 
    console.log('nextlayerdone'+msg);
    socket.broadcast.emit('nextlayerdone',msg);
    //io.emit('jump', data);
  });

  socket.on('hometocanvas',function(msg){
    console.log('hometocanvas'+msg);
    socket.broadcast.emit('hometocanvas',msg); 
  });

  socket.on('backtoslectmodel',function(msg){
    console.log('backtoslectmodel'+msg);
    socket.broadcast.emit('backtoslectmodel',msg); 
  });

  socket.on('finalselect',function(msg){
    console.log('finalselect'+msg);
    socket.broadcast.emit('finalselect',msg); 
  });

  socket.on('disconnect', function () {
    connected = false;
    socket.broadcast.emit('backtoslectmodel',1);//if the sender reload the page 
  });

  //if 2 devices connect to the same wifi, ip would be useless to distinguish them, change to one page applicaiton
  // socket.on('choosePerson',function(whichone){
  //   console.log(socket.id);
  //   var clientIp = socket.request.connection.remoteAddress;
  //   console.log("chooseperson ip:",clientIp);

  //   setTimeout(function(){ 
  //       if(io.engine === io.eio ){// => true
  //         console.log( Object.keys(io.engine.clients)  );
  //         for (var i = 0; i< Object.keys(io.engine.clients).length ; i++) {
  //              console.log( io.sockets.connected[ Object.keys(io.engine.clients)[i] ]['handshake']['address']);
  //              if ( clientIp == io.sockets.connected[ Object.keys(io.engine.clients)[i] ]['handshake']['address'] ) {
  //                 console.log('whichone'+whichone);
  //                 io.sockets.connected[ Object.keys(io.engine.clients)[i] ].emit('choosePerson',whichone);
  //              }
  //         }//for
  //       }//if true
  //    }, 500);
  // });//on chooseperson

});//connect


var IPv4,hostName;
function GetLocalIPAddr(){ 
    var os = require('os');

    hostName=os.hostname();
    for(var i=0;i<os.networkInterfaces().en0.length;i++){
        if(os.networkInterfaces().en0[i].family=='IPv4'){
            IPv4=os.networkInterfaces().en0[i].address;
        }
    }
    console.log('----------local IP: '+IPv4);
    console.log('----------local host: '+hostName);
} 

