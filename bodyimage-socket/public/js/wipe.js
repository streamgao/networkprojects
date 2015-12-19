var socket;
var connection;
var maincanvas,ctx;
var overlaycanvas, overlayctx;
var imgs = [];
var names = [];
var posternames = [];
var currentinfo;
var yourname;
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

var img;
var poster;
var temp;

function initpixandwipe(){
	totalwiped = 0;
	for(var i=0;i<dividenum;i++){
    	pixmatrix[i] = [];
    	for (var j = 0; j < Math.floor( $('#maincanvas').height()*dividenum/$('#maincanvas').width() ); j++) {
    		pixmatrix[i][j] = -1;
    	}
    }
}

function initposter(){
    overlaycanvas = document.getElementById("overlaycanvas");
    overlayctx=overlaycanvas.getContext('2d');

    overlaycanvas.width=maincanvas.width;
    overlaycanvas.height = maincanvas.height;

    poster = new Image();
    poster.src='img/blemish0.png';
    poster.width = overlaycanvas.width;
    poster.height = overlaycanvas.height;

    poster.onload= function(){
        overlayctx.drawImage(poster,0,0, poster.naturalWidth, poster.naturalHeight, 
                      0,0, maincanvas.width, maincanvas.height);
    };//onload
}//initposter

function initvariables(){
   	index = 1;
   	totalwiped = 0;
    imgs = [];

    socket.emit('requestinitimgs',0);
    socket.on('requestinitimgs',function(imgg){
        for(var i=0; i<imgg.length; i++){
          imgs[i*2] = new Image();
          imgs[i*2].src= imgg[i].original;
          imgs[i*2+1] = new Image();
          imgs[i*2+1].src= imgg[i].retouched;

          names.push(imgg[i].name);
          names.push(imgg[i].name);
          posternames.push(imgg[i].postername);
          posternames.push(imgg[i].postername);
        }
        imgs[0].width = maincanvas.width;
        imgs[0].height = maincanvas.height;

        var ratioimage = imgs[0].naturalHeight/imgs[0].naturalWidth;
        //maincanvas.style.width =  ratioimage*100+'%';

        imgs[0].onload = function(){
            ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
                       0,0,maincanvas.width, maincanvas.height);
        };

        currentinfo.innerHTML = '<h3>'+imgg[0].postername+'</h3><h4>'+'Before Retouching!</h4>';
        yourname.innerHTML='<h4>'+imgg[0].name +'</h4>';
    });//on requestwipeimgs

    //init brushsize and pix cutting unit
    dividenum = 10;
    brushsize = Math.ceil($('#maincanvas').width() / dividenum);   //50
    console.log(brushsize+","+$('#maincanvas').width() );
    wipex = 0; wipey = 0;
	  ratiox = maincanvas.width / $('#maincanvas').width();
	  ratioy = maincanvas.height / $('#maincanvas').height();

    //init pix matrix
    initpixandwipe();
    console.log( "Size:"+pixmatrix.length+","+pixmatrix[0].length );

 }//initvariables


