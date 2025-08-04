package main

import (
	"os"
	"testing"

	"github.com/joho/godotenv"
)

func TestMqttPublish(t *testing.T) {
	_ = godotenv.Load()
	t.Log(os.Getenv("MQTT_URL"))

	mqttClient, err := CreateMQTTClientConnection()
	if err != nil {
		t.Fatalf("error client : %v", err)
	}

	if token := mqttClient.Connect(); token.Wait() && token.Error() != nil {
		t.Fatalf("Fatal : %v", err)
	}

	token := mqttClient.Publish("sensor/rain", 0, false, "Halo Test")
	token.Wait()
}
