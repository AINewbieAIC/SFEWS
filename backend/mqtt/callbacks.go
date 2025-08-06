package mqtt

import (
	"fmt"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

var SensorRainHandler mqtt.MessageHandler = func(c mqtt.Client, m mqtt.Message) {
	if m.Topic() != "sensor/rain" {
		return
	}

}

var ConnectHandler mqtt.OnConnectHandler = func(c mqtt.Client) {
	fmt.Println("Connected")
}

var ConnectLostHandler mqtt.ConnectionLostHandler = func(c mqtt.Client, err error) {
	fmt.Printf("Connect Lost : %v", err)
}
