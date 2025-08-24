package mqtt

import (
	"encoding/json"
	"log"
	"sfews-backend/handlers"
	"sfews-backend/models"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

var ConnectHandler mqtt.OnConnectHandler = func(c mqtt.Client) {
	log.Println("MQTT IS CONNECTED")

	handlers.NodeStatusOnline = true

	nodeNotif := models.NodeStatus{
		Status:  true,
		Message: "Node is online",
	}

	jsonData, err := json.Marshal(nodeNotif)
	if err != nil {
		handlers.SendBroadcast("error", "failed to marshal json")
		return
	}

	handlers.SendBroadcast("node", string(jsonData))
}

var ConnectLostHandler mqtt.ConnectionLostHandler = func(c mqtt.Client, err error) {
	log.Println("MQTT IS DISCONNECT")

	handlers.NodeStatusOnline = false

	nodeNotif := models.NodeStatus{
		Status:  handlers.NodeStatusOnline,
		Message: "Node is disconnected",
	}

	jsonData, marshalErr := json.Marshal(nodeNotif)
	if marshalErr != nil {
		handlers.SendBroadcast("error", "failed to marshal json")
		return
	}

	handlers.SendBroadcast("node", string(jsonData))
}
