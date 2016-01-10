var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var connected = false;


app.use(express.static(__dirname + '/public'));
//app.set('view engine', 'ejs');

// app.get('/wintershow.html',function(req,res){
//   console.log(req.ip);
// });


http.listen(3000, function(){
  console.log('listening on :3000');
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

  socket.on('choosePerson',function(whichone){
    //setTimeOut()
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
    setTimeout(function(){ 
        if(io.engine === io.eio ){// => true
        //   console.log( Object.keys(io.engine.clients)  );
        //   console.log( Object.keys(io.eio.clients)   );
          for (var i = 0; i< Object.keys(io.engine.clients).length ; i++) {
               console.log(io.sockets.connected[ Object.keys(io.engine.clients)[i] ]['handshake']['address']);
               if ( clientIp == io.sockets.connected[ Object.keys(io.engine.clients)[i] ]['handshake']['address'] ) {
                  console.log('whichone'+whichone);
                  io.sockets.connected[ Object.keys(io.engine.clients)[i] ].emit('choosePerson',whichone);
               }
          }//for
        }//if true
    }, 1000);
     
  });//on chooseperson



  socket.on('retouchdata',function(msg){
    console.log(peoples);
    //var single= new singleone(msg.id, msg.name, msg.original, msg.retouched);
    peoples.push(msg);
    socket.emit('receiveimagedata',peoples);
  });

  socket.on('requestinitimgs',function(d){
    socket.emit('requestinitimgs',peoples);
  });


  socket.on('requestwipeimgs',function(d){
    send=[];
    for(var i=d;i<peoples.length;i++ ){ // every time send 3 people's images = 6
        if(peoples[i]){
            send.push(peoples[i]);
        }
    }//for
    socket.emit('requestwipeimgs',send);
  });

  socket.on('eyeswindow',function(value){
    io.sockets.emit('eyeswindow',value);
  });


/*    // image message received...yeah some refactoring is required but have fun with it...
    socket.on('user image', function (msg) {
        var base64Data = decodeBase64Image(msg.imageData);
        console.log(base64Data);
        // if directory is not already created, then create it, otherwise overwrite existing image
        fs.exists(__dirname + "/" + msg.imageMetaData, function (exists) {
            if (!exists) {
                fs.mkdir(__dirname + "/" + msg.imageMetaData, function (e) {
                    if (!e) {
                        console.log("Created new directory without errors." + client.id);
                    } else {
                        console.log("Exception while creating new directory....");
                        throw e;
                    }
                });
            }//if exists
        });
        // write/save the image
        // TODO: extract file's extension instead of hard coding it
        fs.writeFile(__dirname + "/" + msg.imageMetaData + "/" + msg.imageMetaData + ".jpg", base64Data.data, function (err) {
            if (err) {
                console.log('ERROR:: ' + err);
                throw err;
            }
        });
        // I'm sending image back to client just to see and a way of confirmation. You can send whatever.
        socket.emit('user image', msg.imageData);
    });//on user image
*/
    socket.on('disconnect', function () {
        connected = false;
    });

});//connect


function findtheperson(){

}




//TODO: function to decode base64 to binary
function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}