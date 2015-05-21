var customUUID;

var arrayBufferToFloat = function (ab) {
    var a = new Float32Array(ab);
    return a[0]
};

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    
    newDate.setHours(hours - offset);
    
    return newDate;
}


var app = {
    
initialize: function() {
    this.bindEvents();
},
    
    
bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
},
    
onDeviceReady: function() {
    app.initData();
    rfduino.discover(5, function(device) {
                     console.log(JSON.stringify(device));
                     
                     if( device['name']=='iAir'){
                     customUUID = device['uuid'];
                     console.log("customUUIDstored:"+customUUID);
                     }
                     }, function (){
                     app.onError();
                     console.log("discover failure!");
                     });
},
    
initData:function(){
    $('#lastSynced').html( 'Last synced at: <br>'+window.localStorage.data);  // empty the sync html
    sync.addEventListener('touchstart',this.syncData,false);
    syncing.hidden = true;
    lastSynced.hidden=false;
},
    
syncData: function(){
    var data = new ArrayBuffer(1);
    data[0] = 0x00;
    rfduino.write(data.buffer,function(){console.log("write success!");}, function (){
                  app.onError(); console.log("write failure!")});
    
    console.log("customUUIDstore in syncdata:"+customUUID);
    syncing.hidden=false;
    lastSynced.hidden=true;
    rfduino.connect(customUUID, app.connectSuccess, function (){
                    app.onError(); console.log("connect failure!");
                    syncing.hidden=true;
                    lastSynced.hidden=false;
                    });
    setTimeout(function(){rfduino.disconnect();
               syncing.hidden=true;
               lastSynced.hidden=false;
               }, 9000);
},
    
connectSuccess: function() {
    console.log("connect success!");
    rfduino.onData(app.onData, function (){
                   app.onError(); console.log("ondata failure!");
                   });
},
    
onData: function(data){
    console.log("reading data in onData: ");
    var aqi = arrayBufferToFloat(data).toFixed(0);  //to fix: 保留的小数位
    console.log("aqi"+aqi);
    
    aqnumber.innerHTML= aqi;
    var syncDate= new Date();
    syncDate = syncDate.toString();
    lastSynced.innerHTML ='Last Synced at : <br>'+ syncDate;
    window.localStorage.data = syncDate;
    console.log("syncdate:"+syncDate);
    console.log("local storage:"+window.localStorage.data);
},
    
onError: function( err ){
    alert("Error : "+err);
}
    
};  //app





/*// Update DOM on a Received Event
 receivedEvent: function(id) {
 //        var parentElement = document.getElementById(id);
 //        var listeningElement = parentElement.querySelector('.listening');
 //        var receivedElement = parentElement.querySelector('.received');
 //        listeningElement.setAttribute('style', 'display:none;');
 //        receivedElement.setAttribute ('style', 'display:block;');
 console.log('Received Event: ' + id);
 }
 */




/*
 var arrayBufferToFloat = function (ab) {
 var a = new Float32Array(ab);     // Float32Arrays cannot change size after creation.
 return a[0];
 };
 
 var app = {
 initialize: function() {
 this.bindEvents();
 detailPage.hidden = true;
 },
 bindEvents: function() {
 document.addEventListener('deviceready', this.onDeviceReady, false);
 refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
 closeButton.addEventListener('touchstart', this.disconnect, false);
 deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
 },
 onDeviceReady: function() {
 app.refreshDeviceList();
 },
 refreshDeviceList: function() {
 deviceList.innerHTML = ''; // empties the list
 rfduino.discover(5, app.onDiscoverDevice, app.onError);
 },
 onDiscoverDevice: function(device) {
 var listItem = document.createElement('li'),
 html = '<b>' + device.name + '</b><br/>' +
 'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
 'Advertising: ' + device.advertising + '<br/>' +
 device.uuid;
 
 listItem.setAttribute('uuid', device.uuid);
 listItem.innerHTML = html;
 deviceList.appendChild(listItem);
 },
 connect: function(e) {
 var uuid = e.target.getAttribute('uuid'),
 onConnect = function() {
 rfduino.onData(app.onData, app.onError);
 app.showDetailPage();
 };
 
 rfduino.connect(uuid, onConnect, app.onError);
 },
 onData: function(data) {
 console.log(data);
 var celsius = arrayBufferToFloat(data),
 fahrenheit = celsius * 1.8 + 32;
 
 tempCelsius.innerHTML = celsius.toFixed(2);
 tempFahrenheit.innerHTML = fahrenheit.toFixed(2);
 },
 disconnect: function() {
 rfduino.disconnect(app.showMainPage, app.onError);
 },
 showMainPage: function() {
 mainPage.hidden = false;
 detailPage.hidden = true;
 },
 showDetailPage: function() {
 mainPage.hidden = true;
 detailPage.hidden = false;
 },
 onError: function(reason) {
 alert(reason); // real apps should use notification.alert
 }
 };
 */

