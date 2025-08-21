package mqtt

import (
	"encoding/json"
	"log"
	"sfews-backend/handlers"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type NodeStatus struct {
	NodeOnline bool `json:"node_status"`
}

var ConnectHandler mqtt.OnConnectHandler = func(c mqtt.Client) {
	log.Println("MQTT IS CONNECTED")
	handlers.NodeStatusOnline = true

	nodeNotif := NodeStatus{
		NodeOnline: true,
	}

	jsonData, err := json.Marshal(nodeNotif)
	if err != nil {
		handlers.SendBroadcast("error", "failed to marshal json")
		return
	}

	handlers.SendBroadcast("node", jsonData)
}

var ConnectLostHandler mqtt.ConnectionLostHandler = func(c mqtt.Client, err error) {
	log.Println("MQTT IS DISCONNECT")

	handlers.NodeStatusOnline = false

	nodeNotif := NodeStatus{
		NodeOnline: false,
	}

	jsonData, err := json.Marshal(nodeNotif)
	if err != nil {
		handlers.SendBroadcast("error", "failed to marshal json")
		return
	}

	handlers.SendBroadcast("node", jsonData)
}
