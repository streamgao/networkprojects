var socket;
var sessionid;
var name=null;
var connected = false;
var width = 900;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

var streaming = false;
var video = null;
var outputcanvas = null;
var outputctx=null;
var outputphoto = null;
var overlaycanvas, overlayCC;
var tosendoricanvas, tosendorictx;
var tosendfinishcanvas, tosendfinishctx;

var startbutton = null;
var ctracker; 
var ctrackerimage;
var canvasInput;
var cc;
var imgtgtbtn = null;
var retouchbtn = null;
var sendbtn = null;
var facefound = false;
var overlayposition = [];
var targetpositions=[];
var retouchunit=1;
var sendoriphoto;
var sendfinishphoto;
var senditems;
var filtercanvas;

function getposition(element){
    var rect = element.getBoundingClientRect();
    var elementLeft,elementTop; //x and y
    var scrollTop = document.documentElement.scrollTop?
                    document.documentElement.scrollTop:document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft?                   
                     document.documentElement.scrollLeft:document.body.scrollLeft;
    elementTop = rect.top+scrollTop;
    elementLeft = rect.left+scrollLeft;

    return [elementTop, elementLeft];
}

function clearphoto() {
    outputctx.fillStyle = "#AAA";
    outputctx.fillRect(0, 0, outputcanvas.width, outputcanvas.height);
    var data = outputcanvas.toDataURL('image/png');
    outputphoto.src=data;
}

function takepicture() {
    overlayCC.clearRect(0,0,overlaycanvas.width, overlaycanvas.height);
    if (width && height) {
      outputcanvas.width = width;
      outputcanvas.height = height;
      outputctx.drawImage(video, 0, 0, width, height);
      var data = outputcanvas.toDataURL('image/png');
      outputphoto.src=data;
    } else {
      clearphoto();
    }
}

function targetFace(){
    //var x,y;
    targetpositions = ctracker.getCurrentPosition();
    //console.log(targetpositions);
    // if (targetpositions) {
    //   for (var p = 0;p < targetpositions.length;p++) {  
    //       x = targetpositions[p][0].toFixed(2);
    //       y = targetpositions[p][1].toFixed(2);
          // var track = document.createElement('div');
          // $(track).css({"position":"absolute","left":x+'px',"top":y+'px',"background":'red',"z-index":"1" });
          //  track.style.background='red';
          //  track.innerHTML='*';
          // document.body.appendChild(track);
      //}
    //}
}

