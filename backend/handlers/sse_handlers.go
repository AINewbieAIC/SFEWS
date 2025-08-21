package handlers

import (
	"encoding/json"
	"io"
	"sync"

	"github.com/gin-contrib/sse"
	"github.com/gin-gonic/gin"
)

type Event struct {
	Type string
	Data interface{}
}

var (
	clients   = make(map[chan Event]bool)
	broadcast = make(chan Event)
	mu        sync.Mutex
)

func SSEHandler(ctx *gin.Context) {
	messageChan := make(chan Event)

	mu.Lock()
	clients[messageChan] = true
	mu.Unlock()

	defer func() {
		mu.Lock()
		delete(clients, messageChan)
		mu.Unlock()
		close(messageChan)
	}()

	ctx.Writer.Header().Set("Content-Type", "text/event-stream")
	ctx.Writer.Header().Set("Cache-Control", "no-cache")
	ctx.Writer.Header().Set("Connection", "keep-alive")
	ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*")

	ctx.Stream(func(w io.Writer) bool {
		if ev, ok := <-messageChan; ok {

			dataBytes, _ := json.Marshal(ev.Data)

			ctx.Render(-1, sse.Event{
				Event: ev.Type,
				Data:  string(dataBytes),
			})
			return true
		}
		return false
	})
}

func RunBroadcaster() {
	go func() {
		for {
			ev := <-broadcast
			mu.Lock()
			for clientChan := range clients {
				clientChan <- ev
			}
			mu.Unlock()
		}
	}()
}

func SendBroadcast(eventType string, data interface{}) {
	broadcast <- Event{
		Type: eventType,
		Data: data,
	}
}
