package routes

import (
	"sfews-backend/handlers"

	"github.com/gin-gonic/gin"
)

func (r *Routes) SSERoutes(group *gin.RouterGroup) {
	group.GET("/events", handlers.SSEHandler)
}
