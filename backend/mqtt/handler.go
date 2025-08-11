package mqtt

import (
	"log"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

var ConnectHandler mqtt.OnConnectHandler = func(c mqtt.Client) {
	log.Println("MQTT IS CONNECTED")
}

var ConnectLostHandler mqtt.ConnectionLostHandler = func(c mqtt.Client, err error) {
	log.Println("MQTT IS DISCONNECT")
}