(function() {
  function startup() {
      setupSocket();
      senditems;

      retouchunit = 0.5;

      video = document.getElementById('video');
      outputcanvas = document.getElementById('outputcanvas');
      outputctx = outputcanvas.getContext('2d');
      overlaycanvas= document.getElementById('overlay');
      overlayCC=overlaycanvas.getContext('2d');

      tosendoricanvas= document.getElementById('tosendoriginal');
      tosendfinishcanvas = document.getElementById('tosendretouched');
      tosendorictx = tosendoricanvas.getContext('2d');
      tosendfinishctx= tosendfinishcanvas.getContext('2d');

      outputphoto = new Image();

      startbutton = document.getElementById('startbutton');
      imgtgtbtn = document.getElementById('imgtgtbtn');
      retouchbtn = document.getElementById('retouchbtn');
      sendbtn = document.getElementById('sendbtn');
      name = document.getElementById('name');

      navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || navigator.msGetUserMedia);

      navigator.getMedia(
          { video: true, audio: false},
          function(stream) {
              if (navigator.mozGetUserMedia) {
                video.mozSrcObject = stream;
              } else {
                var vendorURL = window.URL || window.webkitURL;
                video.src = vendorURL.createObjectURL(stream);
              }
              video.play();
          }, // function stream
          function(err) {
            console.log("An error occured! " + err);
          }
      );//navigator.getMedia

      video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);      
          if (isNaN(height)) {
            height = width / (4/3);
          }

          video.setAttribute('width', width);
          video.setAttribute('height', height);
          outputcanvas.setAttribute('width', width);
          outputcanvas.setAttribute('height', height);
          overlaycanvas.setAttribute('width', width);
          overlaycanvas.setAttribute('height', height);
          canvasInput.setAttribute('width', width);
          canvasInput.setAttribute('height', height);
          // tosendoricanvas.setAttribute('width', window.innerWidth/3);
          // tosendoricanvas.setAttribute('height', window.innerWidth/3/width*height );
          // tosendfinishcanvas.setAttribute('width', window.innerWidth/3);
          // tosendfinishcanvas.setAttribute('height',window.innerWidth/3/width*height);

          tosendoricanvas.setAttribute('width', width);
          tosendoricanvas.setAttribute('height', height);
          tosendfinishcanvas.setAttribute('width', width);
          tosendfinishcanvas.setAttribute('height',height);

          overlayposition = getposition(outputcanvas);
          overlaycanvas.style.top=overlayposition[0]+'px';
          overlaycanvas.style.left=overlayposition[1]+'px';
          streaming = true;
        }
      }, false);

      /*-----------start-------------*/
      startbutton.addEventListener('click', function(ev){
          if(facefound==true){
              takepicture();
              ev.preventDefault();
              $('.buttons').css({"opacity":"1"});

              targetFace();  //target face
          }else{
            alert('face haven\'t found yet, please try to adjust your face');
          }
      }, false);

      clearphoto();
      clmtrackerinit();

      // imgtgtbtn.addEventListener('click',function(ev){   
      //     ev.preventDefault();
      //     ctrackerimage = new clm.tracker();
      //     ctrackerimage.init(pModel);
      //     ctrackerimage.start(outputcanvas);
      //     drawLoopimg();
      // });
      retouchbtn.addEventListener('click',function(ev){
          ev.preventDefault();
          overlayCC.drawImage(outputcanvas,targetpositions[1][0].toFixed(2)-2, 70, 
            targetpositions[13][0].toFixed(2)-targetpositions[1][0].toFixed(2)+5,targetpositions[7][1].toFixed(2)+500-targetpositions[20][1].toFixed(2),
            targetpositions[1][0].toFixed(2)-2, 70,
            targetpositions[13][0].toFixed(2)-targetpositions[1][0].toFixed(2)+5,targetpositions[7][1].toFixed(2)+500-targetpositions[20][1].toFixed(2));
          
          retoucheyes();
          retouchcheek();

          tosendorictx.drawImage(outputcanvas, 0,0, outputcanvas.width, outputcanvas.height,0,0, tosendoricanvas.width, tosendoricanvas.height);
          applyfilter();
          sendbtn.innerHTML="&nbsp Send These &nbsp";
      });
      sendbtn.addEventListener('click',function(ev){
          ev.preventDefault();
          sendphotos();
      });

  }//startup

  window.addEventListener('load', startup, false);
})();



