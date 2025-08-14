package main

import (
	"log"
	"os"
	"os/signal"
	"sfews-backend/config"
	"sfews-backend/controllers"
	"sfews-backend/databases"
	"sfews-backend/databases/migrations"
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

	// mqtt
	mqttClient, err := mqtt.CreateClient()
	if err != nil {
		log.Fatalf("failed to create mqtt client : %v", err)
	}

	sensorRepo := repositories.NewSensorRepo(db)
	sensorServices := services.NewSensorService(*sensorRepo)
	sensorControllers := controllers.NewSensorController(*sensorServices)

	client := mqtt.Mqtt{
		Client:         mqttClient,
		SensorServices: *sensorServices,
	}

	err = client.ConnectAndSubscribe()
	if err != nil {
		log.Fatalf("failed to connect & subsribe : %v", err)
	}

	// routes
	r := gin.Default()

	route := routes.Routes{
		Route:            r,
		SensorController: *sensorControllers,
	}

	route.MapRoutes()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)

	<-quit

	client.Disconnect()

	postgresDB, err := db.DB()
	if err == nil {
		postgresDB.Close()
	}

	log.Println("shutting down is ok")
}
