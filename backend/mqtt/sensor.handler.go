package mqtt

import (
	"encoding/json"
	"log"
	"sfews-backend/handlers"
	"sfews-backend/helpers"
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

		timeFormat := helpers.UnixToTimeString(int64(rain.Timestamp))
		dateFormat := helpers.UnixToDate(int64(rain.Timestamp))

		title := ""

		switch rain.AlertLevel {
		case -2:
			title = "Nihil"
		case -1:
			title = "Error"
		case 0:
			title = "Kondisi Normal"
		case 1:
			title = "Status Waspada"
		case 2:
			title = "Peringatan Bahaya"
		}

		message := helpers.SetMessage(rain)
		tipe := helpers.SetType(rain.AlertLevel)

		alert := models.Alerts{
			ID:      rain.ID,
			Time:    timeFormat,
			Date:    dateFormat,
			Title:   title,
			Message: message,
			Type:    tipe,
		}

		jsonData := helpers.ToJSON(alert)

		handlers.SendBroadcast("notification", jsonData)

		log.Println("Success save new data : " + string(m.Payload()))
	}
}