function retoucheyes(){
  var scaleRatio = 10;
  var radius = distance(targetpositions[25], targetpositions[23])/2 * 1.7 ;
  var leftlimit = targetpositions[23][0];
  var rightlimit = targetpositions[25][0];
  var toplimit = targetpositions[24][1];
  var bottomlimit = targetpositions[26][1];
  var centerPostion = [targetpositions[27][0], targetpositions[27][1]];

  for (var i = toplimit*0.95; i <centerPostion[1]+radius; i+=retouchunit) { //line by line
      for (var j = centerPostion[0]-radius; j <centerPostion[0]+radius; j+=retouchunit) { //row by row

           var positionToUse = eyebigger(centerPostion, [j,i], radius, scaleRatio);
           temp = distance(positionToUse,centerPostion);
           if(  temp <= radius ) {
                var replace= outputctx.getImageData(j,i,retouchunit,retouchunit);
                  
                if( temp/radius>0.93 ){ //融合
                    var originaldata= outputctx.getImageData(positionToUse[0],positionToUse[1],retouchunit,retouchunit);
                    replace.data[0] = (replace.data[0]+originaldata.data[0])/2;
                    replace.data[1] = (replace.data[1]+originaldata.data[1])/2;
                    replace.data[2] = (replace.data[2]+originaldata.data[2])/2;
                    replace.data[3] = (replace.data[3]+originaldata.data[3])/2;
                    replace.data[4] = (replace.data[4]+originaldata.data[4])/2;
                    replace.data[5] = (replace.data[5]+originaldata.data[5])/2;
                    replace.data[6] = (replace.data[6]+originaldata.data[6])/2;
                    replace.data[7] = (replace.data[7]+originaldata.data[7])/2;
                    replace.data[8] = (replace.data[8]+originaldata.data[8])/2;
                    replace.data[9] = (replace.data[9]+originaldata.data[9])/2;
                    replace.data[10] = (replace.data[10]+originaldata.data[10])/2;
                    replace.data[11] = (replace.data[11]+originaldata.data[11])/2;
                    replace.data[12] = (replace.data[12]+originaldata.data[12])/2;
                    replace.data[13] = (replace.data[13]+originaldata.data[13])/2;
                    replace.data[14] = (replace.data[14]+originaldata.data[14])/2;
                    replace.data[15] = (replace.data[15]+originaldata.data[15])/2;
                }
                overlayCC.putImageData(replace,positionToUse[0],positionToUse[1]);
              
           }
      }
  }

  radius = distance(targetpositions[28], targetpositions[30])/2 *1.7 ;
  leftlimit = targetpositions[30][0];
  rightlimit = targetpositions[28][0];
  toplimit = targetpositions[29][1];
  bottomlimit = targetpositions[31][1];
  centerPostion = [targetpositions[32][0], targetpositions[32][1]];
  //right eye
  for (var i = toplimit*0.95; i < bottomlimit*1.2; i+=retouchunit) { //line by line
      for (var j = centerPostion[0]-radius; j <centerPostion[0]+radius; j+=retouchunit) { //row by row
           var positionToUse = eyebigger(centerPostion, [j,i], radius, scaleRatio);
           if(  distance(positionToUse,centerPostion) < radius ) {
              var replace= outputctx.getImageData(j,i,retouchunit,retouchunit);
              overlayCC.putImageData(replace,positionToUse[0],positionToUse[1]);

                if( temp/radius>0.93 ){ //融合
                    var originaldata= outputctx.getImageData(positionToUse[0],positionToUse[1],retouchunit,retouchunit);
                    replace.data[0] = (replace.data[0]+originaldata.data[0])/2;
                    replace.data[1] = (replace.data[1]+originaldata.data[1])/2;
                    replace.data[2] = (replace.data[2]+originaldata.data[2])/2;
                    replace.data[3] = (replace.data[3]+originaldata.data[3])/2;
                    replace.data[4] = (replace.data[4]+originaldata.data[4])/2;
                    replace.data[5] = (replace.data[5]+originaldata.data[5])/2;
                    replace.data[6] = (replace.data[6]+originaldata.data[6])/2;
                    replace.data[7] = (replace.data[7]+originaldata.data[7])/2;
                    replace.data[8] = (replace.data[8]+originaldata.data[8])/2;
                    replace.data[9] = (replace.data[9]+originaldata.data[9])/2;
                    replace.data[10] = (replace.data[10]+originaldata.data[10])/2;
                    replace.data[11] = (replace.data[11]+originaldata.data[11])/2;
                    replace.data[12] = (replace.data[12]+originaldata.data[12])/2;
                    replace.data[13] = (replace.data[13]+originaldata.data[13])/2;
                    replace.data[14] = (replace.data[14]+originaldata.data[14])/2;
                    replace.data[15] = (replace.data[15]+originaldata.data[15])/2;
                }
                overlayCC.putImageData(replace,positionToUse[0],positionToUse[1]);
             
           }
      }
  }
}//retouch eyes



function retouchcheek(){

}//retouch cheek


