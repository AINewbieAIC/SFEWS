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

var nodeStatus = false

var ConnectHandler mqtt.OnConnectHandler = func(c mqtt.Client) {
	log.Println("MQTT IS CONNECTED")

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
