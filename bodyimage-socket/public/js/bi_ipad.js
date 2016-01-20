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
var flowcursor;

var img;
var pathimg;


/*-------------------inits-------------------*/
function initpixandwipe(){
	totalwiped = 0;
	for(var i=0;i<dividenum; i++){
    	pixmatrix[i] = [];
    	for (var j = 0; j < Math.ceil( $('#maincanvas').height()*dividenum/$('#maincanvas').width() ); j++) {
    		pixmatrix[i][j] = -1;
    	}
    }
    console.log( pixmatrix );
}


function initvariables(){
	maincanvas = document.getElementById("maincanvas");
   	maincanvas.width = $(window).width();
	maincanvas.height= $(window).height();
    ctx = maincanvas.getContext("2d");

 	index = 1;
 	totalwiped = 0;
 	alreadyondata = false;

    dividenum = 7;
    brushsize = Math.ceil(maincanvas.width/ dividenum)+10;   //50
    wipex = 0; wipey = 0;
	ratiox = maincanvas.width / $('#maincanvas').width();
	ratioy = maincanvas.height / $('#maincanvas').height();
 }


function initcursor () {
	flowcursor = document.createElement('div');
    flowcursor.setAttribute('id','flowcursor');

    flowcursor.style.width=brushsize*0.8+"px";
    flowcursor.style.height=brushsize*0.8+"px";
    document.getElementsByTagName('body')[0].appendChild(flowcursor);
}

function initimage(pathi){
	for(var i=0; i<3; i++){
	    imgs[i] = new Image();
	    var path = pathi + i;
		imgs[i].src='touchscreenimg/'+path+'.jpg';
	}
	console.log(imgs[0]);
    imgs[0].width = maincanvas.width || $(window).width();
    imgs[0].height = maincanvas.height || $(window).height();
    imgs[0].onload = function(){
        ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
               0,0,maincanvas.width, maincanvas.height);
    };
}//initimages

function init() {   //receiver
    setupSocket();

    initvariables();
    initmodels();
    initcursor();
    initpixandwipe();//init pix matrix

	/*-------------------touch events-------------------*/  
	maincanvas.addEventListener('mousedown', function(){ mousedown =true;} );
  	maincanvas.addEventListener('mouseup', function(){ mousedown =false;} );
    maincanvas.addEventListener('mousemove', function(e){ e.preventDefault(); 
  		mousedown = true; eventmove(e.clientX, e.clientY, mousedown); });//mousemove


    maincanvas.addEventListener('touchstart', function(e){e.preventDefault(); touchdown =true; });
  	maincanvas.addEventListener('touchend', function(e){e.preventDefault(); touchdown =false;});
  	maincanvas.addEventListener('touchmove', function(e){ e.preventDefault(); 
  		touchdown = true; eventmove(e.pageX, e.pageY, touchdown); });//touchmove

  	flowcursor.addEventListener('touchstart', function(e){	e.preventDefault(); touchdown =true;});
  	flowcursor.addEventListener('touchend', function(e){	e.preventDefault();touchdown =false;});
    flowcursor.addEventListener('touchmove', function(e){	e.preventDefault(); 
	  	//touchdown = true; 
	  	eventmove(e.pageX, e.pageY, touchdown); });//mousemove
}; //init


$('document').ready(  init  );


function eventmove(xx,yy,down){
	var x = xx;
	var y = yy;
	if (down==true) { 
		if( alreadyondata ){
			var data = [x*ratioscreenx, y*ratioscreeny];
			socket.emit('ondragsender',data);
			dragwipe(x, y); 
			dragflowcursor(x, y);
		}else{//if not connecting to peers
			console.log("haven't connect to anyone!");
		}
	}//if draging, else do nothing
}


