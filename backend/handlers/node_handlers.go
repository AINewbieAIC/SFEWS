package handlers

import (
	"net/http"
	"sfews-backend/helpers"

	"github.com/gin-gonic/gin"
)

var NodeStatusOnline = false

func NodeStatus(ctx *gin.Context) {
	data := map[string]bool{
		"node_status": NodeStatusOnline,
	}

	helpers.ResponseJson(ctx, http.StatusOK, true, data, "success get node information")
}
