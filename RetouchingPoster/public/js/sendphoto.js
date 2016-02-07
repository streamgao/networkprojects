// This is important, the io.connect has to point where socket server
// is running - simple but took me while to connect the periods/dots/slashes...it's weekend, what am I doing?
var socket = io.connect('http://localhost:3000');

// image related socket
socket.on('user image', function(m){
    $('#imageReceivedMessage').text("> "+m);
    $('#imageSentFromServer').attr('src', m);
});

socket.on('connect', function(id){
  $('#status').text('Connected');
});
socket.on('setID', function(myID) {
    console.log('receive id: ' + myID)
    $('#IDReceivedMessage').text(myID)
});
socket.on('message', function(m){
  $('#message').text("> "+m);
});
socket.on('disconnect', function(){
  $('#status').text('Disconnected');
});
socket.on('customEvent', function(message) {
	$('#customEvent').text(">> "+message['time']);
});