var dragwipe = function(evtx, evty){
		wipex = Math.floor( evtx / brushsize );
		wipey = Math.floor( evty / brushsize );

		if ( totalwiped < 0.7 * pixmatrix.length * pixmatrix[0].length ) {  //current image
			if ( pixmatrix[wipex][wipey]==-1 ) { // if haven't draw this pixel
				totalwiped++;
				//totalwiped = totalwiped% (pixmatrix.length * pixmatrix[0].length);
				pixmatrix[wipex][wipey] = 1;
				progressbars();
			}

			ctx.globalAlpha = 1;
			ratioimgx = imgs[index].naturalWidth / maincanvas.width; //naturalHeight
			ratioimgy = imgs[index].naturalHeight / maincanvas.height;

			var tmpcanvas = document.createElement('canvas');
			var tmpCtx = tmpcanvas.getContext('2d');
			tmpCtx.save();
		    tmpCtx.beginPath();
		    tmpCtx.arc(brushsize*ratioimgy/4, brushsize*ratioimgy/4, brushsize*ratioimgy/4, 0, Math.PI*2);
		    tmpCtx.closePath();
		    tmpCtx.clip();
		   //  tmpCtx.drawImage(imgs[index], evtx*ratioimgx+brushsize*ratioimgy/4, evty*ratioimgy+brushsize*ratioimgy/4, 
		   //  	brushsize*ratioimgx, brushsize*ratioimgy,
			 	// 0,0, brushsize*ratiox, brushsize*ratioy);
			tmpCtx.drawImage(imgs[index], 
				(evtx-brushsize*ratioimgy/8)*ratioimgx, (evty-brushsize*ratioimgy/8)*ratioimgy, 
				brushsize*ratioimgx, brushsize*ratioimgy, 0,0, brushsize, brushsize);

		    tmpCtx.closePath();
		    tmpCtx.restore();
			
			ctx.drawImage( tmpcanvas, 0,0, brushsize, brushsize,
	 	   			evtx-brushsize*ratioimgx/8, evty-brushsize*ratioimgy/8, brushsize, brushsize);
		}else{ //switch
			console.log("index++: "+index);
			nextbar();
			index++;
			index = index % imgs.length;
			initpixandwipe();

			if (alreadyondata==true) {
				socket.emit('nextlayer',index);
			}
			if(index == 0){
	            console.log("last one");
	            finishcompare();
	        }
		}//else change to next image

}//dragwipe



function dragflowcursor(dragdata0, dragdata1){
    var newx = dragdata0;
    var newy =  dragdata1;
    flowcursor.style.opacity = "0.9";
    flowcursor.style.left=newx-brushsize/4+"px";
    flowcursor.style.top=newy-brushsize/4+"px";
    flowcursor.style.width=brushsize*0.8+"px";
    flowcursor.style.height=brushsize*0.8+"px";

    var currentpixel = ctx.getImageData(newx,newy,brushsize,brushsize);
    if (  (currentpixel.data[0]+currentpixel.data[1]+currentpixel.data[2])>600 ){
        //flowcursor.style.background='url(img/cursorb.png), center center no-repeat !important';
        $(flowcursor).css({'background':'url(img/cursorb.png),no-repeat center center', 'backgroundsize':'100% 100% !important', 'background-repeat':'no'});
    }else{
        //flowcursor.style.background='url(img/cursor.png), center center no-repeat !important';
        $(flowcursor).css({'background':'url(img/cursor.png),no-repeat center center', 'backgroundsize':'100% 100% !important','background-repeat':'no'});
    }
    flowcursor.style.backgroundSize='100% 100%';
    flowcursor.style.backgroundRepeat='no-repeat';
}




var clientIP =null;

function setupSocket() {
	socket = io().connect('http://localhost:3000/');

	socket.on('connect',function(){		
		alreadyondata = true;

   		console.log("session id:"+this.id);
   		console.log(this);

		//if 2 devices connect to the same wifi, ip would be useless to distinguish them
   		socket.emit('requestip',1);
   		socket.on('requestip',function(ipadd){
   			clientIP = ipadd;
   			requestip(ipadd);
   			console.log("clientIP"+clientIP);
   		});

		socket.on('ondrag',function(dragdata){ // when receive color submission
			dragwipe( dragdata[0], dragdata[1] );
		});	//on colors	

		socket.on('choosePerson',function(j){
			pathimg = j*3;
			console.log("chooseperson"+pathimg);
			initimage(pathimg);
		});//chooseperson
		
	});//on connect

	socket.on('disconnect', function () {
		console.log('client disconnected');
		initpixandwipe();
		//socket.emit('disconnect');
	});
}//setupSocket()

function requestip(ip){
	clientIP = ip;
}
