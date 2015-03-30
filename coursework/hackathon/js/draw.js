var container = document.getElementById("container");
var width= Math.floor(document.getElementById("container").offsetWidth/35);   
var height = Math.floor(document.getElementById("container").offsetHeight/34); 

window.addEventListener('load',loaded);

function loaded(){ 
	var hackthon="~1234567890-=QWERTYUIOP[]ASDFGHJKL;'ZXCVBNM,./";
	var pickedNum;
	var picked;

	for (var j = 0; j < height;j++) {
		for (var i = 0; i <width; i++) {
			var createDiv=document.createElement("DIV");
			createDiv.setAttribute("class","basic"); 		
			createDiv.setAttribute("id",j*width+i); 
			pickedNum= Math.floor(Math.random()*46);        //random the character on each keyboard
			picked=hackthon[pickedNum];
			createDiv.innerHTML = picked;
			container.appendChild(createDiv);
		}
	}
 	H(1);
	A(5);
	C(9);
	K(12);
	A(16);
	T(20);
	H(24);
	O(28);
	N(32);
}


function drawOneCharacter(left, top){
	var createH = document.createElement("DIV");
	createH.setAttribute("class","imgH");
	createH.style.left="35"*left;
	createH.style.top="34"*top;
	var hackthon="HACKATHON";
	var pickedNum= Math.floor(Math.random()*8);
	var picked=hackthon[pickedNum];
	createH.innerHTML = picked;
	container.appendChild(createH);
}
function I(left){
	for (var i = 5; i < 10; i++) {           //h
		var createH = document.createElement("DIV");
		drawOneCharacter(left, i);
	}
}


function H(left){
	I(left);
	I(left+2);
	drawOneCharacter(left+1,7);
}

function A(left){
	H(left);
	drawOneCharacter(left+1,5);
}

function C(left){
	I(left);
	drawOneCharacter(left+1,5);
	drawOneCharacter(left+1,9);
}

function K(left){
	I(left);
	drawOneCharacter(left+2,5);
	drawOneCharacter(left+2,9);
	drawOneCharacter(left+1,6);
	drawOneCharacter(left+1,8);
}
function T(left){
	I(left+1);
	drawOneCharacter(left,5);
	drawOneCharacter(left+2,5);
}
function O(left){
	C(left);
	I(left+2);
}
function N(left){
	I(left);
	I(left+3);
	drawOneCharacter(left+1,6);
	drawOneCharacter(left+2,7);
}

