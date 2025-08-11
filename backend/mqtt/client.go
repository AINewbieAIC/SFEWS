package mqtt

import (
	"fmt"
	"os"
	"sfews-backend/services"
	"strconv"
	"sync"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type Services struct {
	Sensor services.SensorService
}

type Mqtt struct {
	Client   mqtt.Client
	Services Services
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
	opts.AutoReconnect = true
	opts.SetConnectTimeout(10 * time.Second)
	opts.SetKeepAlive(60 * time.Second)
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

func (m *Mqtt) Disconnect() {
	m.Client.Disconnect(250)
}

func (m *Mqtt) Subscribe(topic string, qos byte, handler mqtt.MessageHandler) mqtt.Token {
	return m.Client.Subscribe(topic, qos, handler)
}

func (m *Mqtt) ConnectAndSubscribe() error {
	err := m.Connect()
	if err != nil {
		return err
	}

	topics := map[string]mqtt.MessageHandler{
		"sensor/rain": Rain(&m.Services.Sensor),
	}

	var wg sync.WaitGroup
	errCh := make(chan error, len(topics))
	// doneCh := make(chan struct{})

	for topic, handler := range topics {
		wg.Add(1)
		go func(tp string, h mqtt.MessageHandler) {
			defer wg.Done()
			token := m.Subscribe(topic, 0, h)
			if token.Wait() && token.Error() != nil {
				errCh <- token.Error()
			} else {
				errCh <- nil
			}
		}(topic, handler)
	}

	// for i := 0; i < len(topics); i++ {
	// 	if subErr := <-errCh; subErr != nil {
	// 		return subErr
	// 	}
	// }

	wg.Wait()
	close(errCh)

	for e := range errCh {
		if e != nil {
			return e
		}
	}

	return nil
}
