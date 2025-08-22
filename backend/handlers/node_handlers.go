package handlers

import (
	"net/http"
	"sfews-backend/helpers"
	"sfews-backend/models"

	"github.com/gin-gonic/gin"
)

var NodeStatusOnline = false

func NodeStatus(ctx *gin.Context) {
	var message string

	if NodeStatusOnline {
		message = "Node is online"
	} else {
		message = "Node is offline"
	}

	data := models.NodeStatus{
		Status:  NodeStatusOnline,
		Message: message,
	}

	helpers.ResponseJson(ctx, http.StatusOK, true, data, "success get node information")
}