/*var customUUID;

var arrayBufferToFloat = function (ab) {
    var a = new Float32Array(ab);
    return a[0]
};

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    
    newDate.setHours(hours - offset);
    
    return newDate;
}


var app = {
    
initialize: function() {
    this.bindEvents();
    this.sendData();
},
    
    
bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
},
    
onDeviceReady: function() {
    app.initData();
    rfduino.discover(5, function(device) {
                     console.log(JSON.stringify(device));
                     
                     if( device['name']=='iAir'){
                        customUUID = device['uuid'];
                        console.log("customUUIDstored:"+customUUID);
                     }
       }, function (){
                     app.onError();
                     console.log("discover failure!");
    });
},
    
initData:function(){
    $('#lastSynced').html( 'Last synced at: <br>'+window.localStorage.data);  // empty the sync html
    sync.addEventListener('touchstart',this.syncData,false);
    syncing.hidden = true;
    lastSynced.hidden=false;
},
    
syncData: function(){
    
    console.log("customUUIDstore in syncdata:"+customUUID);
    syncing.hidden=false;
    lastSynced.hidden=true;
    rfduino.connect(customUUID, app.connectSuccess, function (){
                    app.onError(); console.log("connect failure!");
                    syncing.hidden=true;
                    lastSynced.hidden=false;
    });
    
    
    setTimeout(function(){
               syncing.hidden=true;
               lastSynced.hidden=false;
               }, 9000);
    setTimeout(function(){
               rfduino.disconnect();}, 10000);
},
    
connectSuccess: function() {
    console.log("connect success!");
    app.sendData();
    
    rfduino.onData(app.onData, function (){
                   app.onError(); console.log("ondata failure!");
    });
},
    
onData: function(data){
    var whole = arrayBufferToFloat(data).toFixed(2);  //to fix: 保留的小数位
    var aqi = Math.floor(whole);
    var temperature = Math.floor(100*(whole-aqi));
    console.log("aqi"+whole+"aqi:"+aqi+"tem:"+temperature);
    
    app.saveToserver(aqi,temperature);
    
    aqnumber.innerHTML= aqi;
    tempCelsius.innerHTML = temperature;
    tempFahrenheit.innerHTML= Math.floor(temperature * 1.8 + 32);
    
    var syncDate= new Date();
    syncDate = syncDate.toString();
    lastSynced.innerHTML ='Last Synced at : <br>'+ syncDate;
    window.localStorage.data = syncDate;
    console.log("syncdate:"+syncDate);
    console.log("local storage:"+window.localStorage.data);
    
    
},
    
sendData: function(){
    console.log("sending data");
    rfduino.write("0", app.sendSuccess, app.onError);
},
    
saveToserver:function(aqi,temperature){
    console.log("in save to server");
    var dateNow= new Date();
    console.log("in save!"+aqi+","+dateNow);
    
   // var da = new Date(dateNow.toLocaleString()).getTime();
    var da = dateNow.getTime();
    console.log(da);
    
    $.get("http://airwearable.herokuapp.com/save/aqi="+aqi+"/temp="+temperature+"/date="+da,function( data ) {
          if(data=="done") console.log("save success");
          else console.log("save fail");
          }
    );
},
    
ledon:function(){
    
},
    
ledoff:function(){
    
},
    
sendSuccess: function(){
    console.log("send successful!!");
},
    
onError: function( err ){
    alert("Error : "+err);
}
    
};  //app



var iconAction = function(){
    aqinum;
    
};

var serverCall = {


};//servarCall*/

