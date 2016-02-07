var my_stream = null;
var canvas; 
var lastchoice;
var peopleinchannel;
var randomchoice;

function displaymyvideo(width){  //width
	window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	if (navigator.getUserMedia) {
		navigator.getUserMedia({  video:true, audio:false}, function(stream) {
			my_stream = stream;
			var videoElement = document.getElementById('myvideo');
			//$('#myvideo').css({'width':'20%','height':$('#maincanvas').height()});
			
			videoElement.src = window.URL.createObjectURL(stream) || stream;
			console.log(videoElement);
			videoElement.play();

			setupPeer();

		}, function(err) {
			console.log('Failed to get local stream' ,err);
		});
	}	
}//displaymyvideo



var connect = false;
var socket = null; 

$('document').ready(function(){ // form submission event
	peopleinchannel = false;
	randomchoice = [];
	canvas = document.getElementById("maincanvas"); 

	var submissionBlock = document.getElementById('submission');
	
	displaymyvideo();

	$('form').submit(function(e){ // not #form2
	  	e.preventDefault();
	  	if (connect==true) {
	  		var site=[];
	  		site[0] = document.querySelector('input[name="site"]:checked').value;
	  		lastchoice = site[0];
	  		site.push(peer_id);
	  		socket.emit('colorchoice',site);
			// $('#submission').addClass('swipout');
			// $('#submission').offset({left:-2000});
			submissionBlock.style.left = "-30000px";
			$('#iconchoice').removeClass("hidden");
			$('#iconchoice').addClass("show");
			//$('#iconchoice').switchClass( "show", "hidden", 1000, "easeInOutQuad" );
		}else{
			console.log("connection Failed");
			window.alert("connection Failed");
		}
	});//form submit

	$('#iconchoice').click(function(){ //comment these by tuesday
		submissionBlock.style.left = "0px";
		$('#iconchoice').removeClass("show");	
		$('#iconchoice').addClass("hidden");
	});

	$('#restart').click(function(){ 
		socket.emit('restartall',function(){
		});
	});

});



function setupSocket() {
	socket = io().connect('http://localhost:8000/');

	socket.on('connect',function(){		
		connect = true;

		socket.on('colors',function(colors){ // when receive color submission
			console.log(colors);
			var cos=[]; cos[0]=0;  // coolor percentages
			var sum=0;
			var len= colors.length;
			for(var i =0; i<colors.length; i++){
				sum+=colors[i][0];
				cos[i]=sum;
			} 
			//console.log($('#maincanvas').width());
			//console.log(canvas.width);  //why $('#maincanvas').width() != canvas.width ??? 
			if (canvas.getContext){  
				var ctx = canvas.getContext("2d");         
				//define gradient type and range
				var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
				for(var i=0;i<len;i++){		
					if ( (cos[i]!=cos[i-1] && i>0) || i==0 ){
						gradient.addColorStop(cos[i]/sum,colors[i][1]); // percentage,color
						//align every video elements
						if(peopleinchannel==true && randomchoice[i]!==-1 ){ // if there is anybody in the channel,call video
							if(i==0){
								document.getElementById('videodiv0').style.width = Math.floor($('#maincanvas').width()*(cos[0])/sum);
								makeCall(randomchoice[0],0, $('#maincanvas').width()*(cos[0])/sum );
							}else{
								document.getElementById('videodiv'+i).style.width = Math.floor($('#maincanvas').width()*(cos[i]-cos[i-1])/sum);
								makeCall(randomchoice[i], i, $('#maincanvas').width()*(cos[i]-cos[i-1])/sum );	
							}
						}//ifpeopleinchannel
					}// if color is valid to display	 
					if (i == (lastchoice-1)) {
						//displaymyvideo($('#maincanvas').width()*(cos[i]-cos[i-1])/sum);
					}
				}//for
				ctx.fillStyle = gradient;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}//canvas
		});	//on colors	

		socket.on('randomchoice',function(ranchoice){//call peer id
			randomchoice = ranchoice;
			peopleinchannel = true;
		});//randomchoice 
	});//on connect

	socket.on('disconnect', function () {
		console.log('client disconnected');
		var peerdelete = [];
		peerdelete[0] = lastchoice;
		peerdelete[1] = peer_id;
		socket.emit('deletepeer',peerdelete);
	});

}//setupSocket()



var peer_id = null;
var peer = null;

function setupPeer() {
	peer = new Peer({host: '104.131.82.13', port: 9000, path: '/'});
	console.log("Hey.." + peer);

	// Get an ID from the PeerJS server		
	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		peer_id = id;
		//socket.emit('peerid',peer_id);
		setupSocket();
	});	

	peer.on('call', function(incoming_call) { //answer calls
		console.log("Got a call!");
		console.log(incoming_call);
		incoming_call.answer(my_stream); // Answer the call with our stream from getUserMedia
		incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
			//displaymyvideo();
		});
	});//peer.oncall

}//setupPeer

function makeCall(idToCall,videoid,videowidth) {
	var call = peer.call(idToCall, my_stream);

	call.on('stream', function(remoteStream) {
		console.log("Make Call Result: Got remote stream");
		var ovideoElement = document.getElementById('video'+videoid);
		ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
		ovideoElement.setAttribute("autoplay", "true");
		//ovideoElement.style.width=videowidth+'px !important';
		document.getElementById('videodiv'+videoid).style.width= videowidth+'px !important';

		ovideoElement.play();
		console.log('ovideoElement'+ovideoElement);
	});
}//makeCall