function applyfilter(){
    try { filtercanvas = fx.canvas();
    } catch (e) {   alert(e);     }

    //tosendfinishctx.drawImage(overlay, 0,0, outputcanvas.width, outputcanvas.height,0,0, tosendfinishcanvas.width, tosendfinishcanvas.height);
    //only change face
    tosendfinishctx.drawImage(outputcanvas,0,0);
    var texture = filtercanvas.texture( outputcanvas );
    var news = filtercanvas.draw(texture).hueSaturation(0, 0.24).vignette(0.34, 0.68).update();
    tosendfinishctx.drawImage(news,0,0,tosendfinishcanvas.width, tosendfinishcanvas.height,
      0,0, tosendfinishcanvas.width, tosendfinishcanvas.height);
    //filtercanvas.draw(texture0);

    texture = filtercanvas.texture( overlaycanvas );
    news = filtercanvas.draw(texture).hueSaturation(0, 0.1).denoise(250).update();
    tosendfinishctx.drawImage(news, targetpositions[1][0]-5, targetpositions[20][1]-100, 
            targetpositions[13][0]+5-targetpositions[1][0],targetpositions[7][1]+120-targetpositions[20][1],
            targetpositions[1][0]-5, targetpositions[20][1]-100,
            targetpositions[13][0]+5-targetpositions[1][0],targetpositions[7][1]+120-targetpositions[20][1]);

}//applyfilter 

function drawLoopimg() {
  drawRequest = requestAnimFrame(drawLoopimg);
  overlayCC.clearRect(0, 0, width, height);
  if (ctrackerimage.getCurrentPosition()) {
    ctrackerimage.draw(overlay);
  }
}//drawloopimg


function drawLoopvideo() {
  requestAnimationFrame(drawLoopvideo);
  cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
  ctracker.draw(canvasInput);
}  


function clmtrackerinit(){
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(video);

    canvasInput = document.getElementById('clmcanvas');
    cc = canvasInput.getContext('2d');

    canvasInput.height = height;
    canvasInput.width = width;
    drawLoopvideo();
    positionLoop();
}


function positionLoop() {
    requestAnimationFrame(positionLoop);
    var positions = ctracker.getCurrentPosition();
    // print the positions
    // var positionString = "";
    // if (positions) {
    //   for (var p = 0;p < 71;p++) {
    //       var x = positions[p][0].toFixed(2);
    //       var y = positions[p][1].toFixed(2);
    //       positionString += "point "+p+" : ["+x+","+y+"]<br/>";
    //       //var newdiv = document.createElement('div');
    //       //newdiv.innerHTML = "**";
    //   }
    //   document.getElementById('positions').innerHTML = positionString;
    // }
}//positionLoop()

document.addEventListener("clmtrackrNotFound", function(event) {
  facefound = false;
  if(ctrackerimage)   ctrackerimage.stop();
  var errormsg= "The tracking had problems with finding a face. Face not found.";
  document.getElementById('status').innerHTML = errormsg;
}, false);

document.addEventListener("clmtrackrLost", function(event) {
  facefound=false;
  if(ctrackerimage)   ctrackerimage.stop();
  var errormsg= "The tracking had problems with finding a face. Face lost";
  document.getElementById('status').innerHTML = errormsg;
}, false);

document.addEventListener("clmtrackrConverged", function(event) {
  facefound=true;
  document.getElementById('status').innerHTML="Face Found. You can take a photo now";
}, false);
        



function setupSocket() {
  socket = io().connect('http://localhost:3000/');

  socket.on('connect',function(){   
    connected = true;
    console.log('client connected');
    sessionid = io().id;

    socket.emit('session',io().id);
  });//on connect

  socket.on('receiveimagedata',function(data){
    console.log("data");
    console.log(data);
  });

  socket.on('disconnect', function () {
    connected=false;
    console.log('client disconnected');
    //socket.emit('disconnect');
  });
}//setupSocket()




function sendphotos () {
    sendoriphoto = tosendoricanvas.toDataURL();
    sendfinishphoto = tosendfinishcanvas.toDataURL();

    name = document.getElementById('name').value;
    var postername = document.getElementById('postername').value;
    senditems = {
        'id': sessionid,
        'name':name,
        'postername':postername,
        'original':sendoriphoto,
        'retouched':sendfinishphoto
    };

    socket.emit('retouchdata',senditems); //on colors 
}








