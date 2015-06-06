/*
This RFduino sketch demonstrates a full bi-directional Bluetooth Low
Energy 4 connection between an iPhone application and an RFduino.
This sketch also demonstrates how to select a slower connection
interval, which will slow down the response rate, but also drastically
reduce the power consumption of the RFduino.

This sketch works with the rfduinoLedButton iPhone application.

The button on the iPhone can be used to turn the green led on or off.
The button state of button 1 is transmitted to the iPhone and shown in
the application.
*/

#include <RFduinoBLEiAir.h>

int current_quality =-1;

int SWITCH = 6;
int RED_LED_PIN = 2;
int GREEN_LED_PIN = 3;
int BLUE_LED_PIN = 4;

int velocity=SECONDS(3);
float sensorValue = 0;
float temp = 0; 
 
 
void setup() {
  pinMode(SWITCH, INPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  

  Serial.begin(9600);
  RFduinoBLE.advertisementData = "AirQuality";

  // start the BLE stack
  RFduinoBLE.begin();
  Serial.println( RFduinoBLE.deviceName );
}

void loop() {
  // sample once per second
  RFduino_ULPDelay( velocity );
  
  
  sensorValue = analogRead(5);
  temp = RFduino_temperature(CELSIUS);
  sensorValue = sensorValue+temp/100; 
  Serial.println(sensorValue);
  
  RFduinoBLE.sendFloat(sensorValue);    // send the sample to the iPhone

  //connection interval the iPhone actually selected after a button press
  int connInterval = RFduinoBLE.getConnInterval();
  
  Serial.print("digitalread:"); 
  Serial.println(digitalRead(SWITCH));
  
  if ( digitalRead(SWITCH) == HIGH )   //if turn on the switch to light up
    ledon( calibration(sensorValue) );
  else   //turn off the leds
    ledoff();
 
}




void RFduinoBLE_onConnect()
{
  Serial.println("connect!");
  velocity=SECONDS(3);
  
  sensorValue = analogRead(5);
  temp = RFduino_temperature(CELSIUS);
  sensorValue = sensorValue+temp/100; 
  Serial.println(sensorValue);
  
  RFduinoBLE.sendFloat(sensorValue);    // send the sample to the iPhone
}

void RFduinoBLE_onDisconnect()
{
  //digitalWrite(led, LOW);
  //velocity=INFINITE;
  ledoff();
  Serial.println("disconnect!");
}



void RFduinoBLE_onReceive(char *data, int len)
{
  Serial.println("on Receive!!");
  
  if (data[0]=='0') // IF turn the led on 
    Serial.println(data);
  else  //if not turn the leds off
    Serial.println("on receive but no data!");
  
  ledon( calibration(sensorValue) );
}



int calibration(float aqindex){ // need to change the whole library
  
  //if( aqindex>200 ){ Serial.println("Super High Pollution!"); return 3;}
  if(aqindex>160) { Serial.println("High Pollution!"); return 2;}
  else if(aqindex<160 && aqindex>100) { Serial.println("Low Pollution!"); return 1;}
  else if(aqindex<100) { Serial.println("Fresh Air! Yay~"); return 0; }  //fresh air
  
  else  { Serial.println("Sensor error!"); return -1; }
}


void ledon( int which){
  if( which == 0){//fresh air
    analogWrite(RED_LED_PIN, 0);
    analogWrite(BLUE_LED_PIN, 0);
    analogWrite(GREEN_LED_PIN, 250);
  }else if( which == 1) { //low pollution
    analogWrite(RED_LED_PIN, 250);
    analogWrite(BLUE_LED_PIN, 0);
    analogWrite(GREEN_LED_PIN, 0);
  }
  else if( which == 2) { //high pollution
    analogWrite(RED_LED_PIN, 250);
    analogWrite(BLUE_LED_PIN, 200);
    analogWrite(GREEN_LED_PIN, 0);
  }
  
  delay(3000); //light up at least for 3 seconds
}

void ledoff(){
    analogWrite(RED_LED_PIN, 0);
    analogWrite(BLUE_LED_PIN, 0);
    analogWrite(GREEN_LED_PIN, 0);
}
