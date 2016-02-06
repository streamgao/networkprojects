/**
* Created by Stream Gao on 12/20/15.
*/
var model;
var home;
var backhome;
var instruct;
var instruct1;
var menu;
var progressthumbs=[];
var nextinstruct;
var compare=null;


function initmodels(){
	home=document.getElementById('home');
	model = document.getElementsByClassName('model');
	maincanvas.style.top=-3000+"px";
	instruct = document.getElementById('instruction');
	instruct1 = document.getElementById('instruction1');
	nextinstruct = document.getElementById('nextinstruct');
	compare = document.getElementById('compare');

	menu = document.getElementById('menu');
	backhome = document.getElementById('backhome');
	bar = document.getElementById('bar0');

	for(var i=0;i<2;i++){
		progressthumbs[i]=document.getElementById('progressthumb'+i);
	}

	for (var i = 0; i < model.length; i++) {
		model[i].addEventListener('click', hometocanvas);//addEventListener click
		model[i].addEventListener('touchend', hometocanvas);//addEventListener click
	}//for

	backhome.addEventListener('click',backtoslectmodel);//backhomebtn click
	backhome.addEventListener('touchend', backtoslectmodel);//backhomebtn touchend

	instruct.addEventListener('click', function(e){ e.preventDefault();
		instruct.style.left = '-500%';
		instruct1.style.left = '50%';
	});//backhomebtn click
	instruct.addEventListener('touchend', function(e){ e.preventDefault();
		instruct.style.left = '-500%';
		instruct1.style.left = '50%';
	});
	instruct1.addEventListener('click', function(e){ e.preventDefault();
		instruct1.style.left = '-500%';
		$('.container-fluid').css('left','-500%');
	});//backhomebtn click
	instruct1.addEventListener('touchend', function(e){ e.preventDefault();
		instruct1.style.left = '-500%';
		$('.container-fluid').css('left','-500%');
	});

	//remove evt listeners
	for (var i = 0; i < imgs.length; i++) {
		progressthumbs[i].removeEventListener('touchend',function(e){e.preventDefault();} );//addEventListeners
		progressthumbs[i].removeEventListener('click',function(e){e.preventDefault();} );
	}//for
	compare.removeEventListener('touchend', function(e){ e.preventDefault();} );
	compare.removeEventListener('touchstart', function(e){ e.preventDefault();} );

}//initmodels


/*-------------------For Models In The Home DIV-------------------*/
function backtoslectmodel(e){  
	e.preventDefault();

    /*--------for sender---------*/
	if (alreadyondata && typeof(socket) != "undefined") {
		socket.emit('backtoslectmodel',1);
	}

	menu.style.top="-3000px";
	$("#home").animate({ top: "0px" }, {
	     	duration: 1000,
	     	complete: function(){
	     		maincanvas.style.top = '-3000px';
	     		flowcursor.style.left = '-1000px';
	     		instruct.style.left = '-500%';
	     	}
	});   //animate

	index=1;
	initpixandwipe();

	//remove evt listeners
	for (var i = 0; i < imgs.length; i++) {
		progressthumbs[i].removeEventListener('touchend',function(e){e.preventDefault();} );//addEventListeners
		progressthumbs[i].removeEventListener('click',function(e){e.preventDefault();} );
	}//for
	compare.removeEventListener('touchend',function(e){ e.preventDefault();} );
	compare.removeEventListener('touchstart',function(e){ e.preventDefault();} );

	/*--------footer pixel------------*/
	$('footer').css({'color': 'gray'}); 
	$('footer a').css({'color': 'gray'}); 
}


function hometocanvas(e){  
	e.preventDefault();
	addEvtListeners();
	done=false;

	var temp = parseInt(e.target.id)*2;
	var firstins = imgs.length<1 ? true : false; 
	initimage(temp);
	inittumbnails(temp);

	/*--------for sender---------*/
	if (alreadyondata && typeof(socket) != "undefined") {
		socket.emit('hometocanvas',temp);
	}

	home.style.top= maincanvas.height*2+2000+"px";
	compare.style.opacity = 0;

	$("#maincanvas").animate({ top: "0px" }, {
	 	duration: 1000,
	 	complete: function(){
	 		document.body.style.overflow="hidden";

			flowcursor.style.left = 500+"px";
			flowcursor.style.top = 200+"px";
			flowcursor.style.opacity = "0.9";
			menu.style.top="0";

			$(bar).css('width','0%').attr('aria-valuenow','0'); 
			/*-------------------instructions-------------------*/
			if(firstins == true){
				instruct.style.left = '50%';
				$('.container-fluid').css('left','0');
	  		}//if instructions

	 	}//complete funtion
	});   //animate

    $('footer').css({'color': 'white'});
    $('footer a').css({'color': 'white'});  
    	//remove evt listeners
	for (var i = 0; i < imgs.length; i++) {
		console.log('removeEventListener');
		progressthumbs[i].removeEventListener('touchend',function(e){e.preventDefault();} );//addEventListeners
		progressthumbs[i].removeEventListener('click',function(e){e.preventDefault();} );
	}//for

}//hometocanvas

