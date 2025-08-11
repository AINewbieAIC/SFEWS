package mqtt

import (
	"encoding/json"
	"log"
	"sfews-backend/models"
	"sfews-backend/services"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

func SensorRainHandler(sensor *services.SensorService) mqtt.MessageHandler {
	return func(c mqtt.Client, m mqtt.Message) {
		var rain models.Rain
		if err := json.Unmarshal(m.Payload(), &rain); err != nil {
			return
		}

	}
}

var ConnectHandler mqtt.OnConnectHandler = func(c mqtt.Client) {
	log.Println("MQTT IS CONNECTED")
}

var ConnectLostHandler mqtt.ConnectionLostHandler = func(c mqtt.Client, err error) {
	log.Println("MQTT IS DISCONNECT")
}
