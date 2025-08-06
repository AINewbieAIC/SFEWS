package mqtt

import (
	"fmt"
	"os"
	"strconv"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type Mqtt struct {
	Client mqtt.Client
}

func CreateClient() (mqtt.Client, error) {
	MQTT_URL, err := CreateMQTTUrl()
	if err != nil {
		return nil, err
	}

	opts := mqtt.NewClientOptions()
	opts.AddBroker(MQTT_URL)
	opts.SetClientID(os.Getenv("MQTT_CLIENT_ID"))
	// opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = ConnectHandler
	opts.OnConnectionLost = ConnectLostHandler
	client := mqtt.NewClient(opts)
	return client, nil
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

func (m *Mqtt) Connect() error {
	if token := m.Client.Connect(); token.Wait() && token.Error() != nil {
		return token.Error()
	}

	return nil
}

func (m *Mqtt) Subscribe(topic string, qos byte, handler mqtt.MessageHandler) mqtt.Token {
	return m.Client.Subscribe(topic, qos, handler)
}
