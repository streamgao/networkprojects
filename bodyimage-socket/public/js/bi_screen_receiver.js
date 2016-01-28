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

var maincontainerleft;


function setupSocket() {
  socket = io().connect('http://159.203.85.109:3000/');

  socket.on('connect',function(){   
    alreadyondata = true;
    console.log("session id:"+this.id);
    console.log(this);
  });//on connect

  socket.on('ondrag',function(msg){ 
      var data=[];
      data[0]=msg[0]*maincanvas.width;
      data[1]=msg[1]*maincanvas.height;

      eventmove(data[0],data[1],true);
  });//on colorchoice
 
  socket.on('nextlayerdone',function(msg){ 
      nextbar();
  });

  socket.on('hometocanvas',function(msg){
     hometocanvas(msg);
  });

  socket.on('backtoslectmodel',function(msg){
    console.log('backtoslectmodel'+msg);
    //先吧model hover的效果显示出来， 等1s再跳页
    backtoslectmodel();
  });

  socket.on('finalselect',function(msg){
    console.log('finalselect'+msg);
    if(index != 0){
        nextbar();
    }
    finalselect(msg);
  });


  socket.on('disconnect', function () {
    console.log('client disconnected');
    //socket.emit('disconnect');
  });
}//setupSocket()






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
    maincanvas.width = $("#maincontainer").width();
    maincanvas.height= $("#maincontainer").height();
    ctx = maincanvas.getContext("2d");

    index = 1;
    totalwiped = 0;

    dividenum = 7;
    brushsize = Math.ceil(maincanvas.width/ dividenum);   
    wipex = 0; wipey = 0;

    ratiox = maincanvas.width / $('#maincanvas').width();
    ratioy = maincanvas.height / $('#maincanvas').height();
    maincontainerleft= 530;
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
        imgs[i].src='img/main/'+path+'.jpg';
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
    initmodels(); // bi_ui.js
    initcursor();
    initpixandwipe();//init pix matrix

  /*-------------------need to add 30s animation in the beginning-------------------*/  
  
}; //init


$('document').ready(  init  );



/*-------------------add event listeners-------------------*/
function eventmove(xx,yy,down){
  var x = xx;
  var y = yy;

  if (down==true) { 
      dragwipe(x, y); 
      dragflowcursor(x+maincontainerleft, y);
  }//if draging, else do nothing
}


function dragwipe(evtx, evty){
    wipex = Math.floor( evtx / brushsize );
    wipey = Math.floor( evty / brushsize );

    if ( totalwiped < 0.7 * pixmatrix.length * pixmatrix[0].length && index!=0) {  //current image
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


    }else if( totalwiped >= 0.7 * pixmatrix.length * pixmatrix[0].length ){ //switch
        nextbar();
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















/*-----------------------------------bi_ui_sender_2layer----------------------------------------------*/

var model;
var home;
var backhome;
var instruct;
var instruct1;
var menu;
var progressthumbs=[];
var nextinstruct;
//var compare=null;
var modeljumpingindex;
var modeljumpingindextemp;

function initmodels(){
  home=document.getElementById('home');
  model = document.getElementsByClassName('model');
  maincanvas.style.top=-3000+"px";
  instruct = document.getElementById('instruction');
  instruct1 = document.getElementById('instruction1');
  nextinstruct = document.getElementById('nextinstruct');
  //compare = document.getElementById('compare');

  menu = document.getElementById('menu');
  backhome = document.getElementById('backhome');
  bar = document.getElementById('bar0');

  for(var i=0;i<2;i++){
    progressthumbs[i]=document.getElementById('progressthumb'+i);
  }

  modeljumpingindex=0;
  modeljumpingindextemp=0;

/*
  for (var i = 0; i < model.length; i++) {
    model[i].addEventListener('click touchend', hometocanvas);//addEventListener click
  }//for

  backhome.addEventListener('click touchend', backtoslectmodel);//backhomebtn click
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
*/
}//initmodels


function modeljumping(){

    setInterval(function(){ 

        $(model[modeljumpingindextemp]).find('img').removeClass('modeljumping');
        $(model[modeljumpingindex]).find('span').removeClass('modeljumpingspan');  
        $(model[modeljumpingindex]).removeClass('paddingorange'); 

        modeljumpingindex++;
        modeljumpingindex = modeljumpingindex+randomnoise();
        modeljumpingindex = modeljumpingindex%model.length;//0~8
        modeljumpingindex = modeljumpingindex<0 ? (-1* modeljumpingindex) : modeljumpingindex;

        modeljumpingindextemp = modeljumpingindex;

        $(model[modeljumpingindex]).find('img').addClass('modeljumping');
        $(model[modeljumpingindex]).find('span').addClass('modeljumpingspan');     
        $(model[modeljumpingindex]).addClass('paddingorange'); 
    }, 1500);

    function randomnoise(){
        var x = Math.random()>0.5 ? 1: -0.7;
        return Math.round( x* Math.random()*model.length/2 );
    }

}


/*-------------------For Models In The Home DIV-------------------*/
function backtoslectmodel(){  
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

    nextinstruct.style.left = "-500% !important";
    nextinstruct.style.opacity = "0";
    modeljumpingindex=0;
    modeljumpingindextemp=0;
    modeljumping();
}


function hometocanvas(tem){
  var temp = tem;
//  var firstins = imgs.length<1 ? true : false; 
  initimage(temp);
  inittumbnails(temp);

  home.style.top= maincanvas.height*2+2000+"px";
 // compare.style.opacity = 0;

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
      // if(firstins == true){
      //   instruct.style.left = '50%';
      //   $('.container-fluid').css('left','0');
      // }//if instructions

    }//complete funtion
  });   //animate
}//hometocanvas

function inittumbnails(temp){
  for(var i=0;i<imgs.length;i++){
    var path = temp + i;
    progressthumbs[i].src='img/thumbnail/'+path+'.jpg';
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
  console.log("index++: "+index);
  nextinstruct.style.left = "50%";

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

      // index++;
      // index = index % imgs.length;
      index=0;
      //setTimeout( addEvtListeners, 500);
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

  setTimeout( function(){
    if(index == 0){
        flowcursor.style.left="5000px";
        flowcursor.style.top="5000px";
    } 
  }, 1000);
  initpixandwipe();
  //finishcompare();
}//nextbar


function finalselect(x){
    var rest=selectrest(x);
    progressthumbs[rest].style.background = "grey";

    progressthumbs[x].style.background = "red";
    ctx.drawImage(imgs[x],0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight,
          0,0,maincanvas.width, maincanvas.height);
}

function selectrest(i){
    var x;
    x = (i==0) ? 1: 0 ;
    return x;
}



