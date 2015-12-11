
  function displaymyvideo(){  //width
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({  video:true, audio:false}, function(stream) {
        my_stream = stream;

        videoInput.src = window.URL.createObjectURL(stream) || stream;

        videoInput.play();
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
    } 
  }//displaymyvideo

    var videoInput = document.getElementById('video');
    displaymyvideo();


    var ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoInput);
    
    function positionLoop() {
      requestAnimationFrame(positionLoop);
      var positions = ctracker.getCurrentPosition();
      // do something with the positions ...
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

    positionLoop();
    
    var canvasInput = document.getElementById('canvas');
    var cc = canvasInput.getContext('2d');
    function drawLoop() {
      requestAnimationFrame(drawLoop);
      cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
      ctracker.draw(canvasInput);
    }
    drawLoop();






