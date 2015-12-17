var connection;
var maincanvas,ctx;
var overlaycanvas, overlayctx;
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
var flowcursor;

var img;
var poster;

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

function initposter(){
  overlaycanvas = document.getElementById("overlaycanvas");
  overlayctx=overlaycanvas.getContext('2d');

  overlaycanvas.width=maincanvas.width;
  overlaycanvas.height = maincanvas.height;

  poster = new Image();
  poster.src='img/blemish.png';
  poster.width = overlaycanvas.width;
  poster.height = overlaycanvas.height;

  poster.onload= function(){
    overlayctx.drawImage(poster,0,0, poster.naturalWidth, poster.naturalHeight, 
                    0,0, maincanvas.width, maincanvas.height);
  };//onload
}



function initvariables(){
 	index = 1;
 	totalwiped = 0;
 	alreadyondata = false;


 	for(var i=0; i<7; i++){
	    imgs[i] = new Image();
		imgs[i].src='img/'+i+'.jpg';
    }
    imgs[0].width = maincanvas.width;
    imgs[0].height = maincanvas.height;
    imgs[0],onload = function(){
        ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
                   0,0,maincanvas.width, maincanvas.height);
    };

    dividenum = 12;
    brushsize = Math.ceil($('#maincanvas').width() / dividenum);   //50
    wipex = 0; wipey = 0;
	ratiox = maincanvas.width / $('#maincanvas').width();
	ratioy = maincanvas.height / $('#maincanvas').height();

    //init pix matrix
    initpixandwipe();
    console.log( "Size:"+pixmatrix.length+","+pixmatrix[0].length );
 }


var init = function() {   //receiver
	maincanvas = document.getElementById("maincanvas");
	maincanvas.height= $(window).height();
   	maincanvas.width = $(window).width();
    ctx = maincanvas.getContext("2d");
    flowcursor = document.createElement('div');
    flowcursor.setAttribute('id','flowcursor');
    document.getElementsByTagName('body')[0].appendChild(flowcursor);

    initvariables();
    initposter();
    setupSocket();
}; //init

$('document').ready(  init  );


var dragwipe = function(evtx, evty){
	wipex = Math.floor( evtx / brushsize );
	wipey = Math.floor( evty / brushsize );

	if ( totalwiped < 0.4 * pixmatrix.length * pixmatrix[0].length ) {  //current image
		if ( pixmatrix[wipex][wipey]==-1 ) { // if haven't draw this pixel
			totalwiped++;
			totalwiped = totalwiped% (pixmatrix.length * pixmatrix[0].length);
			pixmatrix[wipex][wipey] = 1;
		}//if haven't draw this pixel

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
        
        tmpCtx.drawImage(imgs[index], 
        	(evtx-brushsize*ratioimgy/8)*ratioimgx, (evty-brushsize*ratioimgy/8)*ratioimgy, 
        	brushsize*ratioimgx, brushsize*ratioimgy,
    	 	0,0, brushsize, brushsize);


        tmpCtx.closePath();
        tmpCtx.restore();
    	
    	ctx.drawImage( tmpcanvas, 0,0, brushsize, brushsize,
    	 	evtx-brushsize*ratioimgy/8, evty-brushsize*ratioimgy/8, brushsize, brushsize);

		}else{ //switch
				console.log("index++: "+index);
				index++;
				index = index % imgs.length;
				initpixandwipe();
		}//else change to next image
}//dragwipe



function setupSocket() {
	socket = io().connect('http://localhost:3000/');

	socket.on('connect',function(){		
		alreadyondata = true;

		socket.on('ondragsender',function(dragdata){ // when receive color submission
            console.log("ondragsender"+dragdata);
            console.log(dragdata[0]+320+"," +dragdata[1]);

			dragwipe( (dragdata[0]+320), dragdata[1] );
            var newx = dragdata[0]+320;
            var newy =  dragdata[1] ;
            flowcursor.style.left=newx-brushsize/4+"px";
            flowcursor.style.top=newy-brushsize/4+"px";
            //flowcursor.css({"left": newx+"px", "top":dragdata[1]+"px"});
		});	//on dragsender

        socket.on('nextlayer',function(indexdata){
            index=indexdata;
            initpixandwipe();
        });
	});//on connect

	socket.on('disconnect', function () {
		console.log('client disconnected');
		initpixandwipe();
		//socket.emit('disconnect');
	});
}//setupSocket()
