package main

import (
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"sfews-backend/config"
	"sfews-backend/controllers"
	"sfews-backend/databases"
	"sfews-backend/databases/migrations"
	"sfews-backend/handlers"
	"sfews-backend/models"
	"sfews-backend/mqtt"
	"sfews-backend/repositories"
	"sfews-backend/routes"
	"sfews-backend/services"

	"github.com/gin-gonic/gin"
)

func main() {
	// load env
	if err := config.LoadEnv(); err != nil {
		log.Fatalf("failed to load env : %v", err)
	}

	// database
	db, err := databases.InitDB()
	if err != nil {
		log.Fatalf("failed to init db : %v", err)
	}

	log.Print("db is connected.")

	err = migrations.Migrations(db)
	if err != nil {
		log.Fatalf("failed to migrate database : %v", err)
	}

	sensorRepo := repositories.NewSensorRepo(db)
	sensorServices := services.NewSensorService(*sensorRepo)
	sensorControllers := controllers.NewSensorController(*sensorServices)

	// sse
	handlers.RunBroadcaster()

	// mqtt
	mqttClient, err := mqtt.CreateClient()
	if err != nil {
		log.Fatalf("failed to create mqtt client : %v", err)
	}

	client := mqtt.Mqtt{
		Client:         mqttClient,
		SensorServices: *sensorServices,
	}

	err = client.ConnectAndSubscribe()
	if err != nil {
		log.Printf("failed to connect & subsribe : %v", err)

		data := models.NodeStatus{
			Status:  false,
			Message: "Failed connect to Node",
		}

		jsonData, err := json.Marshal(data)
		if err != nil {
			log.Printf("Failed to marshal data")
			return
		}

		handlers.SendBroadcast("node", string(jsonData))
	}

	// routes
	r := gin.Default()

	route := routes.Routes{
		Route:            r,
		SensorController: *sensorControllers,
	}

	route.MapRoutes()

	r.Run(":8080")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)

	<-quit

	client.Disconnect()

	Database, err := db.DB()
	if err == nil {
		Database.Close()
	}

	log.Println("shutting down is ok")
}
