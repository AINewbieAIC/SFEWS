package mqtt

import (
	"encoding/json"
	"log"
	"sfews-backend/models"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

var SensorRainHandler mqtt.MessageHandler = func(c mqtt.Client, m mqtt.Message) {
	var rain models.Rain
	if err := json.Unmarshal(m.Payload(), &rain); err != nil {
		log.Printf("error unmarshal payload MessageHandler : %v\n", err)
		return
	}

}

var ConnectHandler mqtt.OnConnectHandler = func(c mqtt.Client) {
	log.Println("MQTT IS CONNECTED")
}

var ConnectLostHandler mqtt.ConnectionLostHandler = func(c mqtt.Client, err error) {
	log.Println("MQTT IS DISCONNECT")
}
