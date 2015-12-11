var width = 540;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

var streaming = false;
var video = null;
var outputcanvas = null;
var outputctx=null;
var outputphoto = null;
var startbutton = null;
var ctracker; 
var ctrackerimage;
var canvasInput;
var cc;
var imgtgtbtn = null;
var retouchbtn = null;
var sendbtn = null;

function clearphoto() {
    outputctx.fillStyle = "#AAA";
    outputctx.fillRect(0, 0, outputcanvas.width, outputcanvas.height);

    var data = outputcanvas.toDataURL('image/png');
    //outputphoto.setAttribute('src', data);
    outputphoto.src=data;
}

function takepicture() {
    if (width && height) {
      outputcanvas.width = width;
      outputcanvas.height = height;
      outputctx.drawImage(video, 0, 0, width, height);

      var data = outputcanvas.toDataURL('image/png');
      //outputphoto.setAttribute('src', data);
      outputphoto.src=data;
    } else {
      clearphoto();
    }
}

/*
        var img = new Image();
        img.onload = function() {
          if (img.height > 500 || img.width > 700) {
            var rel = img.height/img.width;
            var neww = 700;
            var newh = neww*rel;
            if (newh > 500) {
              newh = 500;
              neww = newh/rel;
            }
            canvas.setAttribute('width', neww);
            canvas.setAttribute('height', newh);
            cc.drawImage(img,0,0,neww, newh);
          } else {
            canvas.setAttribute('width', img.width);
            canvas.setAttribute('height', img.height);
            cc.drawImage(img,0,0,img.width, img.height);
          }
        }
        img.src = e.target.result;
      };//return function
    })(fileList[fileIndex]);//if file index
    reader.readAsDataURL(fileList[fileIndex]);
    overlayCC.clearRect(0, 0, 720, 576);
    document.getElementById('convergence').innerHTML = "";
    ctrack.reset();
*/


(function() {
  function startup() {
      video = document.getElementById('video');
      outputcanvas = document.getElementById('outputcanvas');
      outputctx = outputcanvas.getContext('2d');

      //outputphoto = document.getElementById('outputphoto');
      outputphoto = new Image();
      //append to output

      startbutton = document.getElementById('startbutton');
      imgtgtbtn = document.getElementById('imgtgtbtn');
      retouchbtn = document.getElementById('retouchbtn');
      sendbtn = document.getElementById('sendbtn');

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
          canvasInput.setAttribute('width', width);
          canvasInput.setAttribute('height', height);
          streaming = true;
        }
      }, false);

      /*-----------start-------------*/
      startbutton.addEventListener('click', function(ev){
          takepicture();
          ev.preventDefault();
          $('.buttons').css({"opacity":"1"});
      }, false);

      clearphoto();
      clmtrackerinit();

      imgtgtbtn.addEventListener('click',function(ev){
          var src = "img/test.png"
          outputphoto.onload = function() {
            outputctx.drawImage(outputphoto,0,0, width, height);
          };
          outputphoto.src=src;
          //outputphoto.width=width; 
          

          ev.preventDefault();

          ctrackerimage = new clm.tracker();
          ctrackerimage.init(pModel);
          ctrackerimage.start(outputcanvas);
          drawLoop();
      });
      retouchbtn.addEventListener('click',function(ev){
          ev.preventDefault();

      });
      sendbtn.addEventListener('click',function(ev){
          ev.preventDefault();

      });

  }//startup

  window.addEventListener('load', startup, false);
})();




function drawLoop() {
  requestAnimationFrame(drawLoop);
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

    drawLoop();
}


function positionLoop() {
    requestAnimationFrame(positionLoop);
    var positions = ctracker.getCurrentPosition();
    // print the positions
    var positionString = "";
    if (positions) {
      for (var p = 0;p < 10;p++) {
        positionString += "featurepoint "+p+" : ["+positions[p][0].toFixed(2)+","+positions[p][1].toFixed(2)+"]<br/>";
        var newdiv = document.createElement('div');
        newdiv.innerHTML = "**";
        //newdiv.style
      }
      document.getElementById('positions').innerHTML = positionString;
    }
}//positionLoop()
















