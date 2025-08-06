package mqtt

import (
	"fmt"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

var MessagePubHandler mqtt.MessageHandler = func(c mqtt.Client, m mqtt.Message) {
	fmt.Printf("Received message: %s from topic : %s\n", m.Payload(), m.Topic())
}

var ConnectHandler mqtt.OnConnectHandler = func(c mqtt.Client) {
	fmt.Println("Connected")
}

var ConnectLostHandler mqtt.ConnectionLostHandler = func(c mqtt.Client, err error) {
	fmt.Printf("Connect Lost : %v", err)
}
