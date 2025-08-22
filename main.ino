#include <Wire.h>
#include "RTClib.h"
#include <WiFi.h>
#include <ArduinoJson.h>
#include <format>
#include <PubSubClient.h>

WiFiClient espClient;
RTC_DS1307 rtc;
PubSubClient client(espClient);

const int trigPin = 33;
const int echoPin = 34;
const int rain_ao = 35;
const int rain_do = 13;
const int buzz = 27;
const int led_bhy = 12;
const int led_waspd = 14;
const int led_aman = 32;

// Setup MQTT Broker
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;

bool isRain = false;
DateTime StartRain;
int rainDurationMinutes;
String rain_status;
#define SOUND_SPEED 0.034 // Kecepatan Suara

long duration;
float distanceCm;
const float distanceFromGround = 142; // Set ground to 1 m
float water_level;
int year;
int month;
int date;
int hour;
int minutes;
int second;

// Set Wifi Connection
const char* ssid = "ESP32Demo";
const char* password = "12345678";

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println(" connected");
    } else {
      Serial.print(" failed, rc=");
      Serial.print(client.state());
      delay(2000);
    }
  }
}
void setup() {
  Serial.begin(115200); // Starts the serial communication
  Wire.begin(26,25);

  rtc.begin(); // load the time from your computer.
  rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));

  analogReadResolution(12); // 0-4095 ADC default ESP32 (12 bits)
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  pinMode(buzz, OUTPUT);
  pinMode(rain_do, INPUT);
  Serial.println("Connecting to:");
  Serial.print(ssid);
  WiFi.begin(ssid,password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Prints Connection Status
  Serial.println("Wifi Status: Connected");
  Serial.println("Local IP:");
  Serial.print(WiFi.localIP());
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {

  // Read Time
  DateTime now = rtc.now();
  // Convert time to unix time data
  time_t currentTime = now.unixtime();

  // year = now.year();
  // month = now.month();
  // date = now.day();
  // hour = now.hour();
  // minutes = now.minute();
  // second = now.second();

  // Check Timestamp
  // time_t time_stamp = checkTime(String(year), String(month), String(date), String(second), String(minutes), String(hour));

  // Server url
  String server_url;

  // Rain Status
  int ADC_Rain = analogRead(rain_ao); // Semakin kecil ADC (ex: <1000) maka semakin deras hujannya

  if(!isRain) {
    // Tidak Hujan
    if(digitalRead(rain_do) == LOW) {
      // Terdeteksi Hujan
      Serial.println("Sedang Hujan!!");
      StartRain = now;
      isRain = true;
    } else {
      // Selesai Hujan
      Serial.print("Durasi Hujan Terakhir (Menit): ");
      Serial.println(rainDurationMinutes);
      rainDurationMinutes = 0;
    }
  } else {
    // Hujan
    if(digitalRead(rain_do) == HIGH) {
      // Berhenti Hujan
      TimeSpan RainTime = now - StartRain;
      isRain = false;
      rainDurationMinutes = RainTime.totalseconds() / 60;
    }
  }

  // Check Rain Status
  // rain_intensity_adc > 3500 → Tidak Hujan  
  // rain_intensity_adc 2800–3500 → Gerimis  
  // rain_intensity_adc 1800–2800 → Hujan Sedang  
  // rain_intensity_adc < 1800 → Hujan Deras  

  if(ADC_Rain > 3500 || digitalRead(rain_do) == HIGH) {
    rain_status = "tidak";
  } else if(ADC_Rain >= 2800 && ADC_Rain < 3500) {
    rain_status = "gerimis";
  } else if(ADC_Rain >= 1800 && ADC_Rain < 2800) {
    rain_status = "sedang";
  } else if(ADC_Rain < 1800) {
    rain_status = "deras";
  }
  // Connection update status
  bool is_connected;
  if(WiFi.status() != WL_CONNECTED) {
    is_connected = false;
  } else {
    is_connected = true;
  }


  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  
  // Calculate the distance
  distanceCm = duration * SOUND_SPEED/2;
  
  if(distanceCm < distanceFromGround) {
    water_level = distanceFromGround - distanceCm;
  } else {
    water_level = 0;
  }

  //Prints Network Status
  if(is_connected) {
    Serial.println("Wifi Status: Connected");
  } else {
    Serial.println("Wifi Status: Lost");
  }
  // Prints the water level in the Serial Monitor
  Serial.println(water_level);
  Serial.println(rain_status);
  // Prints the ADC Rain Output
  Serial.println(ADC_Rain);
  // Prints Time Stamp
  // Serial.println(time_stamp);

  // MQTT Server Connect
  if (!client.connected()) reconnect();
  client.loop();

  send_to_dashboard(server_url, currentTime, water_level, rain_status, ADC_Rain, rainDurationMinutes);
  delay(1000);
}

// String checkTime(String year, String month, String date, String seconds, String minutes, String hour) {
//   String TimeStamp = date + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;
//   return TimeStamp;
// }

void send_to_dashboard(String server_url, time_t timestamp, float water_level, String rain_status, int ADC_Rain, int rainduration) {
  String response;
  
  String jsonParams;
  DynamicJsonDocument payload(256);

  payload["timestamp"] = timestamp;
  payload["water_level"] = water_level;
  payload["rain_status"] = rain_status;
  payload["rain_adc_intensity"] = ADC_Rain;
  payload["rain_duration_minutes"] = rainduration; 

  serializeJson(payload, jsonParams); // Menyimpan hasil JSON ke dalam String
  client.publish("sensor/rain", jsonParams.c_str()); // Send to MQTT server
  Serial.println(jsonParams);

}