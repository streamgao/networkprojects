
document.onkeypress=onKeyPress;
var count=0;

function onKeyPress(){

	var pX= Math.floor(Math.random()*width);        //random the character on each keyboard
	var pY= Math.floor(Math.random()*height);
	var getId= document.getElementById(pY*width+pX);
	getId.style.background="url(img/pressed1.jpg)"+" "+"center center";
	//console.log(count);
	count++;

	if(count==15){   //refresh
		$(".basic").css('background','url(img/back.jpg) center center');
		$(".wave1").css('background','url(img/back.jpg) center center');
		$(".wave2").css('background','url(img/back.jpg) center center');
		$(".wave3").css('background','url(img/back.jpg) center center');
		alert("Again or Click your mouse!");
		count=0;
	}
}


$("#container").click ( 
  function onClicked(e){
	var centerX = Math.floor(  (e.pageX-$("#container").offset().left)/35 );
	var centerY = Math.floor(  (e.pageY-$("#container").offset().top)/34 ) ;

	// 3 layers of waves 
	var wave1 = new Array(height);  //center  
	var wave2 = new Array(2);       
	var wave3 = new Array(2);
	for( var i = 0; i<2; i++ ){    
		wave2[i]= new Array(height);
		wave3[i]= new Array(height);
	}

	var j=centerX;
	setTimeout(waveMove,0);
	function waveMove(){	   //begin the wave animation
			for( var i = 0; i<height; i++ ){    
				wave1[i]= document.getElementById(j+i*width);
				wave2[0][i]= document.getElementById(j-1+i*width);		
				wave2[1][i]= document.getElementById(j+1+i*width);
				wave3[0][i]= document.getElementById(j-2+i*width);
				wave3[1][i]= document.getElementById(j+2+i*width);

		//wave1[i].className += " wave1";
				wave1[i].className = "wave1";
				wave2[0][i].className = "wave2";
				wave2[1][i].className = "wave2";
				wave3[0][i].className = "wave3";
				wave3[1][i].className = "wave3";
			}
			j++;

			if( j < width-2){   //animation for the rest of the colums 
				setTimeout(waveMove,50);
				//$(".imgHanimation").className="imgH";
			}
	}//waveMove

			var imgH= $(".imgH");
		    console.log(imgH);
		    imgH.className = "imgHanimation";    //begin shine animation
		    console.log(imgH);
	} ); //click