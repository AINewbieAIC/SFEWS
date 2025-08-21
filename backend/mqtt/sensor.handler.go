package mqtt

import (
	"encoding/json"
	"log"
	"sfews-backend/handlers"
	"sfews-backend/models"
	"sfews-backend/services"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

func Rain(sensor *services.SensorService) mqtt.MessageHandler {
	return func(c mqtt.Client, m mqtt.Message) {
		var rain models.Rain
		if err := json.Unmarshal(m.Payload(), &rain); err != nil {
			log.Printf("error decode : %v", err)
			return
		}

		if err := sensor.InsertDataRain(&rain); err != nil {
			log.Printf("error insert data rain : %v", err)
			return
		}

		handlers.SendBroadcast("notif", rain)

		log.Println("Success save new data : " + string(m.Payload()))
	}
}
