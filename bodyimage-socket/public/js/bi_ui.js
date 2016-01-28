var model;
var home;
var backhome;
var instruct;
var model;
var menu;
var bars=[];
var progressthumbs=[];
var nextinstruct;
var compare=null;


function initmodels(){
	home=document.getElementById('home');
	model = document.getElementsByClassName('model');
	maincanvas.style.top=-3000+"px";
	instruct = document.getElementById('instruction');
	nextinstruct = document.getElementById('nextinstruct');
	compare = document.getElementById('compare');

	menu = document.getElementById('menu');
	backhome = document.getElementById('backhome');
	bars[0] = document.getElementById('bar0');
	bars[1] = document.getElementById('bar1');
	for(var i=0;i<3;i++){
		progressthumbs[i]=document.getElementById('progressthumb'+i);
	}

	for (var i = 0; i < model.length; i++) {
		model[i].addEventListener('click',hometocanvas);//addEventListener click
		model[i].addEventListener('touchend', hometocanvas);//addEventListener click
	}//for

	backhome.addEventListener('click', backtoslectmodel);//backhomebtn click
	backhome.addEventListener('touchend', backtoslectmodel);//backhomebtn touchend

	instruct.addEventListener('click', function(e){ e.preventDefault();
		instruct.style.left = '-500%';
		$('.container-fluid').css('left','-500%');
	});//backhomebtn click
	instruct.addEventListener('touchend', function(e){ e.preventDefault();
		instruct.style.left = '-500%';
		$('.container-fluid').css('left','-500%');
	});

}//initmodels


/*-------------------For Models In The Home DIV-------------------*/
function backtoslectmodel(e){  
	e.preventDefault();
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
}


function hometocanvas(e){
	e.preventDefault();
	addEvtListeners();

	var temp = parseInt(e.target.id)*3;
	var firstins = imgs.length<1 ? true : false; 
	initimage(temp);
	inittumbnails(temp);

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

			$(bars[0]).css('width','0%').attr('aria-valuenow','0'); 
			$(bars[1]).css('width','0%').attr('aria-valuenow','0'); 
			/*-------------------instructions-------------------*/
			if(firstins == true){
				instruct.style.left = '50%';
				$('.container-fluid').css('left','0');
	  		}//if instructions

	 	}//complete funtion
	});   //animate
}//hometocanvas

function inittumbnails(temp){
	for(var i=0;i<3;i++){
		var path = temp + i;
		progressthumbs[i].src='img/thumbnail/'+path+'.jpg';
		progressthumbs[i].style.webkitFilter = "brightness(20%)";
	}
	progressthumbs[0].style.webkitFilter = "brightness(100%)";
	progressthumbs[0].style.background = "red";
}

function progressbars(){
	var percent = totalwiped / (pixmatrix.length*pixmatrix[0].length).toFixed(2)+0.05;
	$(bars[index-1]).css('width',percent*100+'%').attr('aria-valuenow', percent);
	bars[index-1].style.opacity='1 !important';
	//$(bars[index-1]).html(percent.toFixed(2)*100+'%'); 
}


function nextbar(){
	console.log("index++: "+index);
	nextinstruct.style.left = "50%";

	if ( index == ( imgs.length-1 ) ) {
		var pp = nextinstruct.children[0].children[0];
		pp.innerHTML = "Done";
		finishcompare();
	}
	removeEvtListeners();

	$(bars[index-1]).animate({ 'width' : "100%" }, {
	 	duration: 1000,
	 	complete: function(){
			progressthumbs[index].style.webkitFilter = "brightness(100%)";
			progressthumbs[index].style.background = "red";
			$(bars[index-1]).removeClass('progress-bar-striped active');

			var rest=selectrest(index);
			progressthumbs[ rest[0] ].style.background = "grey";
			progressthumbs[ rest[1] ].style.background = "grey";

			ctx.drawImage(imgs[index],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
	                    0,0,maincanvas.width, maincanvas.height);

	 		index++;
			index = index % imgs.length;
			setTimeout( addEvtListeners, 500);
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
}//nextbar


function finishcompare () {
	$(compare).animate({ 'opacity' : "1" }, {
	 	duration: 1000,
	 	complete: function(){
	 		ctx.drawImage(imgs[imgs.length-1 ],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
	                    0,0,maincanvas.width, maincanvas.height);
	}});

	compare.addEventListener('touchstart', function(e){ e.preventDefault();
		if ( compare.style.opacity == 1) {
			ctx.drawImage(imgs[0],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
            	0,0,maincanvas.width, maincanvas.height);
			compare.style.background = 'grey';
		}
	});

	compare.addEventListener('touchend',function(e){ e.preventDefault();
		if ( compare.style.opacity == 1) {
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
		console.log('final select');
		e.preventDefault();
		var x= parseInt( e.target.id.split('progressthumb')[1] );
		var rest=selectrest(x);
		
		progressthumbs[rest[0]].style.background = "grey";
		progressthumbs[rest[1]].style.background = "grey";

		progressthumbs[x].style.background = "red";
		ctx.drawImage(imgs[x],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
        	0,0,maincanvas.width, maincanvas.height);
	}

}

	

function selectrest(i){
		var x,y;
		if (i==0) { x=1; y=2;}
		else if (i==1) { x=0; y=2;}
		else {x=0;y=1;}
		return [x,y];
}
