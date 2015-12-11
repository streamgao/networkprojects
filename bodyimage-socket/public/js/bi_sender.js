var connection;
var maincanvas,ctx;
var imgs = [];
var fakecanvas =[];
var fakectx = [];
var pixmatrix = [];
var brushsize, dividenum;
var wipex, wipey;
var index = 1;
var totalwiped;
var ratiox = 1;
var ratioy = 1;
var ratioimgx = 1;
var ratioimgy = 1;
var mousedown, touchdown;
var alreadyondata = false;
var ratioscreenx=1;
var ratioscreeny=1;

var tsscreenwidth=580;
var tsscreenheight=615;

var img;

function initpixandwipe(){
	totalwiped = 0;
	for(var i=0;i<dividenum;i++){
    	pixmatrix[i] = [];
    	for (var j = 0; j < Math.floor( $('#maincanvas').height()*dividenum/$('#maincanvas').width() ); j++) {
    		pixmatrix[i][j] = -1;
    	}
    }
    console.log("initpixandwipe");
}

function initvariables(){
 	index = 1;
 	totalwiped = 0;
 	alreadyondata = false;


 	for(var i=0; i<7; i++){
	    imgs[i] = new Image();
		imgs[i].src='touchscreenimg/'+i+'.jpg';
   	   
    }
    document.body.appendChild(imgs[0]);
    imgs[0].width = maincanvas.width;
    imgs[0].height = maincanvas.height;
    ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
    	0,0,maincanvas.width, maincanvas.height);


    dividenum = 5;
    brushsize = Math.ceil($('#maincanvas').width() / dividenum);   //50
    wipex = 0; wipey = 0;
	ratiox = maincanvas.width / $('#maincanvas').width();
	ratioy = maincanvas.height / $('#maincanvas').height();

	ratioscreenx = tsscreenwidth/maincanvas.width;
	ratioscreeny = tsscreenheight/maincanvas.height;

    //init pix matrix
    initpixandwipe();
    console.log( "Size:"+pixmatrix.length+","+pixmatrix[0].length );
 }


var init = function() {   //receiver
	maincanvas = document.getElementById("maincanvas");
	maincanvas.height= $(window).height();
   	maincanvas.width = $(window).width();
    ctx = maincanvas.getContext("2d");

    initvariables();
    setupSocket();

   	maincanvas.addEventListener('mousedown', function(){mousedown =true;});
  	maincanvas.addEventListener('mouseup', function(){mousedown =false;});
    maincanvas.addEventListener('mousemove', function(e){
    	if (mousedown) { 
    		if( alreadyondata ){
    			var data = [e.clientX*ratioscreenx, e.clientY*ratioscreeny];
    			socket.emit('ondragsender',data);
    			dragwipe(e.clientX, e.clientY); 
    		}else{//if not connecting to peers
				console.log("haven't connect to anyone!");
			}
    	}//if draging, else do nothing 
    });//mousemove

    /*for mobile*/
    maincanvas.addEventListener('touchstart', function(){touchdown =true;});
  	maincanvas.addEventListener('touchend', function(){touchdown =false;});
  	maincanvas.addEventListener('touchmove', function(e){
  		touchdown = true;
  		e.preventDefault(); 
    	if (touchdown) { 
    		if( alreadyondata ){
    			var data = [e.pageX*ratioscreenx, e.pageY*ratioscreeny];
    			socket.emit('ondragsender',data);
    			dragwipe(e.pageX, e.pageY); 
    		}else{//if not connecting to peers
				console.log("haven't connect to anyone!");
			}
    	}//if draging, else do nothing 
    });//mousemove


}; //init

$('document').ready(  init  );


var dragwipe = function(evtx, evty){
		wipex = Math.floor( evtx / brushsize );
		wipey = Math.floor( evty / brushsize );

		if ( totalwiped < 0.8 * pixmatrix.length * pixmatrix[0].length ) {  //current image
			if ( pixmatrix[wipex][wipey]==-1 ) { // if haven't draw this pixel
				totalwiped++;
				totalwiped = totalwiped% (pixmatrix.length * pixmatrix[0].length);
				pixmatrix[wipex][wipey] = 1;
			}

			ctx.globalAlpha = 1;

			ratioimgx = imgs[index].naturalWidth / maincanvas.width; //naturalHeight
			ratioimgy = imgs[index].naturalHeight / maincanvas.height;


			var tmpcanvas = document.createElement('canvas');
			var tmpCtx = tmpcanvas.getContext('2d');

			tmpCtx.save();
		    tmpCtx.beginPath();
		    tmpCtx.arc(brushsize*ratioimgy/4, brushsize*ratioimgy/4, brushsize*ratioimgy/4, 0, Math.PI * 2);
		    tmpCtx.closePath();
		    tmpCtx.clip();

		   //  tmpCtx.drawImage(imgs[index], evtx*ratioimgx+brushsize*ratioimgy/4, evty*ratioimgy+brushsize*ratioimgy/4, 
		   //  	brushsize*ratioimgx, brushsize*ratioimgy,
			 	// 0,0, brushsize*ratiox, brushsize*ratioy);
		    
		    tmpCtx.drawImage(imgs[index], 
		    	(evtx-brushsize*ratioimgy/4)*ratioimgx, (evty-brushsize*ratioimgy/4)*ratioimgy, 
		    	brushsize*ratioimgx, brushsize*ratioimgy,
			 	0,0, brushsize, brushsize);


		    tmpCtx.closePath();
		    tmpCtx.restore();
			
			ctx.drawImage( tmpcanvas, 0,0, brushsize, brushsize,
			 	evtx-brushsize*ratioimgy/4, evty-brushsize*ratioimgy/4, brushsize, brushsize);


		}else{ //switch
			console.log("index++: "+index);
			index++;
			index = index % imgs.length;
			initpixandwipe();
			if (alreadyondata==true) {
				socket.emit('nextlayer',index);
			}
		}//else change to next image
}//dragwipe



function setupSocket() {
	socket = io().connect('http://localhost:3000/');

	socket.on('connect',function(){		
		alreadyondata = true;

		socket.on('ondrag',function(dragdata){ // when receive color submission
			dragwipe( dragdata[0], dragdata[1] );
		});	//on colors	
	});//on connect

	socket.on('disconnect', function () {
		console.log('client disconnected');
		initpixandwipe();
		//socket.emit('disconnect');
	});
}//setupSocket()
