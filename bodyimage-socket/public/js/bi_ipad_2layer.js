/**
 * Created by Stream Gao on 12/20/15.
 */

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
var ratioscreenx=1;
var ratioscreeny=1;
var flowcursor;
var img;
var pathimg;

var alreadyondata=null;

/*-------------------inits-------------------*/
function initpixandwipe(){
	totalwiped = 0;
	for(var i=0;i<dividenum; i++){
    	pixmatrix[i] = [];
    	for (var j = 0; j < Math.ceil( $('#maincanvas').height()*dividenum/$('#maincanvas').width() ); j++) {
    		pixmatrix[i][j] = -1;
    	}
    }
    //console.log( pixmatrix.length +","+pixmatrix[0].length );
}


function initvariables(){
	maincanvas = document.getElementById("maincanvas");
   	maincanvas.width = $(window).width();
	maincanvas.height= $(window).height();
    ctx = maincanvas.getContext("2d");

 	index = 1;
 	totalwiped = 0;

    dividenum = 7;
    brushsize = Math.ceil(maincanvas.width/ dividenum);   //50
    wipex = 0; wipey = 0;
	ratiox = maincanvas.width / $('#maincanvas').width();
	ratioy = maincanvas.height / $('#maincanvas').height();
 }


function initcursor () {
	flowcursor = document.createElement('div');
    flowcursor.setAttribute('id','flowcursor');

    flowcursor.style.width=brushsize+"px";
    flowcursor.style.height=brushsize+"px";
    document.getElementsByTagName('body')[0].appendChild(flowcursor);
}

