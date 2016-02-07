		var socket = io().connect('http://localhost:8000/');

		socket.on('connect',function(){	
			$('form').submit(function(e){ // not #form2
				e.preventDefault();
				var site =document.querySelector('input[name="site"]:checked').value;
				socket.emit('colorchoice',site);

				$('#submission').addClass('swipout');
				$('#submission').offset({left:-2000});
				$('#iconshoice').removeClass("hidden");
				$('#iconshoice').addClass("show");
				//$('#iconshoice').switchClass( "show", "hidden", 1000, "easeInOutQuad" );
			});//form submit

			$('#iconshoice').click(function(){ //not working unforutunately....
				console.log("asdf");
				$('#submission').addClass('swipin');
				$('#submission').offset({left:0});
				$('#iconshoice').removeClass("show");
				$('#iconshoice').addClass("hidden");
			});

			socket.on('colors',function(colors){
				var cos=[]; cos[0]=0;
				var sum=0;
				var len= colors.length;

				//colors.forEach(function(val) { sum += val;});    faster than for loop
				for(var i =0; i<colors.length; i++){
					sum+=colors[i][0];
					cos[i+1]=sum;
				}

				var canvas = document.getElementById("maincanvas");  
		//console.log($('#maincanvas').width());
		//console.log(canvas.width);  //why $('#maincanvas').width() != canvas.width ??? 

				if (canvas.getContext)   
				{  
					var ctx = canvas.getContext("2d");         
					var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

					for(var i=0;i<len;i++){		
						if ((cos[i]!=cos[i-1] && i>0) || i==0 ){
							gradient.addColorStop(cos[i]/sum,colors[i][1]);    //if 
						}	
					}
					ctx.fillStyle = gradient;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

			});	//on colors	


		});//on connect

		socket.on('disconnect', function () {
			console.log('client disconnected');
		});








