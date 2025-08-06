package main

import (
	"log"
	"sfews-backend/config"
	"sfews-backend/databases"
	"sfews-backend/databases/migrations"
	"sfews-backend/mqtt"
)

func main() {
	// load env
	if err := config.LoadEnv(); err != nil {
		log.Fatalf("failed to load env : %v", err)
	}

	// database
	err := databases.InitDB()
	if err != nil {
		log.Fatalf("failed to init db : %v", err)
	}

	log.Print("db is connected.")

	err = migrations.Migrations()
	if err != nil {
		log.Fatalf("failed to migrate database : %v", err)
	}

	mqttClient, err := mqtt.CreateClient()
	if err != nil {
		log.Fatalf("failed to create mqtt client : %v", err)
	}

	client := mqtt.Mqtt{
		Client: mqttClient,
	}

	err = client.Connect()
	if err != nil {
		log.Fatalf("failed to connect client mqtt : %v", err)
	}

	log.Print("Mqtt is connected")

	client.Subscribe("sensor/rain", 0, mqtt.SensorRainHandler)

	select {}
}
