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
var ratioimgs = 1;
var ratioimgy = 1;
var mousedown;
var alreadyondata = false;

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
		imgs[i].src='img/'+i+'.jpg';
   	    
   	    //for method 3
   	    /*fakecanvas[i] = document.createElement('canvas');
		fakecanvas[i].width = 5*maincanvas.width;
		fakecanvas[i].height = 5*maincanvas.height;
		fakectx[i] = fakecanvas[i].getContext("2d");

  		imgs[i].onload = function(){
  			fakectx[i].drawImage(imgs[i],0,0,imgs[i].width, imgs[i].height);
  		};*/
    }
    document.body.appendChild(imgs[0]);
    ctx.drawImage(imgs[0], 0, 0);

    // imgs[0].onload = function() {
    //    ctx.drawImage(fakecanvas[0], 0, 0,maincanvas.width, maincanvas.height);
    // };
    
    //init brushsize and pix cutting unit
    dividenum = 15;
    brushsize = $('#maincanvas').width() / dividenum;   //50
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
   	maincanvas.width = $(window).width();;
    ctx = maincanvas.getContext("2d");

    initvariables();
    setupSocket();

   	maincanvas.addEventListener('mousedown', function(){mousedown =true;});
  	maincanvas.addEventListener('mouseup', function(){mousedown =false;});
    maincanvas.addEventListener('mousemove', function(e){
    	if (mousedown) { 
    		if( alreadyondata ){
    			var data = [e.clientX, e.clientY];
    			socket.emit('ondrag',data);

    			dragwipe(e.clientX, e.clientY); 
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


		ratioimgx = imgs[index].naturalWidth / $('#maincanvas').width(); //naturalHeight
		ratioimgy = imgs[index].naturalHeight / $('#maincanvas').height();
		//console.log(ratioimgx+'ratioimgx '+ratioimgy);

		if ( totalwiped < 0.8 * pixmatrix.length * pixmatrix[0].length ) {  //current image
				if ( pixmatrix[wipex][wipey]==-1 ) { // if haven't draw this pixel
					totalwiped++;
					totalwiped = totalwiped% (pixmatrix.length * pixmatrix[0].length);
					pixmatrix[wipex][wipey] = 1;
				}
				//ctx.clearRect(evtx*ratiox, evty*ratioy, brushsize*ratiox, brushsize*ratioy);

//method 1:
/*var downsampletime = 100;
var quacanvas = document.createElement('canvas');
quacanvas.width = downsampletime*brushsize*ratiox;
quacanvas.height = downsampletime*brushsize*ratioy;
var quactx = quacanvas.getContext("2d");

quactx.drawImage(imgs[index], evtx*ratioimgx, evty*ratioimgy, brushsize*ratioimgx, brushsize*ratioimgy,
	0,0, downsampletime*brushsize*ratiox, downsampletime*brushsize*ratioy);

ctx.drawImage( quacanvas, 0,0, downsampletime*brushsize*ratiox, downsampletime*brushsize*ratioy,
						evtx*ratiox, evty*ratioy, brushsize*ratiox, brushsize*ratioy);
*/

//method 2:
	ctx.drawImage( imgs[index], 
     	 evtx*ratioimgx, evty*ratioimgy, brushsize*ratioimgx, brushsize*ratioimgy,
		 evtx*ratiox, evty*ratioy, brushsize*ratiox, brushsize*ratioy);

//method 3:
		// ctx.drawImage( fakecanvas[index], evtx*ratioimgx, evty*ratioimgy, brushsize*ratioimgx, brushsize*ratioimgy,
		//  evtx*ratiox, evty*ratioy, brushsize*ratiox, brushsize*ratioy);

		}else{ //switch
				console.log("index++: "+index);
				index++;
				index = index % imgs.length;
				initpixandwipe();
		}//else change to next image
}//dragwipe



function setupSocket() {
	socket = io().connect('http://localhost:8000/');

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
