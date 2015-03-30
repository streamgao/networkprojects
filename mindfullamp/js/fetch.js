/**
 * Created by stream on 11/22/14.
 */

function now(){
    this.now=new Date();
//  this.year= this.now.getFullYear();
    this.date= this.now.getDate();
    this.month= this.now.getMonth()+1;

    if( this.now.getHours()>18 ){  //trick.....should change later
        this.date= this.now.getDate()+1;
    }
    if( this.date<10 ){
        this.date = "0"+this.date.toString();
    }
    if( this.month<10 ){
        this.month = "0"+this.month.toString();
    }
    this.today = this.now.getFullYear() + "-" + this.month + "-" + this.date;
}


var messageSend = " ";
$( document ).ready(function() {   //in order to load fetch.js before facebook.js
    messageSend = "";
});


function publicFeed( accessToken ) {
    console.log('Welcome!  Fetching your information.... ');
    /*FB.api('/me/home','get',
     function(response) {
     console.log('p Successful login for: ' + response);
     var jsonD =  {data:JSON.stringify(response)};
     console.log("jsonD:", response);
     });*/
    $.get('https://graph.facebook.com/me/feed?access_token='+accessToken, function (feeds) {  //request data
        console.log(feeds.data);
        var feed = feeds.data;
        var today = new now();
        console.log( today );

        for(var i=0; i< feed.length; i++){
            if( feed[i]['updated_time'].substr(0, 10) == today.today ){
                if( feed[i]['message']!=null ){
                    console.log(i+","+feed[i]['message']);
                    messageSend += feed[i]['message'];
                }
            }//if time today
        }
        callAnalysis( messageSend );
    });//get feed
}//publicfeed


function callAnalysis( messageAll ){
    $("#feed").html(messageAll);
    $.get("analyse/respond.php?analyseText="+messageAll, function(json){
        //var score = JSON && JSON.parse(json) || $.parseJSON(json);
        var score = JSON.parse(json);
        console.log("result2");
        console.log(score);
        $("#result").html( score['type']+" , "+ score['score'] );
    });

}