function inittumbnails(temp){
	for(var i=0;i<imgs.length;i++){
		var path = temp + i;
		progressthumbs[i].src='ipadimg/thumbnail/'+path+'.jpg';
		progressthumbs[i].style.webkitFilter = "brightness(20%)";
	}
	progressthumbs[0].style.webkitFilter = "brightness(100%)";
	progressthumbs[0].style.background = "red";
	progressthumbs[1].style.background = "grey";
}

function progressbars(){
	var percent = totalwiped / (pixmatrix.length*pixmatrix[0].length)*1.15;
	percent = percent.toFixed(2);
	$(bar).css('width',percent*100+'%').attr('aria-valuenow', percent);
	bar.style.opacity='1 !important';
}


function nextbar(){
    /*--------for sender---------*/
    if (alreadyondata && typeof(socket) != "undefined" && done==true) {
        socket.emit('nextlayerdone',totalwiped);
    }

	console.log("index++: "+index);
	nextinstruct.style.left = "50%";
	removeEvtListeners();

	$(bar).animate({ 'width' : "100%" }, {
	 	duration: 1000,
	 	complete: function(){
			progressthumbs[index].style.webkitFilter = "brightness(100%)";
			progressthumbs[index].style.background = "red";
			$(bar).removeClass('progress-bar-striped active');

			var rest=selectrest(index);
			progressthumbs[ rest ].style.background = "grey";

			ctx.drawImage(imgs[index],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
	                    0,0,maincanvas.width, maincanvas.height);

	 		index++;
			index = index % imgs.length;
		}
	});//animate	

	$(nextinstruct).animate({ 'opacity' : "1.0" }, {
	 	duration: 1000,
	 	complete: function(){
	 		$(nextinstruct).animate({ 'opacity' : "0" }, {
			 	duration: 1000,
			 	complete: function(){ 
			 		nextinstruct.style.left = "-500% !important";
			 }});//nextinstruct
	}});	

	if (done==true)		finishcompare();
	
}//nextbar


function finishcompare () {
	removeEvtListeners();

	$(compare).animate({ 'opacity' : "1" }, {
	 	duration: 1000,
	 	complete: function(){
	 		ctx.drawImage(imgs[ imgs.length-1 ],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
	                    0,0,maincanvas.width, maincanvas.height);
	}});

	compare.addEventListener('touchstart', function(e){ e.preventDefault();
		if ( compare.style.opacity == 1) {
			/*--------for sender---------*/
			if (alreadyondata && typeof(socket) != "undefined") {
				socket.emit('finalselect',0);
			}

			ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
            	0,0,maincanvas.width, maincanvas.height);
			compare.style.background = 'grey';
		}
	});

	compare.addEventListener('touchend',function(e){ e.preventDefault();
		if ( compare.style.opacity == 1) {
			/*--------for sender---------*/
			if (alreadyondata && typeof(socket) != "undefined" && done==true) {
				socket.emit('finalselect',1);
			}

			ctx.drawImage(imgs[imgs.length-1 ],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
                0,0,maincanvas.width, maincanvas.height);
			compare.style.background = 'black';
		}
	});


	for (var i = 0; i < imgs.length; i++) {
		progressthumbs[i].addEventListener('touchend',finalselect);//addEventListeners
		progressthumbs[i].addEventListener('click',finalselect);
	}//for

	function finalselect(e){
		e.preventDefault();
		var x= parseInt( e.target.id.split('progressthumb')[1] );

		/*--------for sender---------*/
		if (alreadyondata && typeof(socket) != "undefined" && done==true) {
			socket.emit('finalselect',x);
		}

		var rest=selectrest(x);
		progressthumbs[rest].style.background = "grey";
		progressthumbs[x].style.background = "red";
		ctx.drawImage(imgs[x],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
        	0,0,maincanvas.width, maincanvas.height);
	}

}

	

function selectrest(i){
		// var x,y;
		// if (i==0) { x=1; y=2;}
		// else if (i==1) { x=0; y=2;}
		// else {x=0;y=1;}
		// return [x,y];
		var x;
		x = (i==0) ? 1: 0 ;
		return x;
}
