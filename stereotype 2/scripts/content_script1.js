var toprow;
var insert;
var keyword="";
var regfind;
var imgs = [];
var imginsert;
var email;

$("document").ready(function(){
    console.log("document ready");
    imgs = [];
    toprow = document.getElementById('taw');

    //targetkeyword();
    //parseherf(); //regfind = *google.com/search*q= ;
    addimageandinsertwords();
});

function insertwords(){
    insert = document.createElement('div');
    insert.innerHTML="People of all races and genders can be successful";
    insert.setAttribute("class","words");
    toprow.appendChild(insert);
}


function addimageandinsertwords(){
    var d = targetkeyword();

    imginsert = document.createElement("div");
    imginsert.setAttribute("id","imginsert");
    toprow.appendChild(imginsert);

    for (var i = 0; i < d["link"].length; i++) {
        imgs[i] = document.createElement('img');
        imgs[i].src = d["link"][i];
        imgs[i].setAttribute("class","imgs");

        imginsert.appendChild(imgs[i]);
    }

    insert = document.createElement('div');
    insert.innerHTML= d["sentence"];
    insert.setAttribute("class","words");
    toprow.appendChild(insert);
   // console.log(d);

    var email = document.createElement('div');
    email.innerHTML =' <p> Help us to target more stereotyped google image results. Simply send us the keyword you think that is inapproapriate presented in google image search result. <a href="stereotyped@gmail.com">stereotyped@gmail.com </a></p>';

}


function targetkeyword(){

    var replacedata;
    var str = document.title;
    var s = str.split("- Google");
    keyword = s[0].trim();

    return replacejs1[0][keyword];
}
    