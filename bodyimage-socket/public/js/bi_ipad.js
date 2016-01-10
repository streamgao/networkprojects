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
// var tsscreenwidth=580;
// var tsscreenheight=615;

var img;
var pathimg;

function initpixandwipe(){
	totalwiped = 0;
	for(var i=0;i<dividenum; i++){
    	pixmatrix[i] = [];
    	for (var j = 0; j < Math.ceil( $('#maincanvas').height()*dividenum/$('#maincanvas').width() ); j++) {
    		pixmatrix[i][j] = -1;
    	}
    }
    console.log("initpixandwipe");
}


function initvariables(){
 	index = 1;
 	totalwiped = 0;
 	alreadyondata = false;

    dividenum = 7;
    brushsize = Math.ceil(maincanvas.width/ dividenum)+10;   //50
    wipex = 0; wipey = 0;
	ratiox = maincanvas.width / $('#maincanvas').width();
	ratioy = maincanvas.height / $('#maincanvas').height();
	//ratioscreenx = tsscreenwidth/maincanvas.width;
	//ratioscreeny = tsscreenheight/maincanvas.height;
 }


function initcursor () {
	flowcursor = document.createElement('div');
    flowcursor.setAttribute('id','flowcursor');

    flowcursor.style.width=brushsize*0.8+"px";
    flowcursor.style.height=brushsize*0.8+"px";
    document.getElementsByTagName('body')[0].appendChild(flowcursor);
}
/*
function initimages(){
	socket.on('choosePerson',function(j){
			pathimg = j*3;
			console.log(pathimg);
    });//chooseperson


    console.log(pathimg);
	for(var i=0; i<3; i++){
	    imgs[i] = new Image();
	    var path = i+7;
	    path = path+pathimg;
		imgs[i].src='touchscreenimg/'+path+'.jpg';
		console.log(imgs[i]);
	}
	console.log(imgs[0]);
    imgs[0].width = maincanvas.width || $(window).width();
    imgs[0].height = maincanvas.height || $(window).height();
    imgs[0],onload = function(){
        ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
                   0,0,maincanvas.width, maincanvas.height);
    };
}//initimages*/

function initimage(pathi){

    console.log(pathimg);
	for(var i=0; i<3; i++){
	    imgs[i] = new Image();
	    var path = i+7;
	    path = path+pathi;
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

var init = function() {   //receiver
    setupSocket();

	maincanvas = document.getElementById("maincanvas");
   	maincanvas.width = $(window).width();
	maincanvas.height= $(window).height();
    ctx = maincanvas.getContext("2d");

    initvariables();
   // initimages();
    initcursor();
    initpixandwipe();//init pix matrix
//    initposter();

   	maincanvas.addEventListener('mousedown', function(){mousedown =true;});
  	maincanvas.addEventListener('mouseup', function(){mousedown =false;});
    maincanvas.addEventListener('mousemove', function(e){
  		e.preventDefault(); 
    	if (mousedown) { 
    		if( alreadyondata ){
    			var data = [e.clientX*ratioscreenx, e.clientY*ratioscreeny];
    			socket.emit('ondragsender',data);
    			dragwipe(e.clientX, e.clientY); 

    			dragcursor(e.clientX, e.clientY);
    		}else{//if not connecting to peers
				console.log("haven't connect to anyone!");
			}
    	}//if draging, else do nothing 
    });//mousemove

    /*for mobile*/
    maincanvas.addEventListener('touchstart', function(){e.preventDefault(); touchdown =true; });
  	maincanvas.addEventListener('touchend', function(){e.preventDefault();touchdown =false;});
  	maincanvas.addEventListener('touchmove', function(e){
  		touchdown = true;
  		e.preventDefault(); 
    	if (touchdown) { 
    		if( alreadyondata ){
    			var data = [e.pageX*ratioscreenx, e.pageY*ratioscreeny];
    			socket.emit('ondragsender',data);
    			dragwipe(e.pageX, e.pageY); 

    			dragflowcursor(e.pageX, e.pageY);
    		}else{//if not connecting to peers
				console.log("haven't connect to anyone!");
			}
    	}//if draging, else do nothing 
    });//touchmove


  	flowcursor.addEventListener('touchstart', function(){e.preventDefault(); touchdown =true;});
  	flowcursor.addEventListener('touchend', function(){e.preventDefault();touchdown =false;});
    flowcursor.addEventListener('touchmove', function(e){
  		touchdown = true;
  		e.preventDefault(); 
    	if (touchdown) { 
    		if( alreadyondata ){
    			var data = [e.pageX*ratioscreenx, e.pageY*ratioscreeny];
    			socket.emit('ondragsender',data);
    			dragwipe(e.pageX, e.pageY); 

    			dragflowcursor(e.pageX, e.pageY);
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

		if ( totalwiped < 0.6 * pixmatrix.length * pixmatrix[0].length ) {  //current image
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
			// ctx.drawImage( tmpcanvas, 0,0,brushsize, brushsize);
			// ctx.drawImage(tmpcanvas, 0, 0,100, 100, evtx, evty,100, 100);

		}else{ //switch
			console.log("index++: "+index);
			index++;
			index = index % imgs.length;
			initpixandwipe();
			if (alreadyondata==true) {
				socket.emit('nextlayer',index);
			}
			if(index == 0){

	            console.log("last one");
	            setTimeout(function(){ 
	                ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
	                    0,0,maincanvas.width, maincanvas.height);
	            }, 1000);
	            setTimeout(function(){ 
	                ctx.drawImage(imgs[2],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
	                    0,0,maincanvas.width, maincanvas.height);
	            }, 2000);
	            setTimeout(function(){ 
	                ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
	                    0,0,maincanvas.width, maincanvas.height);
	            }, 3000);
	            setTimeout(function(){ 
	                ctx.drawImage(imgs[2],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
	                    0,0,maincanvas.width, maincanvas.height);
	            }, 4000);
	            setTimeout(function(){ 
	                ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
	                    0,0,maincanvas.width, maincanvas.height);
	            }, 5000);
	            setTimeout(function(){ 
	                ctx.drawImage(imgs[2],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
	                    0,0,maincanvas.width, maincanvas.height);
	            }, 6000);
	            setTimeout(function(){ 
	                window.location.href ='../';
	            }, 7000);
	        
			}

		}//else change to next image
}//dragwipe



var dragcursor = function(evts, evty){
	var currentpixel = ctx.getImageData(evts,evty,brushsize,brushsize);
	if (  (currentpixel.data[0]+currentpixel.data[1]+currentpixel.data[2])>600 ){
		// flowcursor.style.background='url(img/cursorb.png), center center no-repeat';
		// console.log(flowcursor.style.background);
		maincanvas.style.cursor='url(img/cursorb.png),auto';
	}else{
		//flowcursor.style.background='url(img/cursor.png), center center no-repeat';
		maincanvas.style.cursor='url(img/cursor.png),auto';
	}
}

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
        console.log(flowcursor);
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
   		//console.log(socket);

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
