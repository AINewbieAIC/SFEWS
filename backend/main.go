package main

import (
	"fmt"
	"log"
	"os"
	"sfews-backend/config"
	"strconv"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type Hujan struct {
	Timestamp        int
	WaterLevel       int
	RainStatus       bool
	RainAdcIntensity any
}

var messagePubHandler mqtt.MessageHandler = func(c mqtt.Client, m mqtt.Message) {
	fmt.Printf("Received message: %s from topic : %s\n", m.Payload(), m.Topic())
}

var connectHandler mqtt.OnConnectHandler = func(c mqtt.Client) {
	fmt.Println("Connected")
}

var connectLostHandler mqtt.ConnectionLostHandler = func(c mqtt.Client, err error) {
	fmt.Printf("Connect Lost : %v", err)
}

func CreateMQTTUrl() (string, error) {
	MQTT_URL := os.Getenv("MQTT_URL")
	MQTT_PORT_STR := os.Getenv("MQTT_PORT")
	MQTT_PORT, err := strconv.Atoi(MQTT_PORT_STR)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("tcp://%s:%d", MQTT_URL, MQTT_PORT), nil
}

func CreateMQTTClientConnection() (mqtt.Client, error) {
	MQTT_URL, err := CreateMQTTUrl()
	if err != nil {
		return nil, err
	}

	opts := mqtt.NewClientOptions()
	opts.AddBroker(MQTT_URL)
	opts.SetClientID(os.Getenv("MQTT_CLIENT_ID"))
	// opts.SetUsername(os.Getenv("MQTT_USERNAME"))
	// opts.SetPassword(os.Getenv("MQTT_PASSWORD"))
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler
	client := mqtt.NewClient(opts)
	return client, nil
}

func main() {
	// load env
	if err := config.LoadEnv(); err != nil {
		log.Fatalf("failed to load env : %v", err)
	}

	mqttClient, err := CreateMQTTClientConnection()
	if err != nil {
		log.Fatalf("failed to create mqtt client : %v", err)
	}

	if token := mqttClient.Connect(); token.Wait() && token.Error() != nil {
		log.Fatalf("Fatal : %v", err)
	}

	mqttClient.Subscribe("sensor/rain", 0, messagePubHandler)
	select {}
}
