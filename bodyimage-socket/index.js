var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var connected = false;

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


var singleone = function(id, name, postername, ori, retouched){
    this.id=id;
    this.name=name;
    this.postername = postername;
    this.original = ori;
    this.retouched=retouched;
};
var peoples = [];
var send = [];


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
  });//on colorchoice
 
  socket.on('ondragsender',function(msg){
    console.log('ondragsender:'+msg);
    //io.sockets.emit('colors',msg);
    socket.broadcast.emit('ondragsender',msg); 
  });
  socket.on('nextlayer',function(msg){
    socket.broadcast.emit('nextlayer',msg); 
  });


  socket.on('receiveprofile',function(){
    console.log("ondrag");
  });//receiveprofile

  //if 2 devices connect to the same wifi, ip would be useless to distinguish them, change to one page applicaiton
  socket.on('choosePerson',function(whichone){
    console.log(socket.id);
    var clientIp = socket.request.connection.remoteAddress;
    console.log("chooseperson ip:",clientIp);

    setTimeout(function(){ 
        //io.sockets.connected[socket.id];
        if(io.engine === io.eio ){// => true
          console.log( Object.keys(io.engine.clients)  );
          //console.log( Object.keys(io.eio.clients)   );
          for (var i = 0; i< Object.keys(io.engine.clients).length ; i++) {
               console.log( io.sockets.connected[ Object.keys(io.engine.clients)[i] ]['handshake']['address']);
               if ( clientIp == io.sockets.connected[ Object.keys(io.engine.clients)[i] ]['handshake']['address'] ) {
                  console.log('whichone'+whichone);
                  io.sockets.connected[ Object.keys(io.engine.clients)[i] ].emit('choosePerson',whichone);
               }
          }//for
        }//if true

     }, 500);
    
     
  });//on chooseperson


    socket.on('disconnect', function () {
        connected = false;
    });

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

