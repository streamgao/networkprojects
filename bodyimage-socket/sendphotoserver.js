var http = require('http'),
    io = require('socket.io'),
    sys = require('sys'),
    express = require('express'),
    fs = require('fs');

var port = 8000;



var app = express();
app.use(express.static(__dirname + '/public'));

// http.listen(3000, function(){
//   console.log('listening on :3000');
// });


// //app.use(express.errorHandler({showStack: true, dumpExceptions: true}));

var socket = io.listen(http.createServer(app).listen(port));
sys.log('Server started. Listening on http://localhost:' + port + '/')

// connection message/event is received
socket.sockets.on('connection', function (client) {
    var connected = true;

    // never mind this. Just poking around.
    client.emit('setID', client.id);

    // image message received...yeah some refactoring is required but have fun with it...
    client.on('user image', function (msg) {
        var base64Data = decodeBase64Image(msg.imageData);
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
            }
        })

        // write/save the image
        // TODO: extract file's extension instead of hard coding it
        fs.writeFile(__dirname + "/" + msg.imageMetaData + "/" + msg.imageMetaData + ".jpg", base64Data.data, function (err) {
            if (err) {
                console.log('ERROR:: ' + err);
                throw err;
            }
        });
        // I'm sending image back to client just to see and a way of confirmation. You can send whatever.
        client.emit('user image', msg.imageData);
    });

    client.on('message', function (m) {
    });

    client.on('disconnect', function () {
        connected = false;
    });


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
});