function initimage(pathi){
	for(var i=0; i<2; i++){
	    imgs[i] = new Image();
	    var path = pathi + i;
		imgs[i].src='ipadimg/main/'+path+'.jpg';
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
    alreadyondata=null;

    if(typeof(setupSocket) != "undefined") {
        setupSocket();//not necessary though
    }

    initvariables();
    initmodels(); // in bi_ui.js
    initcursor();
    initpixandwipe();//init pix matrix


	/*-------------------touch events-------------------*/  
	//addEvtListeners();
    $('body').bind('copy paste',function(e){ e.preventDefault(); return false; });
	$('body').nodoubletapzoom();
	$(document.body).on("touchmove", function(e) {e.preventDefault(); e.stopPropagation();});
}; //init


$('document').ready(  init  );

function addEvtListeners(){
	console.log('addEvtListeners, index'+index);

	maincanvas.addEventListener('mousedown', function(e){ e.preventDefault(); mousedown =true; });
  	maincanvas.addEventListener('mouseup', function(e){ e.preventDefault(); mousedown =false; });
    maincanvas.addEventListener('mousemove', function(e){ e.preventDefault(); 
  		mousedown = true; eventmove(e.clientX, e.clientY, mousedown); });//mousemove


    maincanvas.addEventListener('touchstart', function(e){e.preventDefault(); touchdown =true; });
  	maincanvas.addEventListener('touchend', function(e){e.preventDefault(); touchdown =false; });
  	maincanvas.addEventListener('touchmove', function(e){ e.preventDefault(); 
  		touchdown = true; eventmove(e.pageX, e.pageY, touchdown); });//touchmove

  	flowcursor.addEventListener('touchstart', function(e){	e.preventDefault(); touchdown =true; });
  	flowcursor.addEventListener('touchend', function(e){	e.preventDefault(); touchdown =false; });
    flowcursor.addEventListener('touchmove', function(e){	e.preventDefault(); 
	  	eventmove(e.pageX, e.pageY, touchdown); });//mousemove

    if ( compare!=null && compare.style.opacity!=0 ) {
    	compare.addEventListener('touchstart', function(e){	e.preventDefault(); touchdown =true; });
  		compare.addEventListener('touchend', function(e){	e.preventDefault(); touchdown =false; });
    	compare.addEventListener('touchmove', function(e){	e.preventDefault(); 
	  		eventmove(e.pageX, e.pageY, touchdown); });//mousemove
    }
}

function removeEvtListeners(){
    console.log("removeEvtListeners()");
	maincanvas.removeEventListener('mousedown', function(e){ e.preventDefault();} );
  	maincanvas.removeEventListener('mouseup', function(e){ e.preventDefault();} );
    maincanvas.removeEventListener('mousemove', function(e){ e.preventDefault(); });//mousemove


    maincanvas.removeEventListener('touchstart', function(e){e.preventDefault(); });
  	maincanvas.removeEventListener('touchend', function(e){e.preventDefault(); });
  	maincanvas.removeEventListener('touchmove', function(e){ e.preventDefault(); });//touchmove

  	flowcursor.removeEventListener('touchstart', function(e){ e.preventDefault(); });
  	flowcursor.removeEventListener('touchend', function(e){	e.preventDefault(); });
    flowcursor.removeEventListener('touchmove', function(e){ e.preventDefault(); });//mousemove

    if (compare!=null) {
    	compare.removeEventListener('touchstart', function(e){ e.preventDefault(); });
  		compare.removeEventListener('touchend', function(e){	e.preventDefault(); });
    	compare.removeEventListener('touchmove', function(e){ e.preventDefault(); });//mousemove
    }
}

/*-------------------add event listeners-------------------*/
function eventmove(xx,yy,down){
	var x = xx;
	var y = yy;
	if ( down==true && index!=0 && instruct.style.left!="50%" ) { 
			var data = [x*ratioscreenx, y*ratioscreeny];
			dragwipe(x, y); 
			dragflowcursor(x, y);

            if (alreadyondata) {
                var data = [(x/maincanvas.width).toFixed(4), (y/maincanvas.height).toFixed(4)];
                socket.emit('ondrag',data);
            }
	}//if draging, else do nothing
}

function dragwipe(evtx, evty){
		wipex = Math.floor( evtx / brushsize );
		wipey = Math.floor( evty / brushsize );

		if ( totalwiped < 0.6 * pixmatrix.length * pixmatrix[0].length && index!=0) {  //current image
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
            tmpcanvas.width=brushsize;
            tmpcanvas.height=brushsize;

            tmpCtx.save();
            tmpCtx.beginPath();
            tmpCtx.arc(brushsize/2, brushsize/2, brushsize/2,0, Math.PI*2, false);
            tmpCtx.closePath();
            tmpCtx.clip();

            tmpCtx.drawImage(imgs[index], 
                (evtx-brushsize*ratioimgy/8)*ratioimgx, (evty-brushsize*ratioimgy/8)*ratioimgy, 
                brushsize*ratioimgx, brushsize*ratioimgy, 0,0, brushsize, brushsize);

            tmpCtx.closePath();
            tmpCtx.restore();
          
            ctx.drawImage( tmpcanvas, 0,0, brushsize, brushsize,
                evtx-brushsize*ratioimgx/8, evty-brushsize*ratioimgy/8, brushsize, brushsize);

		}else { //switch
			nextbar();

			setTimeout( function(){
				if(index == 0){
					flowcursor.style.left="5000px";
   					flowcursor.style.top="5000px";
		        } 
			}, 1200);
			initpixandwipe();
		}//else change to next image

}//dragwipe



function dragflowcursor(dragdata0, dragdata1){
    var newx = dragdata0;
    var newy =  dragdata1;
    flowcursor.style.opacity = "0.9";
    flowcursor.style.left=newx-brushsize/4+"px";
    flowcursor.style.top=newy-brushsize/4+"px";
    flowcursor.style.width=brushsize+"px";
    flowcursor.style.height=brushsize+"px";

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




/*-------------------prevent double click zoom-------------------*/
(function($) {
    $.fn.nodoubletapzoom = function() {
        if($("html.touch").length == 0) return;

        $(this).bind('touchstart', function preventZoom(e){
            var t2 = e.timeStamp;
            var t1 = $(this).data('lastTouch') || t2;
            var dt = t2 - t1;
            var fingers = e.originalEvent.touches.length;
            $(this).data('lastTouch', t2);
            if (!dt || dt > 500 || fingers > 1){
                return; // not double-tap
            }
            e.preventDefault(); // double tap - prevent the zoom
            // also synthesize click events we just swallowed up
            $(this).trigger('click');
        });
    };
})(jQuery);
