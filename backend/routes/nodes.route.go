package routes

import (
	"sfews-backend/handlers"

	"github.com/gin-gonic/gin"
)

func (r *Routes) Node(group *gin.RouterGroup) {
	nodes := group.Group("/node")
	{
		nodes.GET("/status", handlers.NodeStatus)
	}
}