var init = function() {   //receiver
	  maincanvas = document.getElementById("maincanvas");
	  maincanvas.height= $(window).height();
   	maincanvas.width = $(window).width();
    ctx = maincanvas.getContext("2d");
    currentinfo = document.getElementById('currentinfo');
    yourname = document.getElementById('yourname');


    var retVal = confirm("Get Ready to Wipe!");
    if( retVal == true ){
        setupSocket();
        initvariables();
        initposter();
    }
    else{
        document.write ("Error!Try to reload the page and select ok.");
    }
            

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

    /*for mobile*/
    maincanvas.addEventListener('touchstart', function(){touchdown =true;});
  	maincanvas.addEventListener('touchend', function(){touchdown =false;});
  	maincanvas.addEventListener('touchmove', function(e){
  		touchdown = true;
  		e.preventDefault(); 
    	if (touchdown) { 
    		if( alreadyondata ){
    			var data = [e.pageX, e.pageY];
    			socket.emit('ondrag',data);
    			dragwipe(e.pageX, e.pageY); 
    		}else{//if not connecting to peers
				console.log("haven't connect to anyone!");
			}
    	}//if draging, else do nothing 
    });//mousemove


    overlaycanvas.addEventListener('mousedown', function(){mousedown =true;});
    overlaycanvas.addEventListener('mouseup', function(){mousedown =false;});
    overlaycanvas.addEventListener('mousemove', function(e){
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

    /*for mobile*/
    overlaycanvas.addEventListener('touchstart', function(){touchdown =true;});
    overlaycanvas.addEventListener('touchend', function(){touchdown =false;});
    overlaycanvas.addEventListener('touchmove', function(e){
      touchdown = true;
      e.preventDefault(); 
      if (touchdown) { 
        if( alreadyondata ){
          var data = [e.pageX, e.pageY];
          socket.emit('ondrag',data);
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

    currentinfo.innerHTML = (index%2==0) ? '<h3>'+posternames[index]+'</h3><h4>'+'Before Retouching</h4>' 
                : '<h3>'+posternames[index]+'</h3><h4>'+'After Retouching</h4>'; 
    yourname.innerHTML='<h4>'+names[index]+'</h4>';

		if ( totalwiped < 0.9 * pixmatrix.length * pixmatrix[0].length ) {  //current image
				if ( pixmatrix[wipex][wipey]==-1 ) { // if haven't draw this pixel
					totalwiped++;
					totalwiped = totalwiped% (pixmatrix.length * pixmatrix[0].length);
					pixmatrix[wipex][wipey] = 1;
				}

        //method 2:
      	ctx.globalAlpha = 1;
      	ratioimgx = imgs[index].naturalWidth / maincanvas.width; //naturalHeight
      	ratioimgy = imgs[index].naturalHeight / maincanvas.height;
      	var tmpcanvas = document.createElement('canvas');
      	var tmpCtx = tmpcanvas.getContext('2d');
    	  tmpCtx.save();
        tmpCtx.beginPath();
        tmpCtx.arc(brushsize*ratioimgy/2, brushsize*ratioimgy/2, brushsize*ratioimgy/2, 0, Math.PI*2);
        tmpCtx.closePath();
        tmpCtx.clip();

        tmpCtx.drawImage(imgs[index], 
        	(evtx-brushsize*ratioimgy/8)*ratioimgx, (evty-brushsize*ratioimgy/8)*ratioimgy, 
        	brushsize*ratioimgx, brushsize*ratioimgy, 0,0, brushsize, brushsize);

        tmpCtx.closePath();
        tmpCtx.restore();
    	  ctx.drawImage( tmpcanvas, 0,0, brushsize, brushsize,
    	 	   evtx-brushsize*ratioimgy/8, evty-brushsize*ratioimgy/8, brushsize, brushsize);

		}else{ //switch
        if (index==imgs.length-1) {
            console.log("last one");
            socket.emit("requestwipeimgs",Math.ceil(imgs.length/2));
            /*
            setTimeout(function(){ 
                ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
                    0,0,maincanvas.width, maincanvas.height);
            }, 1000);
            setTimeout(function(){ 
                ctx.drawImage(imgs[6],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
                    0,0,maincanvas.width, maincanvas.height);
            }, 2000);
            setTimeout(function(){ 
                ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
                    0,0,maincanvas.width, maincanvas.height);
            }, 3000);
            setTimeout(function(){ 
                ctx.drawImage(imgs[6],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
                    0,0,maincanvas.width, maincanvas.height);
            }, 4000);
            setTimeout(function(){ 
                ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
                    0,0,maincanvas.width, maincanvas.height);
            }, 5000);
            setTimeout(function(){ 
                ctx.drawImage(imgs[6],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
                    0,0,maincanvas.width, maincanvas.height);
            }, 6000);*/
          
        }//last one
        index++;
        console.log(index+"index++: "+ index % imgs.length);
        index = index % imgs.length;
        initpixandwipe();
		}//else change to next image

}//dragwipe



function setupSocket() {
	socket = io().connect('http://localhost:3000/');

	socket.on('connect',function(){		
		alreadyondata = true;

		socket.on('ondrag',function(dragdata){ // when receive color submission
			dragwipe( dragdata[0], dragdata[1] );
		});	//on colors	

    socket.on('requestwipeimgs',function(imgg){
      temp=imgg;
      var img1,img2;
      console.log(temp);
      console.log(imgg[0]);
        for(var i=0; i<imgg.length; i++){
          img1 = new Image();
          img1.src= imgg[i].original;
          img2 = new Image();
          img2.src= imgg[i].retouched;
          imgs.push(img1);
          imgs.push(img2);
          names.push(imgg[i].name);
          names.push(imgg[i].name);
          posternames.push(imgg[i].postername);
          posternames.push(imgg[i].postername);
        }

    });

    socket.on('eyeswindow', function(val){
       console.log('eyeswindow'+val);
       document.getElementById("eyeswindow").value=val;
    });

	});//on connect


	socket.on('disconnect', function () {
		console.log('client disconnected');
		initpixandwipe();
		//socket.emit('disconnect');
	});
}//setupSocket()


function eyeswindowonchange(){
    //var v = document.getElementById("eyeswindow").value;
    socket.emit('eyeswindow',document.getElementById("eyeswindow").value);
}


